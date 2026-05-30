"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/HeroSection";
import { LandingSections } from "@/components/LandingSections";
import { normalizeClientUrl } from "@/lib/clientAudit";

export default function LeadFixPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");

  function handleHeroSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const normalizedUrl = normalizeClientUrl(urlInput);
      router.push(`/report?url=${encodeURIComponent(normalizedUrl)}`);
    } catch {
      setError("Введите корректный адрес сайта");
    }
  }

  return (
    <main>
      <HeroSection url={urlInput} error={error} onUrlChange={setUrlInput} onSubmit={handleHeroSubmit} />
      <LandingSections />
    </main>
  );
}
