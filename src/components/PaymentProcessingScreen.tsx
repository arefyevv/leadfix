"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAudit, normalizeClientUrl } from "@/lib/clientAudit";

type PaymentProcessingScreenProps = {
  leadId: string;
  plan: string;
  url: string;
};

const auditSteps = [
  "Проверяем доступность сайта",
  "Анализируем первый экран",
  "Разбираем оффер и ценность",
  "Проверяем CTA, формы и путь к заявке",
  "Ищем блоки, которые снижают доверие",
  "Проверяем мобильную версию",
  "Собираем отчет и рекомендации"
];

const REPORT_REDIRECT_TIMEOUT_MS = 150_000;

function isProPlan(plan: string) {
  return plan.toLocaleLowerCase("ru-RU").includes("pro");
}

export function PaymentProcessingScreen({ leadId, plan, url }: PaymentProcessingScreenProps) {
  const router = useRouter();
  const isExpertReview = isProPlan(plan);
  const [stepIndex, setStepIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(8);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");
  const normalizedUrl = useMemo(() => {
    try {
      return url ? normalizeClientUrl(url) : "";
    } catch {
      return "";
    }
  }, [url]);
  const reportHref = normalizedUrl
    ? `/full-report?url=${encodeURIComponent(normalizedUrl)}&plan=${encodeURIComponent(plan || "Экспресс")}${leadId ? `&lead=${encodeURIComponent(leadId)}` : ""}`
    : "/full-report";

  useEffect(() => {
    if (isReady || error) return;

    const timer = window.setInterval(() => {
      setProgressValue((current) => Math.min(current + Math.max(1, Math.round((95 - current) * 0.13)), 95));
    }, 650);

    return () => window.clearInterval(timer);
  }, [error, isReady]);

  useEffect(() => {
    if (isReady || error) return;

    setStepIndex(Math.min(Math.floor((progressValue / 95) * auditSteps.length), auditSteps.length - 1));
  }, [error, isReady, progressValue]);

  useEffect(() => {
    if (!normalizedUrl) {
      setError("Не получили адрес сайта для анализа. Вернитесь к заказу и укажите URL лендинга.");
      return;
    }

    let cancelled = false;

    fetchAudit(normalizedUrl, { requireAi: true, leadId, plan })
      .then(() => {
        if (cancelled) return;
        setStepIndex(auditSteps.length - 1);
        setProgressValue(100);
        setIsReady(true);
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        setError(requestError instanceof Error ? requestError.message : "Не удалось подготовить отчет.");
      });

    return () => {
      cancelled = true;
    };
  }, [leadId, normalizedUrl, plan]);

  useEffect(() => {
    if (!isReady || !normalizedUrl) return;

    const redirectTimer = window.setTimeout(() => {
      router.push(reportHref);
    }, 1400);

    return () => window.clearTimeout(redirectTimer);
  }, [isReady, normalizedUrl, reportHref, router]);

  useEffect(() => {
    if (!normalizedUrl || !leadId || isReady || error) return;

    const fallbackTimer = window.setTimeout(() => {
      router.push(reportHref);
    }, REPORT_REDIRECT_TIMEOUT_MS);

    return () => window.clearTimeout(fallbackTimer);
  }, [error, isReady, leadId, normalizedUrl, reportHref, router]);

  return (
    <main className="success-page processing-page screen">
      <section className="success-card processing-card" aria-labelledby="processing-title">
        <p className="full-audit__eyebrow">Оплата прошла</p>
        <h1 id="processing-title">
          {isExpertReview ? "Проводим аудит LeadFix Pro" : "Проводим аудит лендинга"}
        </h1>
        <p>
          {isExpertReview
            ? "Проверяем страницу и готовим отчет. После автоматической проверки результат уйдет на экспертную доработку."
            : "Проверяем страницу и собираем отчет. Когда аудит завершится, отчет откроется автоматически."}
        </p>

        <div className="success-meta processing-meta">
          {leadId && <span>ID: {leadId}</span>}
          {plan && <span>Тариф: {plan}</span>}
          {normalizedUrl && <span>URL: {normalizedUrl}</span>}
        </div>

        <div className="processing-progress" aria-label={`Готовность отчета ${progressValue}%`}>
          <div className="processing-progress__top">
            <span>{error ? "Анализ остановлен" : "Анализ URL"}</span>
            <b>{error ? "Ошибка" : isReady ? "Готово" : `${progressValue}%`}</b>
          </div>
          <div className="processing-progress__track">
            <span style={{ width: `${progressValue}%` }} />
          </div>
        </div>

        <div className="processing-current-step" aria-live="polite">
          <span aria-hidden="true" />
          <p>{isReady ? "Отчет готов" : auditSteps[stepIndex]}</p>
        </div>

        <div className="processing-notice">
          {error ||
            (isExpertReview
              ? "AI-отчет откроется автоматически. Финальная экспертная версия будет подготовлена отдельно и продублирована на контакты из заказа."
              : "Не закрывайте страницу. Отчет дополнительно продублируется на контакты, которые вы указали при заказе.")}
        </div>

        <div className="success-actions">
          {isReady ? (
            <a className="checkout-submit" href={reportHref}>
              Открыть отчет
            </a>
          ) : (
            <button className="checkout-submit" type="button" disabled>
              Готовим отчет
            </button>
          )}
          <a className="telegram-button" href="https://t.me/LeadFixRu" target="_blank" rel="noreferrer">
            Поддержка в Telegram
          </a>
        </div>
      </section>
    </main>
  );
}
