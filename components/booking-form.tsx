"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Info, MessageCircle } from "lucide-react";
import { FormEvent, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/motion-reveal";
import { useLanguage } from "@/components/language-provider";
import {
  buildWhatsAppUrl,
  localDateString,
  validateBooking,
  type BookingFormValues,
  type BookingValidationError,
} from "@/lib/booking";
import { business } from "@/lib/business";
import type { Language } from "@/lib/i18n";

type ErrorState = Partial<
  Record<keyof BookingFormValues, BookingValidationError>
>;

const initialForm: BookingFormValues = {
  name: "",
  phone: "",
  date: "",
  time: "",
  guests: "2",
  comment: "",
};

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
  const formRef = useRef<HTMLFormElement>(null);
  const submissionLock = useRef(false);
  const [form, setForm] = useState<BookingFormValues>(initialForm);
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);
  const today = useMemo(() => localDateString(), []);

  const update = (field: keyof BookingFormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const result = validateBooking(form, today);
    setErrors(result.errors);
    if (result.firstInvalidField) {
      const firstInvalidField = result.firstInvalidField;
      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
          ?.focus();
      });
    }

    return result.firstInvalidField === null;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionLock.current || !validate()) return;

    submissionLock.current = true;
    setIsLoading(true);
    const whatsappUrl = buildWhatsAppUrl(
      language,
      form,
      business.whatsapp.number,
    );

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    window.setTimeout(() => {
      submissionLock.current = false;
      setIsLoading(false);
    }, reduceMotion ? 200 : 800);
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

          <form ref={formRef} className="booking-form" onSubmit={handleSubmit} noValidate>
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
              {errors.name ? <p className="field-error" id="name-error">{d.booking.errors[errors.name]}</p> : null}
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
              {errors.phone ? <p className="field-error" id="phone-error">{d.booking.errors[errors.phone]}</p> : null}
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
              {errors.date ? <p className="field-error" id="date-error">{d.booking.errors[errors.date]}</p> : null}
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
              {errors.time ? <p className="field-error" id="time-error">{d.booking.errors[errors.time]}</p> : null}
            </div>

            <div className="field">
              <label htmlFor="booking-guests">{d.booking.guests}</label>
              <input
                id="booking-guests"
                name="guests"
                type="number"
                inputMode="numeric"
                min="1"
                max="20"
                value={form.guests}
                onChange={(event) => update("guests", event.target.value)}
                aria-invalid={Boolean(errors.guests)}
                aria-describedby={errors.guests ? "guests-error" : undefined}
              />
              {errors.guests ? <p className="field-error" id="guests-error">{d.booking.errors[errors.guests]}</p> : null}
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
              <p>{d.booking.helper}</p>
            </div>
          </form>
        </Reveal>
      </section>
    </div>
  );
}
