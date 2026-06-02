"use client";

import type { AuditAnalysis } from "@/types/audit";

type FullReportProps = {
  analysis: AuditAnalysis;
  reportDate: string;
};

type AuditStatus = "Хорошо" | "Требует внимания" | "Слабое место";

type AuditDirection = {
  title: string;
  score: number;
  status: AuditStatus;
  summary: string;
  categories: string[];
  recommendation: string;
};

type DetailedIssue = {
  title: string;
  priority: "Критично" | "Важно";
  category: string;
  problem: string;
  impact: string;
  fix: string;
  example: string;
};

type ScoreRow = {
  category: string;
  score: number;
  status: "Хорошо" | "Нормально" | "Требует внимания" | "Слабое место";
  priority: "Высокий" | "Средний" | "Низкий";
};

const reportScore = 74;

const auditGroups = [
  {
    title: "Оффер и понимание предложения",
    description: "Понимает ли пользователь, что ему предлагают, для кого это решение и какую выгоду он получит.",
    items: ["УТП и главное предложение", "Первый экран", "Оффер", "Целевая аудитория", "Боли и потребности клиента"]
  },
  {
    title: "Доверие и доказательства",
    description: "Достаточно ли у пользователя оснований поверить компании и не откладывать обращение.",
    items: ["Доверие и экспертность", "Отзывы, кейсы и результаты", "Возражения клиентов", "Гарантии и снижение риска", "Ценообразование и тарифы"]
  },
  {
    title: "Конверсионные действия",
    description: "Насколько легко и понятно пользователю совершить целевое действие: нажать кнопку, заполнить форму и оставить заявку.",
    items: ["Призывы к действию", "Формы захвата", "Мотивация к действию", "Конверсионные барьеры"]
  },
  {
    title: "Структура, текст и визуал",
    description: "Насколько страница логично, понятно и убедительно подаёт информацию.",
    items: ["Структура лендинга", "Продающий текст и читаемость", "Визуальное оформление"]
  },
  {
    title: "UX и техническое качество",
    description: "Не мешает ли сайт пользователю технически и интерфейсно: на мобильных устройствах, при загрузке и при взаимодействии с элементами.",
    items: ["Мобильная версия", "Скорость загрузки", "UX и удобство взаимодействия", "Технические ошибки"]
  },
  {
    title: "Реклама и аналитика",
    description: "Насколько лендинг соответствует ожиданиям пользователя после клика по рекламе и можно ли измерять заявки из Яндекс Директа.",
    items: ["Соответствие трафику из Яндекс Директа", "Аналитика и отслеживание конверсий"]
  }
];

const scoreRows: ScoreRow[] = [
  ["УТП и главное предложение", 72, "Требует внимания", "Высокий"],
  ["Первый экран", 68, "Требует внимания", "Высокий"],
  ["Оффер", 70, "Требует внимания", "Высокий"],
  ["Целевая аудитория", 76, "Нормально", "Средний"],
  ["Боли и потребности клиента", 69, "Требует внимания", "Высокий"],
  ["Доверие и экспертность", 70, "Требует внимания", "Высокий"],
  ["Отзывы, кейсы и результаты", 60, "Слабое место", "Высокий"],
  ["Призывы к действию", 76, "Нормально", "Средний"],
  ["Формы захвата", 84, "Хорошо", "Низкий"],
  ["Возражения клиентов", 66, "Требует внимания", "Средний"],
  ["Гарантии и снижение риска", 60, "Слабое место", "Средний"],
  ["Ценообразование и тарифы", 78, "Нормально", "Средний"],
  ["Структура лендинга", 82, "Хорошо", "Низкий"],
  ["Продающий текст и читаемость", 72, "Требует внимания", "Средний"],
  ["Визуальное оформление", 79, "Нормально", "Низкий"],
  ["Мобильная версия", 58, "Слабое место", "Высокий"],
  ["Скорость загрузки", 74, "Нормально", "Средний"],
  ["UX и удобство взаимодействия", 72, "Требует внимания", "Средний"],
  ["Конверсионные барьеры", 65, "Требует внимания", "Высокий"],
  ["Мотивация к действию", 61, "Требует внимания", "Средний"],
  ["Соответствие трафику из Яндекс Директа", 64, "Требует внимания", "Высокий"],
  ["Аналитика и отслеживание конверсий", 55, "Слабое место", "Высокий"],
  ["Технические ошибки", 81, "Хорошо", "Низкий"]
].map(([category, score, status, priority]) => ({ category, score, status, priority })) as ScoreRow[];

