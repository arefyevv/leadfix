import type { LeadRecord } from "@/types/lead";

type CreatePaymentInput = {
  lead: LeadRecord;
  amount: number;
};

type YooKassaPaymentResponse = {
  confirmation?: {
    confirmation_url?: string;
  };
};

function formatAmount(value: number) {
  return value.toFixed(2);
}

function getBasicAuthHeader(shopId: string, secretKey: string) {
  return `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`;
}

function getYooKassaCredentials() {
  const shopId = process.env.YOOKASSA_SHOP_ID?.trim();
  const secretKey = process.env.YOOKASSA_SECRET_KEY?.trim();

  if (!shopId || !secretKey) {
    throw new Error("YOOKASSA_SHOP_ID or YOOKASSA_SECRET_KEY is not configured");
  }

  if (!/^\d+$/.test(shopId)) {
    throw new Error("YOOKASSA_SHOP_ID must contain only digits");
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
  const { shopId, secretKey } = getYooKassaCredentials();
  console.info("YooKassa payment request started", {
    leadId: lead.id,
    plan: lead.plan,
    amount: formatAmount(amount),
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
        url: lead.url,
        email: lead.email,
        telegram: lead.telegram || ""
      }
    })
  });

  const data = (await response.json()) as YooKassaPaymentResponse | { description?: string; error?: string };

  if (!response.ok || !("confirmation" in data) || !data.confirmation?.confirmation_url) {
    const message = "description" in data ? data.description : "YooKassa payment URL was not returned";
    console.error("YooKassa payment response rejected", {
      status: response.status,
      message
    });
    throw new Error(message || "YooKassa payment URL was not returned");
  }

  console.info("YooKassa payment URL created", {
    leadId: lead.id,
    status: response.status
  });

  return data.confirmation.confirmation_url;
}

export function isYooKassaConfigured() {
  return Boolean(process.env.YOOKASSA_SHOP_ID?.trim() && process.env.YOOKASSA_SECRET_KEY?.trim());
}

export function getPlanAmount(price: string) {
  const normalized = price.replace(/\s/g, "").replace(",", ".");
  const match = normalized.match(/\d+(?:\.\d+)?/);

  if (!match) {
    throw new Error("Plan price is not configured");
  }

  return Number(match[0]);
}
