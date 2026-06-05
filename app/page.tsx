"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { LandingSections } from "@/components/LandingSections";
import { LoadingScreen } from "@/components/LoadingScreen";
import { normalizeClientUrl } from "@/lib/clientAudit";

const loadingSteps = [
  "Открываем сайт",
  "Смотрим первый экран",
  "Проверяем оффер",
  "Ищем CTA и формы",
  "Оцениваем доверие",
  "Собираем предварительный отчёт"
];

export default function LeadFixPage() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const [pendingUrl, setPendingUrl] = useState("");

  function handleHeroSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const normalizedUrl = normalizeClientUrl(urlInput);
      setPendingUrl(normalizedUrl);
      router.push(`/report?url=${encodeURIComponent(normalizedUrl)}`);
    } catch {
      setPendingUrl("");
      setError("Введите корректный адрес сайта");
    }
  }

  if (pendingUrl) {
    return (
      <>
        <Header />
        <main>
          <LoadingScreen url={pendingUrl} steps={loadingSteps} stepIndex={0} />
        </main>
      </>
    );
  }

  return (
    <main>
      <HeroSection url={urlInput} error={error} onUrlChange={setUrlInput} onSubmit={handleHeroSubmit} />
      <LandingSections />
    </main>
  );
}