const quickImprovements = [
  "Переписать главный заголовок первого экрана.",
  "Уточнить подзаголовок через конкретную выгоду.",
  "Сделать CTA более понятным и прямым.",
  "Добавить пояснение рядом с кнопкой: что произойдёт после клика.",
  "Добавить 2–3 доказательства доверия рядом с формой.",
  "Сократить форму до минимального количества полей.",
  "Проверить мобильный сценарий от первого экрана до заявки.",
  "Настроить цели в Яндекс Метрике на формы, кнопки, телефон и мессенджеры.",
  "Сравнить первый экран с основными объявлениями в Яндекс Директе."
];

const implementationPriorities = [
  {
    title: "Высокий приоритет",
    tone: "high",
    items: ["Усилить УТП и первый экран.", "Согласовать первый экран с рекламными объявлениями.", "Добавить конкретику в оффер.", "Усилить доверие: отзывы, кейсы, данные компании.", "Проверить мобильную версию.", "Настроить цели аналитики.", "Устранить конверсионные барьеры перед формой."]
  },
  {
    title: "Средний приоритет",
    tone: "medium",
    items: ["Переписать блок выгод.", "Добавить FAQ с ответами на возражения.", "Улучшить продающий текст.", "Добавить больше кейсов и результатов.", "Улучшить UX-сценарий страницы.", "Проверить скорость загрузки."]
  },
  {
    title: "Низкий приоритет",
    tone: "low",
    items: ["Доработать визуальные акценты.", "Добавить дополнительные отзывы.", "Расширить блок доверия и экспертности.", "Проверить корректность мотивации к действию.", "Протестировать альтернативные формулировки CTA."]
  }
];

const auditDirections: AuditDirection[] = [
  {
    title: "Оффер и понимание предложения",
    score: 71,
    status: "Требует внимания",
    summary: "Пользователь понимает направление предложения, но ценность и отличие от конкурентов считываются недостаточно быстро.",
    categories: ["УТП и главное предложение", "Первый экран", "Оффер", "Целевая аудитория", "Боли и потребности клиента"],
    recommendation: "Уточнить результат для клиента на первом экране и связать его с конкретной потребностью аудитории."
  },
  {
    title: "Доверие и доказательства",
    score: 67,
    status: "Слабое место",
    summary: "Лендингу не хватает убедительных доказательств, которые снижают сомнение перед обращением.",
    categories: ["Доверие и экспертность", "Отзывы, кейсы и результаты", "Возражения клиентов", "Гарантии и снижение риска", "Ценообразование и тарифы"],
    recommendation: "Добавить реальные кейсы, цифры результата и ответы на возражения рядом с точками принятия решения."
  },
  {
    title: "Конверсионные действия",
    score: 72,
    status: "Требует внимания",
    summary: "Форма работает, но CTA и путь к заявке можно сделать яснее и прямее.",
    categories: ["Призывы к действию", "Формы захвата", "Мотивация к действию", "Конверсионные барьеры"],
    recommendation: "Оставить один основной CTA, пояснить следующий шаг и убрать лишнее трение перед отправкой формы."
  },
  {
    title: "Структура, текст и визуал",
    score: 78,
    status: "Хорошо",
    summary: "Базовая структура страницы собрана корректно, но отдельные аргументы можно подать конкретнее.",
    categories: ["Структура лендинга", "Продающий текст и читаемость", "Визуальное оформление"],
    recommendation: "Сократить общие формулировки, усилить иерархию блоков и сохранить фокус на одном действии."
  },
  {
    title: "UX и техническое качество",
    score: 71,
    status: "Требует внимания",
    summary: "Главный риск находится в мобильном сценарии: его нужно проверить вручную до масштабирования рекламы.",
    categories: ["Мобильная версия", "Скорость загрузки", "UX и удобство взаимодействия", "Технические ошибки"],
    recommendation: "Пройти путь заявки на смартфоне, проверить скорость загрузки и работу интерактивных элементов."
  },
  {
    title: "Реклама и аналитика",
    score: 60,
    status: "Слабое место",
    summary: "Нужно проверить совпадение рекламных обещаний с первым экраном и корректность отслеживания заявок.",
    categories: ["Соответствие трафику из Яндекс Директа", "Аналитика и отслеживание конверсий"],
    recommendation: "Сопоставить объявления с оффером лендинга и настроить цели Метрики на все ключевые действия."
  }
];

