export type LeadStatus =
  | "new"
  | "waiting_payment"
  | "paid"
  | "in_progress"
  | "report_sent"
  | "follow_up_sent"
  | "closed";

export type LeadRequest = {
  url: string;
  plan: string;
  email: string;
  telegram?: string;
  orderCode?: string;
  source?: string;
};

export type PaymentMode = "live" | "test";

export type LeadRecord = LeadRequest & {
  id: string;
  status: LeadStatus;
  createdAt: string;
  paymentLink: string;
  paymentId?: string;
  paymentMode?: PaymentMode;
  userAgent?: string;
};

export type LeadResponse = {
  lead: LeadRecord;
};

