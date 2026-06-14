import { NextResponse } from "next/server";
import { auditPlans } from "@/components/plans";
import { createLead, notifyLead, saveLead } from "@/lib/leads";
import { createYooKassaPayment, getPlanAmount, isYooKassaConfigured } from "@/lib/payments";
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
    const source = String(body.source || "checkout").trim();
    const url = normalizeUrl(String(body.url || "").trim());

    const selectedPlan = auditPlans.find((item) => item.name === plan);

    if (!selectedPlan) {
      return NextResponse.json({ error: "Выберите тариф" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Введите корректный email" }, { status: 400 });
    }

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
    if (isYooKassaConfigured()) {
      try {
        lead.paymentLink = await createYooKassaPayment({
          lead,
          amount: getPlanAmount(selectedPlan.price)
        });
      } catch (paymentError) {
        console.error("YooKassa payment failed, using fallback payment link", {
          leadId: lead.id,
          plan,
          error: paymentError instanceof Error ? paymentError.message : paymentError
        });
      }
    } else {
      console.warn("YooKassa is not configured, using fallback payment link", {
        leadId: lead.id,
        plan
      });
    }

    if (!lead.paymentLink) {
      return NextResponse.json({ error: "Не настроена ссылка на оплату" }, { status: 500 });
    }

    await saveLead(lead);
    await notifyLead(lead).catch((notifyError) => {
      console.error("Lead notification failed", notifyError);
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не удалось создать заявку. Напишите в Telegram: @LeadFixRu" }, { status: 400 });
  }
}
