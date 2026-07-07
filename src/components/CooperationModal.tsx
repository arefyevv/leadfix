"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

export function CooperationModal() {
  const [open, setOpen] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const trigger = (event.target as HTMLElement | null)?.closest("[data-cooperation-trigger]");
      if (!trigger) return;

      event.preventDefault();
      setOpen(true);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => firstFieldRef.current?.focus(), 0);

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const company = String(formData.get("company") || "").trim();
    const representative = String(formData.get("representative") || "").trim();
    const site = String(formData.get("site") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const body = [
      `Компания: ${company}`,
      `Представитель: ${representative}`,
      `Сайт: ${site || "не указан"}`,
      "",
      message
    ].join("\n");

    window.location.href = `mailto:info@leadfix.ru?subject=${encodeURIComponent("Сотрудничество LeadFix")}&body=${encodeURIComponent(body)}`;
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="cooperation-modal" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setOpen(false);
    }}>
      <section className="cooperation-modal__card" role="dialog" aria-modal="true" aria-labelledby="cooperation-title">
        <button className="cooperation-modal__close" type="button" aria-label="Закрыть форму" onClick={() => setOpen(false)}>
          ×
        </button>

        <p className="cooperation-modal__eyebrow">Сотрудничество</p>
        <h2 id="cooperation-title">Обсудим партнёрство</h2>
        <p className="cooperation-modal__intro">
          Оставьте короткое описание: кто вы, какой сайт или проект хотите обсудить и что важно на старте.
        </p>

        <form className="cooperation-form" onSubmit={handleSubmit}>
          <label>
            <span>Компания</span>
            <input ref={firstFieldRef} name="company" type="text" autoComplete="organization" required />
          </label>

          <label>
            <span>Представитель</span>
            <input name="representative" type="text" autoComplete="name" required />
          </label>

          <label>
            <span>Сайт <em>при наличии</em></span>
            <input name="site" type="url" inputMode="url" placeholder="https://site.ru" />
          </label>

          <label className="cooperation-form__message">
            <span>Текст</span>
            <textarea name="message" rows={5} required />
          </label>

          <button type="submit">Отправить</button>
        </form>
      </section>
    </div>
  );
}
