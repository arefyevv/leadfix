import { NextResponse } from "next/server";
import { auditPlans } from "@/components/plans";
import { createLead, notifyLead, saveLead } from "@/lib/leads";
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

    if (!auditPlans.some((item) => item.name === plan)) {
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

    await saveLead(lead);
    await notifyLead(lead).catch((notifyError) => {
      console.error("Lead notification failed", notifyError);
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не удалось создать заявку. Напишите в Telegram: @delegin" }, { status: 400 });
  }
}
