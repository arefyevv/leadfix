"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "leadfix-cookie-notice-accepted";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(STORAGE_KEY) !== "true");
  }, []);

  function acceptCookies() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-notice" aria-label="Уведомление об использовании cookies">
      <p>
        LeadFix использует cookies для работы сайта. Без них никак.
        Подробнее - в <a href="/cookies">Политике cookies</a>.
      </p>
      <button type="button" onClick={acceptCookies}>
        Хорошо
      </button>
    </aside>
  );
}
