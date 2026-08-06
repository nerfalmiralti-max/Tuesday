"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { CtaLink } from "@/components/site-shell";
import { business } from "@/lib/business";

const INTRO_KEY = "tuesday-steak-intro-seen-v2";
const IMAGE_SRC = "/images/tuesday-steak-hero.webp";
// Full entrance duration (unfold + assembly + sweep). Kept ~1.5–2.1s.
const INTRO_MS = 1650;

type Phase = "loading" | "intro" | "done";

// Organic wedges radiating from the steak's focal point — assemble seamlessly.
const petals = [1, 2, 3, 4, 5, 6] as const;

export function SteakRevealHero() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("loading");

  // Decide the entrance once (client only) — never navigates, only reveals.
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
        // Storage unavailable — still play once, just don't remember it.
      }
    }
    // Deferred via timers (which, unlike rAF, still fire in background tabs) so we
    // never call setState synchronously in the effect body and never stall the reveal.
    const startTimer = window.setTimeout(() => setPhase(play ? "intro" : "done"), 60);
    const doneTimer = play
      ? window.setTimeout(() => setPhase("done"), INTRO_MS)
      : 0;
    return () => {
      window.clearTimeout(startTimer);
      if (doneTimer) window.clearTimeout(doneTimer);
    };
  }, [reduceMotion]);

  // Pause the ambient steam whenever the hero is offscreen (no work while scrolled away).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.dataset.visible = entry.isIntersecting ? "true" : "false";
      },
      { threshold: 0.04 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const heroLines =
    language === "ru"
      ? ["Вечер начинается", "не по расписанию."]
      : ["Кеш кесте", "бойынша", "басталмайды."];

  const alt =
    language === "ru"
      ? "Стейк на чёрном камне в тёплом ресторанном свете"
      : "Жылы мейрамхана жарығындағы қара тас үстіндегі стейк";

  const showIntro = phase === "intro" && !reduceMotion;

  return (
    <section
      ref={sectionRef}
      className="steak-hero"
      data-phase={phase}
      data-visible="true"
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

          {showIntro ? (
            <div className="steak-petals">
              {petals.map((n) => (
                <span
                  key={n}
                  className={`steak-petal steak-petal--${n}`}
                  style={{ backgroundImage: `url(${IMAGE_SRC})` }}
                />
              ))}
            </div>
          ) : null}

          <div className="steak-scrim" />

          {showIntro ? <div className="steak-sweep" /> : null}

          {phase === "done" && !reduceMotion ? (
            <div className="steak-steam">
              <span className="steak-steam-col steak-steam-col--1" />
              <span className="steak-steam-col steak-steam-col--2" />
            </div>
          ) : null}
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
                        delay: 0.15 + index * 0.09,
                        duration: 0.75,
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
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
