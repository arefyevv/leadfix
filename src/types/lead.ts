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
  source?: string;
};

export type LeadRecord = LeadRequest & {
  id: string;
  status: LeadStatus;
  createdAt: string;
  paymentLink: string;
  paymentId?: string;
  userAgent?: string;
};

export type LeadResponse = {
  lead: LeadRecord;
};

