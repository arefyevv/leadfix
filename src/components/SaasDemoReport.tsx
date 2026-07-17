"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { AuditAnalysis, AuditCategoryId, AuditIssue, AuditIssueSeverity } from "@/types/audit";

type SaasDemoReportProps = {
  analysis: AuditAnalysis;
  reportDate: string;
};

type ReportShot = {
  title: string;
  caption: string;
  url: string;
  variant?: "desktop" | "mobile";
};

const demoShots: Record<string, ReportShot> = {
  hero: {
    title: "Проверяемая зона",
    caption: "Фрагмент первого экрана и зоны принятия решения.",
    url: "/screenshots/report-real-overview.png"
  },
  details: {
    title: "Проверяемая зона",
    caption: "Фрагмент детального разбора с отмеченной проблемной зоной.",
    url: "/screenshots/report-real-details.png"
  },
  mobile: {
    title: "Мобильная зона",
    caption: "Проверка сценария на узком экране.",
    url: "/screenshots/report-real-overview.png",
    variant: "mobile"
  }
};

const categoryHints: Record<AuditCategoryId, string> = {
  offer: "Первый экран, оффер и быстрое понимание ценности.",
  ads: "Совпадение ожидания после клика и содержания первого экрана.",
  mobile: "Удобство чтения, клика и отправки заявки со смартфона.",
  cta: "Кнопки, следующий шаг и путь до заявки.",
  trust: "Факты, кейсы, отзывы и снижение сомнений.",
  forms: "Форма, контакты и трение перед отправкой.",
  structure: "Логика страницы и последовательность аргументов.",
  technical: "Технические препятствия, скорость и доступность."
};

function getSeverityLabel(severity: AuditIssueSeverity) {
  if (severity === "critical") return "Критично";
  if (severity === "high") return "Важно";
  if (severity === "medium") return "Средне";
  return "Рекомендация";
}

function getSeverityTone(severity: AuditIssueSeverity) {
  if (severity === "critical") return "critical";
  if (severity === "high") return "high";
  if (severity === "medium") return "medium";
  return "low";
}

function getScoreTone(score: number) {
  if (score < 60) return "critical";
  if (score < 75) return "medium";
  if (score < 90) return "good";
  return "strong";
}

function getIssueShots(issue: AuditIssue): ReportShot[] {
  if (issue.categoryId === "mobile") return [demoShots.mobile, demoShots.hero];
  if (issue.categoryId === "offer" || issue.categoryId === "cta") return [demoShots.hero, demoShots.details];
  if (issue.categoryId === "trust" || issue.categoryId === "forms") return [demoShots.details, demoShots.hero];
  return [];
}

function getCategoryShot(categoryId: AuditCategoryId) {
  if (categoryId === "mobile") return demoShots.mobile;
  if (categoryId === "offer" || categoryId === "cta" || categoryId === "trust" || categoryId === "forms") return demoShots.details;
  return null;
}

