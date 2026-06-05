import { mkdir, appendFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import type { LeadRecord, LeadRequest } from "@/types/lead";

const LEADS_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(LEADS_DIR, "leads.jsonl");

function createLeadId() {
  return `lf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getPaymentLink() {
  return process.env.LEADFIX_PAYMENT_LINK || "https://t.me/leadfix_support";
}

export function createLead(input: LeadRequest, userAgent?: string): LeadRecord {
  return {
    ...input,
    id: createLeadId(),
    status: "waiting_payment",
    createdAt: new Date().toISOString(),
    paymentLink: getPaymentLink(),
    userAgent
  };
}

export async function saveLead(lead: LeadRecord) {
  try {
    await mkdir(LEADS_DIR, { recursive: true });
    await appendFile(LEADS_FILE, `${JSON.stringify(lead)}\n`, "utf8");
  } catch {
    const fallbackFile = path.join(os.tmpdir(), "leadfix-leads.jsonl");
    await appendFile(fallbackFile, `${JSON.stringify(lead)}\n`, "utf8");
  }
}

export async function notifyLead(lead: LeadRecord) {
  const token = process.env.LEADFIX_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.LEADFIX_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return;
  }

  const message = [
    "Новая заявка LeadFix",
    `ID: ${lead.id}`,
    `Тариф: ${lead.plan}`,
    `URL: ${lead.url}`,
    `Email: ${lead.email}`,
    `Telegram: ${lead.telegram || "-"}`,
    `Источник: ${lead.source || "-"}`,
    `Статус: ${lead.status}`
  ].join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true
    })
  });
}