function getDetailedIssues(): DetailedIssue[] {
  return [
    {
      title: "Главное предложение требует большей конкретики",
      priority: "Критично",
      category: "УТП и первый экран",
      problem: "Главный заголовок описывает направление, но не показывает конкретный результат для клиента.",
      impact: "Пользователь из рекламы принимает решение за несколько секунд. Если он не понимает выгоду сразу, вероятность ухода со страницы растёт.",
      fix: "Переписать заголовок по формуле: кому + какой результат + за счёт чего.",
      example: "Было: «Работаем каждый день, но его конкуренты уже получают больше заявок». Стало: «Найдём, почему лендинг теряет заявки из Яндекс Директа, и покажем, что исправить в первую очередь»."
    },
    {
      title: "Основной CTA не объясняет следующий шаг",
      priority: "Критично",
      category: "CTA и формы",
      problem: "Кнопка заметна, но формулировка не показывает, что именно получит пользователь после клика.",
      impact: "Неясный следующий шаг увеличивает сомнение перед заявкой и снижает кликабельность основной кнопки.",
      fix: "Сделать CTA прямым и добавить рядом короткое пояснение результата отправки формы.",
      example: "CTA: «Получить разбор лендинга». Пояснение: «Покажем основные точки потери заявок и приоритеты исправлений»."
    },
    {
      title: "Недостаточно доказательств рядом с формой",
      priority: "Важно",
      category: "Доверие",
      problem: "Отзывы, кейсы и цифры результата не поддерживают пользователя в момент принятия решения.",
      impact: "Пользователь не получает подтверждений компетентности компании и откладывает отправку заявки.",
      fix: "Добавить рядом с формой 2–3 коротких доказательства: цифру результата, кейс и отзыв с контекстом.",
      example: "Разместить рядом с формой: «+28% к конверсии после переработки первого экрана» и короткую цитату клиента."
    },
    {
      title: "Мобильный сценарий требует ручной проверки",
      priority: "Важно",
      category: "Мобильная версия",
      problem: "Нужно проверить первый экран, CTA и заполнение формы на ширине 360 пикселей.",
      impact: "Часть рекламного трафика приходит со смартфонов. Лишняя прокрутка или неудобная форма напрямую сокращают количество заявок.",
      fix: "Пройти путь пользователя на телефоне: объявление, первый экран, CTA, форма, подтверждение заявки.",
      example: "Основная кнопка должна быть видна без лишней прокрутки, а форма содержать только обязательные поля."
    }
  ];
}

