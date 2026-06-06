import { Header } from "@/components/Header";

export default function RequisitesPage() {
  return (
    <div className="legal-shell">
      <Header />
      <main className="legal-page">
        <article className="legal-page__card">
          <p className="legal-page__eyebrow">Документы LeadFix</p>
          <h1>Реквизиты</h1>
          <p>Информация об исполнителе услуг сервиса LeadFix.</p>

          <section>
            <h2>Исполнитель</h2>
            <p>НПД Арефьев В.О.</p>
            <p>ИНН: 910907646492</p>
            <p>Email: viktor-82rus@ya.ru</p>
            <p>Telegram: @LeadFixRu</p>
          </section>

          <section>
            <h2>Формат работы</h2>
            <p>
              Исполнитель оказывает информационно-аналитические услуги по аудиту сайтов и лендингов,
              подготовке отчетов и рекомендаций по повышению продающей способности посадочных страниц.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
