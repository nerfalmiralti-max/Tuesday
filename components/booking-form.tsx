"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Info, MessageCircle } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Reveal } from "@/components/motion-reveal";
import { useLanguage } from "@/components/language-provider";
import { business } from "@/lib/business";
import type { Language } from "@/lib/i18n";

type FormState = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  comment: string;
};

type ErrorState = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  comment: "",
};

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function timeOptions() {
  const slots: string[] = [];
  for (let minutes = 12 * 60; minutes <= 23 * 60 + 30; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }
  for (let minutes = 0; minutes <= 2 * 60; minutes += 30) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    slots.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }
  return slots;
}

const availableTimes = timeOptions();

export function BookingPageClient() {
  const { language, setLanguage, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);
  const today = useMemo(() => localDateString(), []);

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsPrepared(false);
  };

  const validate = () => {
    const nextErrors: ErrorState = {};
    if (form.name.trim().length < 2) nextErrors.name = d.booking.errors.name;
    if (form.phone.replace(/\D/g, "").length < 10) {
      nextErrors.phone = d.booking.errors.phone;
    }
    if (!form.date || form.date < today) nextErrors.date = d.booking.errors.date;
    if (!availableTimes.includes(form.time)) nextErrors.time = d.booking.errors.time;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const messageDictionary = d.booking.message;
    const lines = [
      messageDictionary.title,
      "",
      `${messageDictionary.name}: ${form.name.trim()}`,
      `${messageDictionary.phone}: ${form.phone.trim()}`,
      `${messageDictionary.date}: ${form.date}`,
      `${messageDictionary.time}: ${form.time}`,
      `${messageDictionary.guests}: ${form.guests}`,
      form.comment.trim()
        ? `${messageDictionary.comment}: ${form.comment.trim()}`
        : null,
      `${messageDictionary.language}: ${language === "ru" ? "Русский" : "Қазақша"}`,
      "",
      messageDictionary.footer,
    ].filter(Boolean);
    const whatsappUrl = `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(lines.join("\n"))}`;

    window.setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setIsLoading(false);
      setIsPrepared(true);
    }, reduceMotion ? 0 : 350);
  };

  return (
    <div className="inner-page booking-page">
      <section className="booking-hero" aria-labelledby="booking-title">
        <div className="booking-hero-copy">
          <motion.p
            className="eyebrow"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {d.booking.eyebrow}
          </motion.p>
          <h1 id="booking-title" className="page-title">
            <span className="title-mask">
              <motion.span
                initial={reduceMotion ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {d.booking.title}
              </motion.span>
            </span>
          </h1>
          <motion.p
            className="page-intro"
            initial={reduceMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {d.booking.intro}
          </motion.p>
        </div>
        <div className="booking-hero-mark" aria-hidden="true">B</div>
        <div className="booking-meta">
          <div>
            <span>{d.common.hours}</span>
            <strong>{business.hours}</strong>
          </div>
          <div>
            <span>{d.common.phone}</span>
            <a href={business.phone.tel}>{business.phone.display}</a>
          </div>
        </div>
      </section>

      <section className="booking-form-section" aria-label={d.booking.eyebrow}>
        <Reveal className="booking-form-wrap">
          <div className="booking-form-aside">
            <p>01 — FORM</p>
            <div className="booking-note">
              <Info size={18} aria-hidden="true" />
              <p>{d.booking.note}</p>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit} noValidate>
            <div className="field field--wide">
              <label htmlFor="guest-name">{d.booking.name}</label>
              <input
                id="guest-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={d.booking.namePlaceholder}
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name ? <p className="field-error" id="name-error">{errors.name}</p> : null}
            </div>

            <div className="field field--wide">
              <label htmlFor="guest-phone">{d.booking.phone}</label>
              <input
                id="guest-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={d.booking.phonePlaceholder}
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone ? <p className="field-error" id="phone-error">{errors.phone}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="booking-date">{d.booking.date}</label>
              <input
                id="booking-date"
                name="date"
                type="date"
                min={today}
                value={form.date}
                onChange={(event) => update("date", event.target.value)}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "date-error" : undefined}
              />
              {errors.date ? <p className="field-error" id="date-error">{errors.date}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="booking-time">{d.booking.time}</label>
              <select
                id="booking-time"
                name="time"
                value={form.time}
                onChange={(event) => update("time", event.target.value)}
                aria-invalid={Boolean(errors.time)}
                aria-describedby={errors.time ? "time-error" : undefined}
              >
                <option value="">—:—</option>
                {availableTimes.map((time) => (
                  <option value={time} key={time}>{time}</option>
                ))}
              </select>
              {errors.time ? <p className="field-error" id="time-error">{errors.time}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="booking-guests">{d.booking.guests}</label>
              <select
                id="booking-guests"
                name="guests"
                value={form.guests}
                onChange={(event) => update("guests", event.target.value)}
              >
                {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((count) => (
                  <option value={count} key={count}>
                    {d.booking.guestOption.replace("{count}", count)}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="booking-language">{d.booking.language}</label>
              <select
                id="booking-language"
                name="language"
                value={language}
                onChange={(event) => {
                  const nextLanguage = event.target.value as Language;
                  setLanguage(nextLanguage);
                }}
              >
                <option value="ru">Русский</option>
                <option value="kk">Қазақша</option>
              </select>
            </div>

            <div className="field field--wide">
              <label htmlFor="booking-comment">{d.booking.comment}</label>
              <textarea
                id="booking-comment"
                name="comment"
                rows={4}
                placeholder={d.booking.commentPlaceholder}
                value={form.comment}
                onChange={(event) => update("comment", event.target.value)}
              />
            </div>

            <div className="form-submit field--wide">
              <button type="submit" disabled={isLoading}>
                <MessageCircle size={19} aria-hidden="true" />
                <span>{isLoading ? d.booking.loading : d.booking.submit}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
              <p>{d.booking.note}</p>
            </div>

            <AnimatePresence>
              {isPrepared ? (
                <motion.div
                  className="booking-success field--wide"
                  role="status"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Check size={19} aria-hidden="true" />
                  <div>
                    <strong>{d.booking.successTitle}</strong>
                    <p>{d.booking.successBody}</p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
