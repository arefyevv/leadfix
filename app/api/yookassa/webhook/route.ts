import { NextResponse } from "next/server";
import { processPaidAuditAfterPayment } from "@/lib/paidAuditJobs";
import { getYooKassaPaymentDetails } from "@/lib/payments";
import type { PaymentMode } from "@/types/lead";

type YooKassaWebhookBody = {
  event?: string;
  object?: {
    id?: string;
    status?: string;
    metadata?: {
      leadId?: string;
      plan?: string;
      url?: string;
      email?: string;
      paymentMode?: PaymentMode;
      telegram?: string;
    };
  };
};

function normalizePaymentMode(mode?: string): PaymentMode {
  return mode === "test" ? "test" : "live";
}

function getWebhookMetadata(body: YooKassaWebhookBody) {
  const metadata = body.object?.metadata ?? {};
  return {
    paymentId: body.object?.id || "",
    paymentMode: normalizePaymentMode(metadata.paymentMode)
  };
}

async function processPaidAudit(body: YooKassaWebhookBody) {
  const { paymentId, paymentMode } = getWebhookMetadata(body);

  if (!paymentId) {
    throw new Error("YooKassa webhook payment id is missing");
  }

  const payment = await getYooKassaPaymentDetails(paymentId, paymentMode);

  if (payment.status !== "succeeded") {
    throw new Error(`YooKassa payment is not succeeded. paymentId=${paymentId} status=${payment.status || "-"}`);
  }

  if (payment.metadata.paymentMode && payment.metadata.paymentMode !== paymentMode) {
    throw new Error(`YooKassa payment mode mismatch. paymentId=${paymentId}`);
  }

  const leadId = payment.metadata.leadId || "";
  const plan = payment.metadata.plan || "Экспресс";
  const url = payment.metadata.url || "";
  const email = payment.metadata.email || "";

  if (!leadId || !url) {
    throw new Error(`YooKassa webhook metadata is incomplete. paymentId=${paymentId || "-"}`);
  }

  await processPaidAuditAfterPayment({ id: leadId, plan, url, email });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as YooKassaWebhookBody;

    if (body.event !== "payment.succeeded" || body.object?.status !== "succeeded") {
      return NextResponse.json({ ok: true, skipped: true });
    }

    void processPaidAudit(body).catch((error) => {
      console.error("YooKassa paid audit webhook failed", error);
    });

    return NextResponse.json({ ok: true, accepted: true });
  } catch (error) {
    console.error("YooKassa webhook request failed", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
