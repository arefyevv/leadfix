import { NextResponse } from "next/server";
import { processPaidAuditAfterPayment } from "@/lib/paidAuditJobs";

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
      telegram?: string;
    };
  };
};

function getMetadata(body: YooKassaWebhookBody) {
  const metadata = body.object?.metadata ?? {};
  return {
    paymentId: body.object?.id || "",
    leadId: metadata.leadId || "",
    plan: metadata.plan || "Экспресс",
    url: metadata.url || "",
    email: metadata.email || ""
  };
}

async function processPaidAudit(body: YooKassaWebhookBody) {
  const { paymentId, leadId, plan, url, email } = getMetadata(body);
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
