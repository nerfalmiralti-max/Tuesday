"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { CtaLink } from "@/components/site-shell";
import { business } from "@/lib/business";

const IMAGE_SRC = "/images/tuesday-steak-hero.webp";

/*
 * The steak entrance is driven entirely by CSS, keyed off a `data-steak-intro`
 * attribute set on <html> by a tiny pre-paint script in the root layout. That means:
 *  - the image is visible by default (if JS/sessionStorage fail, it simply shows);
 *  - the reveal starts automatically before hydration, with no flash and no lag;
 *  - nothing here runs timers, rAF, scroll or pointer listeners.
 */
export function SteakRevealHero() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();

  const heroLines =
    language === "ru"
      ? ["Вечер начинается", "не по расписанию."]
      : ["Кеш кесте", "бойынша", "басталмайды."];

  const alt =
    language === "ru"
      ? "Стейк на чёрном камне в тёплом ресторанном свете"
      : "Жылы мейрамхана жарығындағы қара тас үстіндегі стейк";

  return (
    <section className="steak-hero" aria-labelledby="hero-title">
      <div className="hero-panel steak-hero-panel">
        <div className="hero-grid-lines" aria-hidden="true" />

        <div className="steak-frame" aria-hidden="true">
          <Image
            src={IMAGE_SRC}
            alt={alt}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 1600px"
            className="steak-final"
          />
          <div className="steak-warm" />
          <div className="steak-scrim" />
          <div className="steak-sweep" />
        </div>

        <div className="steak-hero-content">
          <div className="hero-topline">
            <div className="hero-brand-lockup" aria-label="Tuesday Lounge Bar">
              <strong>TUESDAY</strong>
              <span>LOUNGE BAR</span>
            </div>
            <p>{d.home.eyebrow}</p>
            <p className="hero-status">
              <span aria-hidden="true" />
              {d.home.status}
            </p>
          </div>

          <div className="hero-content">
            <p className="hero-index">TUE / 01</p>
            <div>
              <h1 id="hero-title" className="hero-title type-display-hero">
                {heroLines.map((line, index) => (
                  <span className="title-mask" key={line}>
                    <motion.span
                      initial={reduceMotion ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: 0.35 + index * 0.09,
                        duration: 0.72,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.div
                className="hero-copy-row"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="type-body-large">{d.home.heroBody}</p>
                <div className="hero-actions">
                  <CtaLink href="/booking">{d.home.bookCta}</CtaLink>
                  <CtaLink href="/menu" variant="secondary">
                    {d.home.menuCta}
                  </CtaLink>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="hero-meta">
            <a href={business.map} target="_blank" rel="noreferrer">
              <MapPin size={17} aria-hidden="true" />
              <span>{language === "ru" ? business.address.ru : business.address.kk}</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <div>
              <Clock3 size={17} aria-hidden="true" />
              <span>{business.hours}</span>
            </div>
            <a className="scroll-cue" href="#statement">
              {d.home.scroll}
              <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
