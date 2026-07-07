import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DELIVERY_DIR = path.join(process.cwd(), "data", "report-delivery");

function normalizeLeadId(leadId: string) {
  return /^[a-zA-Z0-9_-]+$/.test(leadId) ? leadId : "";
}

function getDeliveryPath(leadId: string) {
  return path.join(DELIVERY_DIR, `${leadId}.json`);
}

export async function wasReportDeliverySent(leadId: string) {
  const normalizedLeadId = normalizeLeadId(leadId);
  if (!normalizedLeadId) return false;

  try {
    const value = JSON.parse(await readFile(getDeliveryPath(normalizedLeadId), "utf8")) as { sentAt?: string };
    return Boolean(value.sentAt);
  } catch {
    return false;
  }
}

export async function markReportDeliverySent(leadId: string) {
  const normalizedLeadId = normalizeLeadId(leadId);
  if (!normalizedLeadId) return;

  await mkdir(DELIVERY_DIR, { recursive: true });
  await writeFile(
    getDeliveryPath(normalizedLeadId),
    JSON.stringify({ sentAt: new Date().toISOString() }),
    "utf8"
  );
}