export function FullReport({ analysis, reportDate }: FullReportProps) {
  const detailedIssues = getDetailedIssues();
  const siteHeading = analysis.h1[0] || "Главный заголовок на странице не найден";

  return (
    <section className="full-report full-audit screen">
      <div className="full-report__inner full-audit__layout">
        <aside className="full-audit-sidebar">
          <section className="full-audit-sidebar__site">
            <div className="full-audit-sidebar__meta">
              <div><span>Дата аудита</span><b>{reportDate}</b></div>
              <div><span>Адрес сайта</span><a href={analysis.url} target="_blank" rel="noreferrer">{analysis.url}</a></div>
              <div><span>H1 сайта</span><b>{siteHeading}</b></div>
            </div>
            <div className="full-audit-sidebar__actions">
              <button className="pdf-button" type="button" onClick={() => window.print()}>Скачать PDF</button>
              <button className="telegram-button" type="button">Отправить в Telegram</button>
            </div>
          </section>
        </aside>

        <main className="full-audit-content">
          <header className="full-audit-content__hero">
            <p className="full-audit__eyebrow">Аудит продающей способности</p>
            <h2>Что мешает сайту приносить больше заявок</h2>
            <p>Разбор ключевых точек потери конверсии и последовательный план исправлений.</p>
            <div className="full-audit-content__hero-metrics">
              <div><span>Первый приоритет</span><b>Оффер и CTA</b></div>
              <div><span>Потенциал роста</span><b>+15–35%</b></div>
            </div>
          </header>

          <section className="full-audit-content__score">
            <div>
              <p className="full-audit__eyebrow">Общая оценка</p>
              <strong>{reportScore}<small>/100</small></strong>
            </div>
            <div>
              <h2>Средний уровень</h2>
              <p>Лендинг уже может получать заявки, но есть заметные точки потери конверсии: оффер, CTA, доверие и мобильный сценарий требуют доработки.</p>
            </div>
            <dl>
              <div><dt>Критично</dt><dd>2</dd></div>
              <div><dt>Важно</dt><dd>5</dd></div>
              <div><dt>Точки роста</dt><dd>8</dd></div>
            </dl>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Объём проверки" title="Что проверял аудит" />
            <p className="full-audit__lead">Аудит оценивает не сайт «вообще», а способность лендинга превращать платный трафик из Яндекс Директа в заявки.</p>
            <p className="full-audit__lead full-audit__lead--secondary">Проверки сгруппированы по этапам принятия решения: от первого понимания предложения до заявки и измерения результата.</p>
            <div className="full-audit__methodology">
              {auditGroups.map((group, index) => (
                <article key={group.title}>
                  <span className="full-audit__methodology-index">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <div>
                    {group.items.map((item) => <span className="full-audit__methodology-chip" key={item}><i />{item}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Разбор лендинга" title="Итоги по направлениям аудита" />
            <p className="full-audit__lead">Сначала — краткая картина по шести направлениям. Ниже можно посмотреть оценки всех проверенных категорий и подробные замечания.</p>
            <div className="full-audit__categories">
              {auditDirections.map((direction, index) => (
                <article className="full-audit-category" key={direction.title}>
                  <div className="full-audit-category__top">
                    <div>
                      <span className="full-audit-category__index">{String(index + 1).padStart(2, "0")}</span>
                      <h3>{direction.title}</h3>
                    </div>
                    <strong>{direction.score}<small>/100</small></strong>
                  </div>
                  <span className={`full-audit__status status-${direction.status === "Хорошо" ? "good" : direction.status === "Слабое место" ? "critical" : "attention"}`}>{direction.status}</span>
                  <p>{direction.summary}</p>
                  <div className="full-audit-category__scores">
                    {direction.categories.map((category) => {
                      const score = scoreRows.find((row) => row.category === category);
                      return <div key={category}><span>{category}</span><b>{score?.score ?? "—"}<small>/100</small></b></div>;
                    })}
                  </div>
                  <div className="full-audit-category__recommendation"><b>Что исправить</b><span>{direction.recommendation}</span></div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Все категории" title="Полная таблица оценок" />
            <div className="full-audit__score-table">
              <div className="full-audit__score-table-head">
                <span>Категория</span><span>Оценка</span><span>Статус</span><span>Приоритет</span>
              </div>
              {scoreRows.map((row) => (
                <article className="full-audit__score-row" key={row.category}>
                  <b>{row.category}</b>
                  <strong>{row.score}<small>/100</small></strong>
                  <span className={`score-status is-${getScoreTone(row.status)}`}>{row.status}</span>
                  <span className={`score-priority is-${getPriorityTone(row.priority)}`}>{row.priority}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Подробные замечания" title="Ключевые проблемы" />
            <div className="full-audit__issues">
              {detailedIssues.map((issue, index) => (
                <article className={issue.priority === "Критично" ? "full-audit-issue is-critical" : "full-audit-issue"} key={`${issue.title}-${index}`}>
                  <div className="full-audit-issue__index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="full-audit-issue__body">
                    <div className="full-audit-issue__head">
                      <div>
                        <span>{issue.category}</span>
                        <h3>{issue.title}</h3>
                      </div>
                      <b>{issue.priority}</b>
                    </div>
                    <div className="full-audit-issue__grid">
                      <div><b>Что не так</b><p>{issue.problem}</p></div>
                      <div><b>Почему влияет на заявки</b><p>{issue.impact}</p></div>
                      <div><b>Что исправить</b><p>{issue.fix}</p></div>
                      <div><b>Пример улучшения</b><p>{issue.example}</p></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section full-audit__direct">
            <div className="full-audit__direct-head">
              <div>
                <p className="full-audit__eyebrow">Рекламный трафик</p>
                <h2>Соответствие трафику из Яндекс Директа</h2>
              </div>
              <strong>64<small>/100</small></strong>
            </div>
            <span className="full-audit__status status-attention">Требует внимания</span>
            <p className="full-audit__lead">Лендинг должен подтверждать ожидание пользователя сразу после клика по рекламному объявлению. Если запрос, объявление, первый экран и CTA не совпадают по смыслу, рекламный трафик может теряться даже при нормальной настройке кампании.</p>
            <h3>Что проверяется</h3>
            <ul>
              <li>Совпадает ли первый экран с рекламным объявлением.</li>
              <li>Совпадает ли оффер на сайте с обещанием в рекламе.</li>
              <li>Понятно ли пользователю, что он попал на нужную страницу.</li>
              <li>Есть ли связка: запрос → объявление → первый экран → CTA → заявка.</li>
              <li>Подходит ли CTA под температуру трафика.</li>
              <li>Не ведётся ли разный трафик на один слишком общий лендинг.</li>
            </ul>
            <div className="full-audit__recommendation"><b>Рекомендация</b><p>Сравнить основные рекламные объявления с первым экраном лендинга. Если в объявлении обещается конкретный результат, этот же результат должен быть виден в заголовке, подзаголовке или рядом с CTA.</p></div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="1–2 дня" title="Быстрые улучшения" />
            <div className="full-audit__improvements">
              {quickImprovements.map((item, index) => <div key={item}><strong>{String(index + 1).padStart(2, "0")}</strong><span>{item}</span></div>)}
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Мобильная версия" title="Проверка мобильного сценария" />
            <div className="full-audit__mobile">
              <div className="phone-preview" aria-label="Схема мобильной версии">
                <div className="phone-screen">
                  <div className="phone-line" />
                  <div className="phone-line phone-line--short" />
                  <div className="phone-line" />
                  <div className="phone-cta" />
                  <div className="phone-line" />
                  <div className="phone-line phone-line--short" />
                </div>
              </div>
              <div>
                <p>Автоматическая проверка кода страницы не заменяет визуальную проверку адаптива. Перед запуском рекламы вручную пройдите путь заявки на телефоне.</p>
                <ul>
                  <li>Проверьте первый экран на ширине 360 пикселей.</li>
                  <li>Убедитесь, что основная кнопка видна без лишней прокрутки.</li>
                  <li>Проверьте размеры кнопок и удобство полей формы.</li>
                  <li>Убедитесь, что контакты доступны в один клик.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="full-audit__section">
            <SectionHeading eyebrow="Порядок работ" title="Приоритетный план внедрения" />
            <div className="full-audit__implementation">
              {implementationPriorities.map((group) => (
                <article className={`is-${group.tone}`} key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className="full-audit__section full-audit__potential">
            <p className="full-audit__eyebrow">Ориентир после исправлений</p>
            <h2>Потенциал роста конверсии</h2>
            <p>После исправления критичных проблем потенциальный рост конверсии может составить:</p>
            <strong>+15–35%</strong>
            <small>Это не гарантия результата, а ориентировочная оценка на основе найденных барьеров. Фактический результат зависит от качества трафика, ниши, цены, продукта, конкурентной среды, обработки заявок и корректности внедрения рекомендаций.</small>
          </section>

          <footer className="full-audit__disclaimer">
            Отчёт является аналитической рекомендацией и показывает возможные точки потери заявок на лендинге. Он не является гарантией роста продаж или финансового результата. Итоговая эффективность зависит от рекламного трафика, ниши, продукта, цены, отдела продаж и качества внедрения рекомендаций.
          </footer>
        </main>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="full-audit__section-heading"><p className="full-audit__eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

function getScoreTone(status: ScoreRow["status"]) {
  if (status === "Хорошо") return "good";
  if (status === "Слабое место") return "weak";
  if (status === "Нормально") return "normal";
  return "attention";
}

function getPriorityTone(priority: ScoreRow["priority"]) {
  if (priority === "Высокий") return "high";
  if (priority === "Средний") return "medium";
  return "low";
}
