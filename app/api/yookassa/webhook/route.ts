import { NextResponse } from "next/server";
import { buildReportUrl, generatePaidAudit } from "@/lib/paidAudit";
import { markReportDeliverySent, wasReportDeliverySent } from "@/lib/reportDelivery";
import { notifyOwnerReportReady, sendReportReadyEmail } from "@/lib/reportEmail";

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

const runningJobs = new Set<string>();

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

  if (runningJobs.has(leadId)) return;
  runningJobs.add(leadId);

  try {
    await generatePaidAudit({ leadId, plan, url });
    const reportUrl = buildReportUrl({ leadId, plan, url });

    if (await wasReportDeliverySent(leadId)) return;

    await Promise.allSettled([
      sendReportReadyEmail({ to: email, plan, reportUrl }),
      notifyOwnerReportReady({ leadId, auditedUrl: url, to: email, plan, reportUrl })
    ]);
    await markReportDeliverySent(leadId);
  } finally {
    runningJobs.delete(leadId);
  }
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
