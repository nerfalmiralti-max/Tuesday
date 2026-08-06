"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { CtaLink } from "@/components/site-shell";
import { business } from "@/lib/business";

const INTRO_KEY = "tuesday-steak-intro-seen-v3";
const IMAGE_SRC = "/images/tuesday-steak-hero.webp";

type Phase = "loading" | "done";
type Reveal = "full" | "instant";

export function SteakRevealHero() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loading");
  const [reveal, setReveal] = useState<Reveal>("full");

  // Decide the entrance once (client only). Never navigates — it only reveals.
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      seen = false;
    }
    const play = !seen && !reduceMotion;
    if (play) {
      try {
        window.sessionStorage.setItem(INTRO_KEY, "1");
      } catch {
        // Storage unavailable — still reveal once, just don't remember it.
      }
    }
    // Timer (fires in background tabs, unlike rAF) — no sync setState in the effect body.
    const timer = window.setTimeout(() => {
      setReveal(play ? "full" : "instant");
      setPhase("done");
    }, 40);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const heroLines =
    language === "ru"
      ? ["Вечер начинается", "не по расписанию."]
      : ["Кеш кесте", "бойынша", "басталмайды."];

  const alt =
    language === "ru"
      ? "Стейк на чёрном камне в тёплом ресторанном свете"
      : "Жылы мейрамхана жарығындағы қара тас үстіндегі стейк";

  const playingSweep = phase === "done" && reveal === "full" && !reduceMotion;

  return (
    <section
      className="steak-hero"
      data-phase={phase}
      data-reveal={reveal}
      aria-labelledby="hero-title"
    >
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
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMAGE_SRC} alt={alt} className="steak-noscript" />
          </noscript>
          <div className="steak-scrim" />
          {playingSweep ? <div className="steak-sweep" /> : null}
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
                        delay: 0.14 + index * 0.08,
                        duration: 0.7,
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
                transition={{ delay: 0.42, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
