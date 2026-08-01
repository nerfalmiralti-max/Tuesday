"use client";

import { CtaLink } from "@/components/site-shell";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { language } = useLanguage();
  const copy = language === "ru"
    ? {
        eyebrow: "Ошибка 404",
        title: "Эта встреча не назначена.",
        body: "Страница не найдена. Вернитесь на главную или выберите стол для следующего вечера.",
        home: "На главную",
        booking: "Забронировать стол",
      }
    : {
        eyebrow: "404 қатесі",
        title: "Бұл кездесу жоспарланбаған.",
        body: "Бет табылмады. Басты бетке оралыңыз немесе келесі кешке үстел таңдаңыз.",
        home: "Басты бетке",
        booking: "Үстел броньдау",
      };

  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <div className="not-found-mark" aria-hidden="true">404</div>
      <div className="not-found-copy">
        <p className="eyebrow type-label">{copy.eyebrow}</p>
        <h1 id="not-found-title" className="type-page-title">{copy.title}</h1>
        <p className="type-body-large">{copy.body}</p>
        <div className="not-found-actions">
          <CtaLink href="/">{copy.home}</CtaLink>
          <CtaLink href="/booking" variant="secondary">{copy.booking}</CtaLink>
        </div>
      </div>
    </section>
  );
}
