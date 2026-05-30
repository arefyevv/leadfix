export type Plan = {
  name: string;
  price: string;
  description: string;
  features?: string[];
  format?: string[];
  audience?: string;
  recommended?: boolean;
};
