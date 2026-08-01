"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { useRef } from "react";
import { useLanguage } from "@/components/language-provider";
import { CtaLink } from "@/components/site-shell";
import { business } from "@/lib/business";

type PetalConfig = {
  id: number;
  tone: "ink" | "charcoal" | "warm" | "amber";
  closedRotation: number;
  openRotation: number;
  openX: number;
  openY: number;
  origin: string;
  delay: number;
  outer?: boolean;
};

const petals: PetalConfig[] = [
  { id: 1, tone: "ink", closedRotation: -8, openRotation: -74, openX: -42, openY: -8, origin: "50% 92%", delay: 0 },
  { id: 2, tone: "charcoal", closedRotation: 7, openRotation: 72, openX: 42, openY: -7, origin: "50% 92%", delay: 0.015 },
  { id: 3, tone: "warm", closedRotation: -2, openRotation: -118, openX: -34, openY: -28, origin: "50% 88%", delay: 0.035 },
  { id: 4, tone: "ink", closedRotation: 3, openRotation: 116, openX: 35, openY: -27, origin: "50% 88%", delay: 0.05 },
  { id: 5, tone: "charcoal", closedRotation: -12, openRotation: -148, openX: -22, openY: -40, origin: "50% 90%", delay: 0.075, outer: true },
  { id: 6, tone: "warm", closedRotation: 11, openRotation: 148, openX: 23, openY: -39, origin: "50% 90%", delay: 0.09, outer: true },
  { id: 7, tone: "amber", closedRotation: -4, openRotation: -48, openX: -49, openY: 18, origin: "50% 10%", delay: 0.11 },
  { id: 8, tone: "charcoal", closedRotation: 5, openRotation: 49, openX: 49, openY: 18, origin: "50% 10%", delay: 0.125 },
];

function BloomPetal({
  progress,
  config,
}: {
  progress: MotionValue<number>;
  config: PetalConfig;
}) {
  const awakening = 0.14 + config.delay;
  const bloom = 0.7 + config.delay * 0.5;
  const x = useTransform(
    progress,
    [0, awakening, bloom, 1],
    ["0vw", "0vw", `${config.openX * 0.62}vw`, `${config.openX}vw`],
  );
  const y = useTransform(
    progress,
    [0, awakening, bloom, 1],
    ["0vh", "0vh", `${config.openY * 0.58}vh`, `${config.openY}vh`],
  );
  const rotate = useTransform(
    progress,
    [0, awakening, bloom, 1],
    [config.closedRotation, config.closedRotation, config.openRotation * 0.68, config.openRotation],
  );
  const scale = useTransform(progress, [0, 0.2, 0.72, 1], [0.7, 0.76, 0.98, 1.06]);
  const opacity = useTransform(progress, [0, awakening, 0.82, 1], [0.72, 0.9, 1, 0.72]);
  const filter = useTransform(progress, [0, 0.22, 0.7], ["blur(2px)", "blur(1px)", "blur(0px)"]);

  return (
    <div className={`bloom-petal-anchor${config.outer ? " bloom-petal-anchor--outer" : ""}`}>
      <motion.div
        className={`bloom-petal bloom-petal--${config.tone}`}
        style={{ x, y, rotate, scale, opacity, filter, transformOrigin: config.origin }}
      >
        <span />
      </motion.div>
    </div>
  );
}

export function BloomHero() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();
  const sequenceRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sequenceRef,
    offset: ["start start", "end end"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.38, 0.68, 0.82], [1, 1, 0.45, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.38, 0.82], [0, -8, -64]);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.3, 0.58], [1, 0.72, 0]);
  const centralGlowOpacity = useTransform(scrollYProgress, [0, 0.28, 0.7, 1], [0.18, 0.42, 0.72, 0.14]);
  const centralGlowScale = useTransform(scrollYProgress, [0, 0.55, 1], [0.52, 1.02, 1.55]);
  const revealClip = useTransform(
    scrollYProgress,
    [0, 0.56, 0.78, 1],
    ["circle(0% at 50% 54%)", "circle(0% at 50% 54%)", "circle(32% at 50% 54%)", "circle(145% at 50% 54%)"],
  );
  const revealTextOpacity = useTransform(scrollYProgress, [0, 0.72, 0.9, 1], [0, 0, 0.6, 1]);
  const revealTextY = useTransform(scrollYProgress, [0.72, 1], [36, 0]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const heroLines =
    language === "ru"
      ? ["Вечер начинается", "не по расписанию."]
      : ["Кеш кесте", "бойынша", "басталмайды."];

  return (
    <section
      ref={sequenceRef}
      className={`bloom-sequence${reduceMotion ? " bloom-sequence--reduced" : ""}`}
      aria-labelledby="hero-title"
    >
      <div className="bloom-sticky">
        <motion.div
          className="hero-panel bloom-hero-panel"
          initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0 round 22px)" }}
          animate={{ clipPath: "inset(0 0 0% 0 round 22px)" }}
          transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-grid-lines" aria-hidden="true" />
          <motion.div
            className="bloom-central-glow"
            style={reduceMotion ? undefined : { opacity: centralGlowOpacity, scale: centralGlowScale }}
            aria-hidden="true"
          />

          <div className="bloom-petal-field" aria-hidden="true">
            {petals.map((petal) => (
              <BloomPetal key={petal.id} progress={scrollYProgress} config={petal} />
            ))}
            <div className="bloom-core">T</div>
          </div>

          {!reduceMotion ? (
            <motion.div className="bloom-reveal-surface" style={{ clipPath: revealClip }} aria-hidden="true">
              <motion.div style={{ opacity: revealTextOpacity, y: revealTextY }}>
                <span>02 / TUESDAY</span>
                <p>{d.home.statement}</p>
              </motion.div>
            </motion.div>
          ) : null}

          <motion.div
            className="bloom-hero-content-layer"
            style={reduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
          >
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
                          delay: 0.18 + index * 0.1,
                          duration: 0.78,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {line}
                      </motion.span>
                    </span>
                  ))}
                </h1>
                <div className="hero-copy-row">
                  <p className="type-body-large">{d.home.heroBody}</p>
                  <div className="hero-actions">
                    <CtaLink href="/booking">{d.home.bookCta}</CtaLink>
                    <CtaLink href="/menu" variant="secondary">
                      {d.home.menuCta}
                    </CtaLink>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div className="hero-meta" style={reduceMotion ? undefined : { opacity: metaOpacity }}>
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
          </motion.div>

          {!reduceMotion ? (
            <div className="bloom-progress" aria-hidden="true">
              <span>OPEN</span>
              <i><motion.b style={{ scaleX: progressScale }} /></i>
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
