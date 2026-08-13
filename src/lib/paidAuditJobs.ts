import type { LeadRecord, PaymentMode } from "@/types/lead";
import { generatePaidAudit } from "@/lib/paidAudit";
import { getYooKassaPaymentStatus } from "@/lib/payments";
import { deliverReportNotification } from "@/lib/reportNotifications";

const PAYMENT_POLL_INTERVAL_MS = 10_000;
const PAYMENT_POLL_TIMEOUT_MS = 45 * 60_000;

type ActiveWatcherMap = Map<string, NodeJS.Timeout>;

const globalState = globalThis as typeof globalThis & {
  leadfixPaymentWatchers?: ActiveWatcherMap;
  leadfixPaidAuditJobs?: Set<string>;
};

const activeWatchers = globalState.leadfixPaymentWatchers ?? new Map<string, NodeJS.Timeout>();
const activeJobs = globalState.leadfixPaidAuditJobs ?? new Set<string>();
globalState.leadfixPaymentWatchers = activeWatchers;
globalState.leadfixPaidAuditJobs = activeJobs;

export async function processPaidAuditAfterPayment(lead: Pick<LeadRecord, "id" | "url" | "plan" | "email">) {
  if (!lead.id || !lead.url) return;
  if (activeJobs.has(lead.id)) return;

  activeJobs.add(lead.id);

  try {
    await generatePaidAudit({
      leadId: lead.id,
      plan: lead.plan,
      url: lead.url
    });

    await deliverReportNotification({
      leadId: lead.id,
      plan: lead.plan,
      url: lead.url,
      email: lead.email || ""
    });
  } finally {
    activeJobs.delete(lead.id);
  }
}

function normalizePaymentMode(mode?: PaymentMode) {
  return mode || "live";
}

export function startPaidAuditPaymentWatcher(lead: LeadRecord) {
  if (!lead.paymentId || activeWatchers.has(lead.id)) return;

  const startedAt = Date.now();

  const stop = () => {
    const timer = activeWatchers.get(lead.id);
    if (timer) {
      clearTimeout(timer);
      activeWatchers.delete(lead.id);
    }
  };

  const tick = async () => {
    try {
      const status = await getYooKassaPaymentStatus(lead.paymentId || "", normalizePaymentMode(lead.paymentMode));

      if (status === "succeeded") {
        stop();
        await processPaidAuditAfterPayment(lead);
        return;
      }

      if (status === "canceled") {
        stop();
        return;
      }
    } catch (error) {
      console.error("YooKassa payment watcher failed", {
        leadId: lead.id,
        paymentId: lead.paymentId,
        error: error instanceof Error ? error.message : error
      });
    }

    if (Date.now() - startedAt >= PAYMENT_POLL_TIMEOUT_MS) {
      stop();
      return;
    }

    activeWatchers.set(lead.id, setTimeout(tick, PAYMENT_POLL_INTERVAL_MS));
  };

  activeWatchers.set(lead.id, setTimeout(tick, PAYMENT_POLL_INTERVAL_MS));
}
