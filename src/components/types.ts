export type Screen = "hero" | "loading" | "preview" | "checkout" | "fullReport";

export type MockAnalysis = {
  url: string;
  title: string;
  description: string;
  h1: string;
  heroText: string;
  buttons: string[];
  hasForm: boolean;
  desktopScreenshot: string;
  mobileScreenshot: string;
};

export type Plan = {
  name: string;
  price: string;
  description: string;
  features?: string[];
  format?: string[];
  audience?: string;
  recommended?: boolean;
};
