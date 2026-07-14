import { buildReportUrl } from "@/lib/paidAudit";
import { markReportDeliverySent, wasReportDeliverySent } from "@/lib/reportDelivery";
import { notifyOwnerReportReady, sendReportReadyEmail } from "@/lib/reportEmail";

type DeliverReportNotificationInput = {
  leadId: string;
  plan: string;
  url: string;
  email?: string;
};

export async function deliverReportNotification({ leadId, plan, url, email = "" }: DeliverReportNotificationInput) {
  if (!leadId || !url) return;
  if (await wasReportDeliverySent(leadId)) return;

  const reportUrl = buildReportUrl({ leadId, plan, url });
  const deliveryTasks = [
    notifyOwnerReportReady({ leadId, auditedUrl: url, to: email, plan, reportUrl })
  ];

  if (email) {
    deliveryTasks.push(sendReportReadyEmail({ to: email, plan, reportUrl, auditedUrl: url }));
  }

  const results = await Promise.allSettled(deliveryTasks);

  const delivered = results.every((result) => result.status === "fulfilled");
  if (delivered) {
    await markReportDeliverySent(leadId);
    return;
  }

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Report delivery failed", result.reason);
    }
  });
}
