import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutRoute } from "@/components/CheckoutRoute";

export const metadata: Metadata = {
  title: "Оформление аудита",
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutPage() {
  return <Suspense><CheckoutRoute /></Suspense>;
}
