export type Plan = {
  name: string;
  price: string;
  description: string;
  features?: string[];
  featureDetails?: Record<string, string>;
  format?: string[];
  audience?: string;
  recommended?: boolean;
};
