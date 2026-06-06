"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckoutScreen } from "@/components/CheckoutScreen";
import { Header } from "@/components/Header";
import { paidAuditPlans } from "@/components/plans";
import { normalizeClientUrl } from "@/lib/clientAudit";
import type { LeadResponse } from "@/types/lead";

declare global {
  interface Window {
    ym?: (counterId: number, method: string, goal: string) => void;
  }
}

export function CheckoutRoute() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";
  const initialPlan = paidAuditPlans.some((plan) => plan.name === planParam) ? planParam : "Экспресс";
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [urlValue, setUrlValue] = useState(() => {
    try {
      return normalizeClientUrl(searchParams.get("url") ?? "");
    } catch {
      return "";
    }
  });
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);

    let normalizedUrl = "";
    try {
      normalizedUrl = normalizeClientUrl(urlValue);
    } catch {
      setError("Введите корректный адрес сайта");
      return;
    }

    if (!normalizedUrl) {
      setError("Укажите адрес сайта");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Введите корректный email");
      return;
    }

    if (!consent) {
      setError("Подтвердите согласие на обработку персональных данных");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: normalizedUrl,
          plan: selectedPlan,
          email,
          telegram,
          source: "checkout"
        })
      });
      const data = (await response.json()) as LeadResponse | { error?: string };

      if (!response.ok || !("lead" in data)) {
        throw new Error(("error" in data && data.error) || "Не удалось создать заявку");
      }

      setSuccess(true);
      const metrikaId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID);
      if (Number.isFinite(metrikaId)) {
        window.ym?.(metrikaId, "reachGoal", "leadfix_checkout_submit");
      }

      window.location.assign(data.lead.paymentLink);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось создать заявку");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main>
        <CheckoutScreen
          urlValue={urlValue}
          selectedPlan={selectedPlan}
          email={email}
          telegram={telegram}
          consent={consent}
          error={error}
          success={success}
          submitting={submitting}
          onPlanChange={setSelectedPlan}
          onUrlChange={setUrlValue}
          onEmailChange={setEmail}
          onTelegramChange={setTelegram}
          onConsentChange={setConsent}
          onSubmit={handleSubmit}
        />
      </main>
    </>
  );
}
