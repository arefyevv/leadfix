import { Header } from "@/components/Header";

type SuccessPageProps = {
  searchParams: Promise<{
    lead?: string;
    plan?: string;
    url?: string;
    payment?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const leadId = params.lead || "";
  const plan = params.plan || "Стандарт";
  const url = params.url || "";
  const payment = params.payment || "https://t.me/LeadFixRu";

  return (
    <>
      <Header />
      <main className="success-page screen">
        <section className="success-card">
          <p className="full-audit__eyebrow">Заявка создана</p>
          <h1>Следующий шаг — оплата и запуск аудита</h1>
          <p>
            Заявка сохранена. После оплаты Виктор проверит лендинг и подготовит полный аудит до 24 часов.
          </p>

          <div className="success-meta">
            {leadId && <span>ID: {leadId}</span>}
            {plan && <span>Тариф: {plan}</span>}
            {url && <span>Сайт: {url}</span>}
          </div>

          <div className="success-actions">
            <a className="checkout-submit" href={payment} target="_blank" rel="noreferrer">
              Перейти к оплате
            </a>
            <a className="telegram-button" href="https://t.me/LeadFixRu" target="_blank" rel="noreferrer">
              Написать в Telegram
            </a>
          </div>

          <div className="guarantee-block">
            Если платежная ссылка пока не подключена, напишите в Telegram. Заказ будет обработан вручную.
          </div>
        </section>
      </main>
    </>
  );
}
