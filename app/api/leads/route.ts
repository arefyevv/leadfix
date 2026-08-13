import { NextResponse } from "next/server";
import { auditPlans } from "@/components/plans";
import { createLead, notifyLead, saveLead } from "@/lib/leads";
import { startPaidAuditPaymentWatcher } from "@/lib/paidAuditJobs";
import { createYooKassaPayment, getPlanAmount, getYooKassaPaymentMode, isYooKassaConfigured } from "@/lib/payments";
import type { LeadRequest } from "@/types/lead";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Invalid protocol");
  }

  return url.href;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LeadRequest>;
    const plan = String(body.plan || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const telegram = String(body.telegram || "").trim();
    const orderCode = String(body.orderCode || "").trim();
    const source = String(body.source || "checkout").trim();
    const url = normalizeUrl(String(body.url || "").trim());

    const selectedPlan = auditPlans.find((item) => item.name === plan);

    if (!selectedPlan) {
      return NextResponse.json({ error: "Выберите тариф" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
    }

    const paymentMode = getYooKassaPaymentMode(orderCode);
    const lead = createLead(
      {
        url,
        plan,
        email,
        telegram,
        source
      },
      request.headers.get("user-agent") || undefined
    );
    lead.paymentMode = paymentMode;

    if (isYooKassaConfigured(paymentMode)) {
      try {
        const payment = await createYooKassaPayment({
          lead,
          amount: getPlanAmount(selectedPlan.price)
        });
        lead.paymentLink = payment.confirmationUrl;
        lead.paymentId = payment.paymentId;
      } catch (paymentError) {
        if (paymentMode === "test") {
          return NextResponse.json({ error: "Тестовая YooKassa не создала ссылку на оплату" }, { status: 500 });
        }

        console.error("YooKassa payment failed, using fallback payment link", {
          leadId: lead.id,
          plan,
          paymentMode,
          error: paymentError instanceof Error ? paymentError.message : paymentError
        });
      }
    } else {
      if (paymentMode === "test") {
        return NextResponse.json({ error: "Тестовая YooKassa не настроена" }, { status: 500 });
      }

      console.warn("YooKassa is not configured, using fallback payment link", {
        leadId: lead.id,
        plan,
        paymentMode
      });
    }

    if (!lead.paymentLink) {
      return NextResponse.json({ error: "Не настроена ссылка на оплату" }, { status: 500 });
    }

    await saveLead(lead);
    startPaidAuditPaymentWatcher(lead);
    await notifyLead(lead).catch((notifyError) => {
      console.error("Lead notification failed", notifyError);
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не удалось создать заявку. Напишите в Telegram: @LeadFixRu" }, { status: 400 });
  }
}
