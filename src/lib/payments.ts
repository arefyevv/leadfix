import { createHash } from "node:crypto";
import type { LeadRecord, PaymentMode } from "@/types/lead";

type CreatePaymentInput = {
  lead: LeadRecord;
  amount: number;
};

type YooKassaPaymentResponse = {
  id?: string;
  status?: string;
  confirmation?: {
    confirmation_url?: string;
  };
};

type YooKassaPaymentStatusResponse = {
  id?: string;
  status?: string;
  metadata?: YooKassaPaymentMetadata;
};

type YooKassaPaymentMetadata = {
  leadId?: string;
  plan?: string;
  paymentMode?: PaymentMode;
  url?: string;
  email?: string;
  telegram?: string;
};

const TEST_PAYMENT_CODE_HASH = "ea1429c3fa97fe4c8110cef2130294ceb77d1f01ec5b550ae9edb6aa2ac00c1c";

function formatAmount(value: number) {
  return value.toFixed(2);
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getBasicAuthHeader(shopId: string, secretKey: string) {
  return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`;
}

export function getYooKassaPaymentMode(orderCode?: string): PaymentMode {
  const normalizedCode = String(orderCode || "").trim().toLocaleLowerCase("ru-RU");
  return normalizedCode && hashValue(normalizedCode) === TEST_PAYMENT_CODE_HASH ? "test" : "live";
}

function getYooKassaCredentials(mode: PaymentMode = "live") {
  const shopId = mode === "test" ? process.env.YOOKASSA_TEST_SHOP_ID?.trim() : process.env.YOOKASSA_SHOP_ID?.trim();
  const secretKey = mode === "test" ? process.env.YOOKASSA_TEST_SECRET_KEY?.trim() : process.env.YOOKASSA_SECRET_KEY?.trim();

  if (!shopId || !secretKey) {
    throw new Error(
      mode === "test"
        ? "YOOKASSA_TEST_SHOP_ID or YOOKASSA_TEST_SECRET_KEY is not configured"
        : "YOOKASSA_SHOP_ID or YOOKASSA_SECRET_KEY is not configured"
    );
  }

  if (!/^\d+$/.test(shopId)) {
    throw new Error(`${mode === "test" ? "YOOKASSA_TEST_SHOP_ID" : "YOOKASSA_SHOP_ID"} must contain only digits`);
  }

  return { shopId, secretKey };
}

function getReturnUrl(lead: LeadRecord) {
  const baseUrl = process.env.YOOKASSA_RETURN_URL || process.env.LEADFIX_PAYMENT_RETURN_URL;

  if (!baseUrl) {
    throw new Error("YOOKASSA_RETURN_URL is not configured");
  }

  const returnUrl = new URL(baseUrl);
  returnUrl.searchParams.set("lead", lead.id);
  returnUrl.searchParams.set("plan", lead.plan);
  returnUrl.searchParams.set("url", lead.url);

  return returnUrl.toString();
}

export async function createYooKassaPayment({ lead, amount }: CreatePaymentInput) {
  const paymentMode = lead.paymentMode || "live";
  const { shopId, secretKey } = getYooKassaCredentials(paymentMode);
  console.info("YooKassa payment request started", {
    leadId: lead.id,
    plan: lead.plan,
    amount: formatAmount(amount),
    paymentMode,
    shopIdLength: shopId.length
  });

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Authorization": getBasicAuthHeader(shopId, secretKey),
      "Content-Type": "application/json",
      "Idempotence-Key": lead.id
    },
    body: JSON.stringify({
      amount: {
        value: formatAmount(amount),
        currency: "RUB"
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: getReturnUrl(lead)
      },
      description: `LeadFix: ${lead.plan}`,
      metadata: {
        leadId: lead.id,
        plan: lead.plan,
        paymentMode,
        url: lead.url,
        email: lead.email,
        telegram: lead.telegram || ""
      }
    })
  });

  const data = (await response.json()) as YooKassaPaymentResponse | { description?: string; error?: string };

  if (!response.ok || !("confirmation" in data) || !data.confirmation?.confirmation_url || !("id" in data) || !data.id) {
    const message = "description" in data ? data.description : "YooKassa payment URL was not returned";
    console.error("YooKassa payment response rejected", {
      status: response.status,
      message
    });
    throw new Error(message || "YooKassa payment URL was not returned");
  }

  console.info("YooKassa payment URL created", {
    leadId: lead.id,
    paymentMode,
    status: response.status
  });

  return {
    confirmationUrl: data.confirmation.confirmation_url,
    paymentId: data.id,
    status: data.status || ""
  };
}

export async function getYooKassaPaymentDetails(paymentId: string, mode: PaymentMode = "live") {
  if (!/^[a-zA-Z0-9_-]+$/.test(paymentId)) {
    throw new Error("Invalid YooKassa payment id");
  }

  const { shopId, secretKey } = getYooKassaCredentials(mode);
  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "Authorization": getBasicAuthHeader(shopId, secretKey),
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  const data = (await response.json()) as YooKassaPaymentStatusResponse | { description?: string; error?: string };

  if (!response.ok || !("status" in data)) {
    const message = "description" in data ? data.description : "YooKassa payment status was not returned";
    throw new Error(message || "YooKassa payment status was not returned");
  }

  return {
    id: "id" in data ? data.id || paymentId : paymentId,
    status: data.status || "",
    metadata: "metadata" in data ? data.metadata || {} : {}
  };
}

export async function getYooKassaPaymentStatus(paymentId: string, mode: PaymentMode = "live") {
  const payment = await getYooKassaPaymentDetails(paymentId, mode);
  return payment.status;
}

export function isYooKassaConfigured(mode: PaymentMode = "live") {
  return mode === "test"
    ? Boolean(process.env.YOOKASSA_TEST_SHOP_ID?.trim() && process.env.YOOKASSA_TEST_SECRET_KEY?.trim())
    : Boolean(process.env.YOOKASSA_SHOP_ID?.trim() && process.env.YOOKASSA_SECRET_KEY?.trim());
}

export function getPlanAmount(price: string) {
  const normalized = price.replace(/\s/g, "").replace(",", ".");
  const match = normalized.match(/\d+(?:\.\d+)?/);

  if (!match) {
    throw new Error("Plan price is not configured");
  }

  return Number(match[0]);
}
