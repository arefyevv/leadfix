"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckoutScreen } from "@/components/CheckoutScreen";
import { FullReport } from "@/components/FullReport";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PreviewReport } from "@/components/PreviewReport";
import type { MockAnalysis, Screen } from "@/components/types";

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

function createMockAnalysis(url: string): MockAnalysis {
  return {
    url,
    title: "Mock analyzed page",
    description: "Mock conversion audit data",
    h1: "Найдём, где ваш сайт теряет заявки.",
    heroText: "AI + правила конверсии: за 5 минут найдём слабый оффер, CTA, доверие, формы и мобильные проблемы.",
    buttons: ["Найти проблемы", "Получить полный аудит"],
    hasForm: true,
    desktopScreenshot: "",
    mobileScreenshot: ""
  };
}

export default function LeadFixPage() {
  const [screen, setScreen] = useState<Screen>("hero");
  const [urlInput, setUrlInput] = useState("");
  const [analysis, setAnalysis] = useState<MockAnalysis | null>(null);
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

  function handleHeroSubmit(event: FormEvent<HTMLFormElement>) {
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
    setAnalysis(createMockAnalysis(normalizedUrl));
    setScreen("loading");

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setLoadingIndex(Math.min(index, loadingSteps.length - 1));

      if (index >= loadingSteps.length - 1) {
        window.clearInterval(timer);
        window.setTimeout(() => setScreen("preview"), 650);
      }
    }, 850);
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
      <Header onAuditClick={resetAudit} />
      <main>
        {screen === "hero" && (
          <HeroSection url={urlInput} error={error} onUrlChange={setUrlInput} onSubmit={handleHeroSubmit} />
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
