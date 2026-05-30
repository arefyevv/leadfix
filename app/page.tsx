"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckoutScreen } from "@/components/CheckoutScreen";
import { FullReport } from "@/components/FullReport";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { LandingSections } from "@/components/LandingSections";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PreviewReport } from "@/components/PreviewReport";
import type { Screen } from "@/components/types";
import type { AnalyzeResponse, AuditAnalysis } from "@/types/audit";

const loadingSteps = [
  "Открываем сайт",
  "Смотрим первый экран",
  "Проверяем оффер",
  "Ищем CTA и формы",
  "Оцениваем доверие",
  "Проверяем мобильную версию",
  "Собираем предварительный отчёт"
];

function normalizeClientUrl(value: string) {
  const rawUrl = value.trim();
  const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  return new URL(withProtocol).href;
}

export default function LeadFixPage() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [urlInput, setUrlInput] = useState("");
  const [analysis, setAnalysis] = useState<AuditAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("Стандарт");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const reportDate = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date());
  }, []);

  async function handleHeroSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoadingIndex(0);

    let normalizedUrl = "";

    try {
      normalizedUrl = normalizeClientUrl(urlInput);
    } catch {
      setError("Введите корректный адрес сайта");
      return;
    }

    setUrlInput(normalizedUrl);
    setAnalysis(null);
    setScreen("loading");

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setLoadingIndex(Math.min(index, loadingSteps.length - 1));
    }, 850);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl })
      });
      const data = (await response.json()) as AnalyzeResponse | { error?: string };

      if (!response.ok || !("analysis" in data)) {
        throw new Error("error" in data ? data.error : undefined);
      }

      setLoadingIndex(loadingSteps.length - 1);
      setUrlInput(data.analysis.url);
      setAnalysis(data.analysis);
      setScreen("preview");
    } catch (requestError) {
      setScreen("hero");
      setError(
        requestError instanceof Error && requestError.message
          ? requestError.message
          : "Не удалось открыть сайт. Проверьте адрес или попробуйте позже."
      );
    } finally {
      window.clearInterval(timer);
    }
  }

  function resetAudit() {
    setScreen("hero");
    setUrlInput("");
    setAnalysis(null);
    setError("");
    setLoadingIndex(0);
    setSelectedPlan("Стандарт");
    setEmail("");
    setTelegram("");
    setCheckoutError("");
    setCheckoutSuccess(false);
  }

  function handleCheckoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutSuccess(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setCheckoutError("Введите корректный email");
      return;
    }

    setCheckoutError("");
    setCheckoutSuccess(true);
    window.setTimeout(() => setScreen("fullReport"), 650);
  }

  return (
    <>
      {screen !== "hero" && <Header onAuditClick={resetAudit} />}
      <main>
        {screen === "hero" && (
          <>
            <HeroSection url={urlInput} error={error} onUrlChange={setUrlInput} onSubmit={handleHeroSubmit} />
            <LandingSections />
          </>
        )}

        {screen === "loading" && <LoadingScreen url={urlInput} steps={loadingSteps} stepIndex={loadingIndex} />}

        {screen === "preview" && analysis && (
          <PreviewReport analysis={analysis} onCheckout={() => setScreen("checkout")} onReset={resetAudit} />
        )}

        {screen === "checkout" && analysis && (
          <CheckoutScreen
            url={analysis.url}
            selectedPlan={selectedPlan}
            email={email}
            telegram={telegram}
            error={checkoutError}
            success={checkoutSuccess}
            onPlanChange={setSelectedPlan}
            onEmailChange={setEmail}
            onTelegramChange={setTelegram}
            onSubmit={handleCheckoutSubmit}
          />
        )}

        {screen === "fullReport" && analysis && <FullReport analysis={analysis} reportDate={reportDate} />}
      </main>
    </>
  );
}