export function SaasDemoReport({ analysis, reportDate }: SaasDemoReportProps) {
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<ReportShot | null>(null);
  const [activeShots, setActiveShots] = useState<Record<string, number>>({});
  const audit = analysis.auditResult;
  const displayUrl = analysis.url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
  const categories = audit.categoryScores;
  const issues = audit.issues;
  const sortedIssues = useMemo(() => [...issues].sort((a, b) => b.priorityScore - a.priorityScore), [issues]);
  const criticalCount = issues.filter((issue) => issue.severity === "critical").length;
  const mediumCount = issues.filter((issue) => issue.severity === "medium" || issue.severity === "high").length;
  const recommendationCount = issues.filter((issue) => issue.severity === "low").length || 1;
  const scoreTone = getScoreTone(audit.overallScore);

  function copyLink() {
    const href = typeof window !== "undefined" ? window.location.href : analysis.url;
    void navigator.clipboard?.writeText(href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="saas-report">
      <div className="saas-report__shell">
        <header className="saas-report-hero">
          <div>
            <p className="saas-report__eyebrow">Полный отчёт LeadFix</p>
            <h1>Аудит лендинга {displayUrl}</h1>
            <div className="saas-report-hero__meta" aria-label="Параметры отчёта">
              <span>Адрес сайта: {analysis.url}</span>
              <span>Дата аудита: {reportDate}</span>
              <span>Тариф: Экспресс</span>
            </div>
          </div>
          <div className="saas-report-hero__actions">
            <button type="button" onClick={() => window.print()}>Скачать PDF</button>
            <button type="button" className="is-secondary" onClick={copyLink}>
              {copied ? "Ссылка скопирована" : "Скопировать ссылку на отчёт"}
            </button>
          </div>
        </header>

        <section className="saas-report-score" aria-label="Общая оценка">
          <div className={`saas-report-score__dial is-${scoreTone}`}>
            <div className="saas-report-score__ring" style={{ "--score": audit.overallScore } as CSSProperties}>
              <strong>{audit.overallScore}</strong>
              <span>/100</span>
            </div>
            <p>Готовность сайта к платному трафику</p>
          </div>
          <div className="saas-report-score__summary">
            <p className="saas-report__eyebrow">Общая оценка</p>
            <h2>Средняя готовность</h2>
            <p>{audit.finalSummary.mainConversionLoss}</p>
            <div className="saas-report-score__scale" aria-hidden="true">
              <span className="is-critical">0–39</span>
              <span className="is-medium">40–74</span>
              <span className="is-good">75–89</span>
              <span className="is-strong">90–100</span>
              <i style={{ left: `${audit.overallScore}%` }} />
            </div>
          </div>
          <div className="saas-report-kpis" aria-label="Ключевые показатели">
            <article><strong>{issues.length}</strong><span>проблем найдено</span></article>
            <article><strong>{criticalCount}</strong><span>критическая</span></article>
            <article><strong>{mediumCount}</strong><span>средних</span></article>
            <article><strong>{recommendationCount}</strong><span>рекомендация</span></article>
          </div>
        </section>

        <section className="saas-report-section">
          <SectionTitle eyebrow="Оценка по зонам" title="8 зон, где лендинг может терять заявки" />
          <div className="saas-report-zone-grid">
            {categories.map((category) => {
              const normalizedScore = category.score * 10;
              const tone = getScoreTone(normalizedScore);
              return (
                <article className="saas-report-zone" key={category.categoryId}>
                  <div className="saas-report-zone__top">
                    <h3>{category.title}</h3>
                    <strong>{normalizedScore}</strong>
                  </div>
                  <div className="saas-report-progress" aria-label={`Оценка ${normalizedScore} из 100`}>
                    <span className={`is-${tone}`} style={{ width: `${normalizedScore}%` }} />
                  </div>
                  <b className={`saas-report-status is-${tone}`}>{category.status}</b>
                </article>
              );
            })}
          </div>
        </section>

        <section className="saas-report-section">
          <SectionTitle eyebrow="Что исправить первым" title="Приоритетные проблемы" />
          <div className="saas-report-priority-list">
            {sortedIssues.map((issue, index) => (
              <article className={`saas-report-priority is-${getSeverityTone(issue.severity)}`} key={issue.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p>{categories.find((category) => category.categoryId === issue.categoryId)?.title || issue.categoryId}</p>
                  <h3>{issue.title}</h3>
                  <b>Что сделать: {issue.recommendation}</b>
                  <small>Где: {issue.location}</small>
                </div>
                <em>{getSeverityLabel(issue.severity)}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="saas-report-section">
          <SectionTitle eyebrow="План правок" title="Что сделать и в каком порядке" />
          <div className="saas-report-plan">
            <ChecklistCard title="Сначала: 24 часа" items={audit.implementationPlan.first24h} tone="critical" />
            <ChecklistCard title="Затем: первая неделя" items={audit.implementationPlan.firstWeek} tone="medium" />
            <ChecklistCard title="После: следующий месяц" items={audit.implementationPlan.nextMonth} tone="good" />
          </div>
        </section>

        <section className="saas-report-section">
          <SectionTitle eyebrow="Карта отчёта" title="8 зон отчёта" />
          <div className="saas-report-map">
            {categories.map((category, index) => {
              const normalizedScore = category.score * 10;
              const tone = getScoreTone(normalizedScore);
              const shot = getCategoryShot(category.categoryId);
              return (
                <article className="saas-report-map-card" key={category.categoryId}>
                  {shot ? <ScreenshotThumb shot={shot} onOpen={setLightbox} /> : null}
                  <div className="saas-report-map-card__head">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{normalizedScore}</strong>
                  </div>
                  <h3>{category.title}</h3>
                  <b className={`saas-report-status is-${tone}`}>{category.status}</b>
                  <p>{categoryHints[category.categoryId]}</p>
                  <small>{category.summary}</small>
                </article>
              );
            })}
          </div>
        </section>

        <section className="saas-report-section">
          <SectionTitle eyebrow="Детальный разбор" title="Почему эти проблемы мешают заявкам" />
          <div className="saas-report-issues">
            {issues.map((issue, index) => {
              const shots = getIssueShots(issue);
              const activeIndex = activeShots[issue.id] ?? 0;
              const activeShot = shots[activeIndex];

              return (
                <article className={`saas-report-issue is-${getSeverityTone(issue.severity)}`} key={issue.id}>
                  <div className="saas-report-issue__head">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p>{categories.find((category) => category.categoryId === issue.categoryId)?.title || issue.categoryId}</p>
                      <h3>{issue.title}</h3>
                    </div>
                    <b>{getSeverityLabel(issue.severity)}</b>
                  </div>
                  <div className="saas-report-location">
                    <span>Где на странице</span>
                    <strong>{issue.location}</strong>
                  </div>

                  {activeShot ? (
                    <ScreenshotGallery
                      shot={activeShot}
                      shots={shots}
                      activeIndex={activeIndex}
                      onSelect={(nextIndex) => setActiveShots((current) => ({ ...current, [issue.id]: nextIndex }))}
                      onOpen={setLightbox}
                    />
                  ) : (
                    <ScreenshotPlaceholder />
                  )}

                  <div className="saas-report-issue__grid">
                    <InfoCell title="Проблема" text={issue.problem} />
                    <InfoCell title="Почему мешает" text={issue.evidence} />
                    <InfoCell title="Что исправить" text={issue.recommendation} />
                    <InfoCell title="Что изменится" text={issue.expectedResult} />
                    <InfoCell title="Пример формулировки" text={issue.example} wide />
                    <InfoCell title="Сложность" text={`${issue.complexity}/5`} />
                    <InfoCell title="Уверенность проверки" text={`${issue.confidence}%`} />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="saas-report-section">
          <div className="saas-report-final">
            <div>
              <p className="saas-report__eyebrow">Итог отчёта</p>
              <h2>{audit.finalSummary.topPriority}</h2>
              <p>{audit.finalSummary.expectedBusinessEffect}</p>
            </div>
            <div>
              <h3>Ограничения проверки</h3>
              <ul>{audit.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Нужна дополнительная проверка</h3>
              <ul>{audit.humanReviewNeeded.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </section>
      </div>

      {lightbox ? (
        <button className="saas-report-lightbox" type="button" onClick={() => setLightbox(null)} aria-label="Закрыть просмотр скриншота">
          <span aria-hidden="true">×</span>
          <img src={lightbox.url} alt="" />
        </button>
      ) : null}
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="saas-report-section__title">
      <p className="saas-report__eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function ChecklistCard({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <article className={`saas-report-plan-card is-${tone}`}>
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </article>
  );
}

function InfoCell({ title, text, wide }: { title: string; text: string; wide?: boolean }) {
  return (
    <div className={wide ? "is-wide" : undefined}>
      <b>{title}</b>
      <p>{text}</p>
    </div>
  );
}

function ScreenshotThumb({ shot, onOpen }: { shot: ReportShot; onOpen: (shot: ReportShot) => void }) {
  return (
    <button className={`saas-report-shot-thumb is-${shot.variant || "desktop"}`} type="button" onClick={() => onOpen(shot)}>
      <img src={shot.url} alt="" loading="lazy" />
    </button>
  );
}

function ScreenshotGallery({
  shot,
  shots,
  activeIndex,
  onSelect,
  onOpen
}: {
  shot: ReportShot;
  shots: ReportShot[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onOpen: (shot: ReportShot) => void;
}) {
  return (
    <figure className={`saas-report-shot is-${shot.variant || "desktop"}`}>
      <button className="saas-report-shot__frame" type="button" onClick={() => onOpen(shot)} aria-label="Открыть скриншот крупнее">
        <span className="saas-report-shot__chrome" aria-hidden="true"><i /><i /><i /></span>
        <img src={shot.url} alt="" loading="lazy" />
        <span className="saas-report-shot__highlight" aria-hidden="true" />
      </button>
      <figcaption>
        <b>{shot.title}</b>
        <span>{shot.caption}</span>
      </figcaption>
      {shots.length > 1 ? (
        <div className="saas-report-shot__thumbs" aria-label="Миниатюры скриншотов">
          {shots.map((item, index) => (
            <button className={index === activeIndex ? "is-active" : undefined} type="button" key={`${item.url}-${index}`} onClick={() => onSelect(index)}>
              <img src={item.url} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}

function ScreenshotPlaceholder() {
  return (
    <div className="saas-report-shot-placeholder">
      <span aria-hidden="true" />
      <p>Скриншот этой зоны не найден. Ориентируйтесь на указанное место на странице и описание проблемы.</p>
    </div>
  );
}
