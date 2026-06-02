import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <div className="legal-shell">
      <Header />
      <main className="legal-page">
        <article className="legal-page__card">
          <p className="legal-page__eyebrow">Документы LeadFix</p>
          <h1>Политика конфиденциальности</h1>
          <p>Правила обработки данных пользователей сервиса LeadFix.</p>

          <section>
            <h2>Оператор</h2>
            <p>НПД Арефьев В.О.</p>
            <p>ИНН 910907646492</p>
          </section>

          <section>
            <h2>Какие данные обрабатываются</h2>
            <p>Адрес проверяемого сайта, email, Telegram при его указании, выбранный тариф и технические данные, необходимые для работы сервиса.</p>
          </section>

          <section>
            <h2>Цель обработки</h2>
            <p>Формирование заказа, оказание услуги, отправка отчёта и связь с пользователем по вопросам заказа.</p>
          </section>

          <section>
            <h2>Передача данных</h2>
            <p>Данные могут передаваться платёжному сервису и техническим подрядчикам только в объёме, необходимом для оказания услуги.</p>
          </section>
        </article>
      </main>
    </div>
  );
}
