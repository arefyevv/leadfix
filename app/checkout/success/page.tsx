import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { PaymentProcessingScreen } from "@/components/PaymentProcessingScreen";

export const metadata: Metadata = {
  title: "Формируем аудит",
  robots: {
    index: false,
    follow: false
  }
};

type SuccessPageProps = {
  searchParams: Promise<{
    lead?: string;
    plan?: string;
    url?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const leadId = params.lead || "";
  const plan = params.plan || "Экспресс";
  const url = params.url || "";

  return (
    <>
      <Header />
      <PaymentProcessingScreen leadId={leadId} plan={plan} url={url} />
    </>
  );
}
