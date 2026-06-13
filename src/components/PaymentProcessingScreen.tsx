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
    if (isExpertReview || isReady || error) return;

    const timer = window.setInterval(() => {
      setProgressValue((current) => Math.min(current + Math.max(1, Math.round((95 - current) * 0.13)), 95));
    }, 650);

    return () => window.clearInterval(timer);
  }, [error, isExpertReview, isReady]);

  useEffect(() => {
    if (isExpertReview || isReady || error) return;

    setStepIndex(Math.min(Math.floor((progressValue / 95) * auditSteps.length), auditSteps.length - 1));
  }, [error, isExpertReview, isReady, progressValue]);

  useEffect(() => {
    if (isExpertReview) return;

    if (!normalizedUrl) {
      setError("Не получили адрес сайта для анализа. Вернитесь к заказу и укажите URL лендинга.");
      return;
    }

    let cancelled = false;

    fetchAudit(normalizedUrl)
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
  }, [isExpertReview, normalizedUrl]);

  useEffect(() => {
    if (isExpertReview || !isReady || !normalizedUrl) return;

    const redirectTimer = window.setTimeout(() => {
      router.push(reportHref);
    }, 1400);

    return () => window.clearTimeout(redirectTimer);
  }, [isExpertReview, isReady, normalizedUrl, reportHref, router]);

  if (isExpertReview) {
    return (
      <main className="success-page processing-page screen">
        <section className="success-card processing-card" aria-labelledby="processing-title">
          <p className="full-audit__eyebrow">Оплата прошла</p>
          <h1 id="processing-title">Заявка принята в ручную проверку</h1>
          <p>
            Тариф LeadFix Pro включает AI-анализ и экспертную проверку. Мы не показываем тот же автоматический отчет,
            потому что финальный результат должен быть дополнен вручную.
          </p>

          <div className="success-meta processing-meta">
            {leadId && <span>ID: {leadId}</span>}
            {plan && <span>Тариф: {plan}</span>}
            {normalizedUrl && <span>URL: {normalizedUrl}</span>}
          </div>

          <div className="processing-notice">
            Финальный отчет будет подготовлен до 24 часов и продублирован на контакты, которые вы указали при заказе.
          </div>

          <div className="success-actions">
            <a className="checkout-submit" href="https://t.me/LeadFixRu" target="_blank" rel="noreferrer">
              Написать в поддержку
            </a>
            <a className="telegram-button" href="/">
              Проверить другой сайт
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="success-page processing-page screen">
      <section className="success-card processing-card" aria-labelledby="processing-title">
        <p className="full-audit__eyebrow">Оплата прошла</p>
        <h1 id="processing-title">Формируем аудит лендинга</h1>
        <p>
          Запускаем анализ URL и готовим отчет. Не закрывайте страницу: когда проверка завершится,
          отчет откроется автоматически.
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

        <ol className="processing-steps">
          {auditSteps.map((step, index) => (
            <li
              key={step}
              className={index < stepIndex || isReady ? "is-done" : index === stepIndex ? "is-current" : ""}
            >
              <span aria-hidden="true" />
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <div className="processing-notice">
          {error || "Не закрывайте страницу. Отчет дополнительно продублируется на контакты, которые вы указали при заказе."}
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
