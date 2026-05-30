"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckoutScreen } from "@/components/CheckoutScreen";
import { Header } from "@/components/Header";
import { normalizeClientUrl } from "@/lib/clientAudit";

export function CheckoutRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState("Стандарт");
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
    window.setTimeout(() => router.push(`/full-report?url=${encodeURIComponent(url)}`), 650);
  }

  return (
    <>
      <Header onAuditClick={() => router.push("/")} />
      <main>
        {url ? (
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
        ) : (
          <section className="analysis screen">
            <div className="analysis__inner route-error">
              <h1>Не указан сайт для аудита</h1>
              <button className="report-button report-button--primary" type="button" onClick={() => router.push("/")}>Проверить сайт</button>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
