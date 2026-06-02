"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckoutScreen } from "@/components/CheckoutScreen";
import { Header } from "@/components/Header";
import { auditPlans } from "@/components/plans";
import { normalizeClientUrl } from "@/lib/clientAudit";

export function CheckoutRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") ?? "";
  const initialPlan = auditPlans.some((plan) => plan.name === planParam) ? planParam : "Стандарт";
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  let url = "";

  try {
    url = normalizeClientUrl(searchParams.get("url") ?? "");
  } catch {
    url = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Введите корректный email");
      return;
    }

    setError("");
    setSuccess(true);
    if (url) {
      window.setTimeout(() => router.push(`/full-report?url=${encodeURIComponent(url)}`), 650);
    }
  }

  return (
    <>
      <Header />
      <main>
        <CheckoutScreen
          url={url}
          selectedPlan={selectedPlan}
          email={email}
          telegram={telegram}
          error={error}
          success={success}
          onPlanChange={setSelectedPlan}
          onEmailChange={setEmail}
          onTelegramChange={setTelegram}
          onSubmit={handleSubmit}
        />
      </main>
    </>
  );
}
