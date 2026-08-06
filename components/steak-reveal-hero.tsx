"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { CtaLink } from "@/components/site-shell";
import { business } from "@/lib/business";

type SegmentMotion = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

type SteakSegmentConfig = {
  id: number;
  desktopMask: string;
  mobileMask: string;
  depth: number;
  desktop: SegmentMotion;
  mobile: SegmentMotion;
};

const stages = {
  complete: 0.18,
  separation: 0.42,
  open: 0.78,
  handoff: 1,
} as const;

const segments: SteakSegmentConfig[] = [
  {
    id: 1,
    desktopMask: "radial-gradient(ellipse 49% 63% at 27% 29%, #000 0 56%, transparent 75%)",
    mobileMask: "radial-gradient(ellipse 60% 58% at 26% 30%, #000 0 57%, transparent 76%)",
    depth: 3,
    desktop: { x: -25, y: -18, rotation: -7, scale: 1.03 },
    mobile: { x: -15, y: -10, rotation: -3.5, scale: 1.02 },
  },
  {
    id: 2,
    desktopMask: "radial-gradient(ellipse 38% 70% at 51% 22%, #000 0 55%, transparent 76%)",
    mobileMask: "radial-gradient(ellipse 58% 58% at 75% 29%, #000 0 57%, transparent 76%)",
    depth: 5,
    desktop: { x: 3, y: -27, rotation: 4.5, scale: 1.045 },
    mobile: { x: 14, y: -11, rotation: 3, scale: 1.02 },
  },
  {
    id: 3,
    desktopMask: "radial-gradient(ellipse 48% 62% at 78% 29%, #000 0 55%, transparent 75%)",
    mobileMask: "radial-gradient(ellipse 58% 58% at 76% 73%, #000 0 57%, transparent 76%)",
    depth: 4,
    desktop: { x: 27, y: -15, rotation: 7.5, scale: 1.035 },
    mobile: { x: 15, y: 11, rotation: 3.5, scale: 1.02 },
  },
  {
    id: 4,
    desktopMask: "radial-gradient(ellipse 47% 60% at 79% 73%, #000 0 55%, transparent 75%)",
    mobileMask: "radial-gradient(ellipse 58% 58% at 24% 73%, #000 0 57%, transparent 76%)",
    depth: 2,
    desktop: { x: 29, y: 18, rotation: -5.5, scale: 1.025 },
    mobile: { x: -15, y: 12, rotation: -3, scale: 1.02 },
  },
  {
    id: 5,
    desktopMask: "radial-gradient(ellipse 39% 58% at 52% 82%, #000 0 55%, transparent 75%)",
    mobileMask: "radial-gradient(ellipse 48% 48% at 51% 53%, #000 0 58%, transparent 78%)",
    depth: 6,
    desktop: { x: 5, y: 27, rotation: 4, scale: 1.05 },
    mobile: { x: 1, y: 14, rotation: 1.5, scale: 1.025 },
  },
  {
    id: 6,
    desktopMask: "radial-gradient(ellipse 47% 61% at 23% 72%, #000 0 55%, transparent 75%)",
    mobileMask: "radial-gradient(ellipse 58% 58% at 24% 73%, #000 0 57%, transparent 76%)",
    depth: 2,
    desktop: { x: -28, y: 17, rotation: 6, scale: 1.03 },
    mobile: { x: -14, y: 10, rotation: 3, scale: 1.02 },
  },
  {
    id: 7,
    desktopMask: "radial-gradient(ellipse 36% 47% at 52% 53%, #000 0 58%, transparent 78%)",
    mobileMask: "radial-gradient(ellipse 48% 48% at 51% 53%, #000 0 58%, transparent 78%)",
    depth: 7,
    desktop: { x: -3, y: 5, rotation: -2.5, scale: 1.07 },
    mobile: { x: 0, y: 4, rotation: -1, scale: 1.035 },
  },
];

function SteakSegment({
  config,
  mode,
  progress,
}: {
  config: SteakSegmentConfig;
  mode: "desktop" | "mobile";
  progress: MotionValue<number>;
}) {
  const target = config[mode];
  const maskImage = mode === "desktop" ? config.desktopMask : config.mobileMask;
  const x = useTransform(
    progress,
    [0, stages.complete, stages.separation, stages.open, stages.handoff],
    ["0vw", "0vw", `${target.x * 0.06}vw`, `${target.x * 0.46}vw`, `${target.x}vw`],
  );
  const y = useTransform(
    progress,
    [0, stages.complete, stages.separation, stages.open, stages.handoff],
    ["0vh", "0vh", `${target.y * 0.06}vh`, `${target.y * 0.46}vh`, `${target.y}vh`],
  );
  const rotate = useTransform(
    progress,
    [0, stages.complete, stages.separation, stages.open, stages.handoff],
    [0, 0, target.rotation * 0.06, target.rotation * 0.46, target.rotation],
  );
  const scale = useTransform(
    progress,
    [0, stages.complete, stages.open, stages.handoff],
    [1, 1, target.scale, target.scale],
  );
  const opacity = useTransform(
    progress,
    [0, 0.1, stages.complete, 0.62, 0.82, stages.handoff],
    [0, 0, 1, 1, 0, 0],
  );

  return (
    <motion.div
      className="steak-segment"
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        WebkitMaskImage: maskImage,
        maskImage,
        zIndex: config.depth,
      }}
    />
  );
}

const STEAK_INTRO_KEY = "tuesday-steak-intro-seen-v1";

/** Cinematic aperture entrance that plays once per browser session. */
function SteakIntro() {
  const reduceMotion = useReducedMotion();
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(STEAK_INTRO_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    try {
      window.sessionStorage.setItem(STEAK_INTRO_KEY, "1");
    } catch {
      // Storage unavailable — animation still plays this once, just won't be remembered.
    }
    // Defer to a callback so we never call setState synchronously inside the effect body.
    const raf = window.requestAnimationFrame(() => setPlay(true));
    const timer = window.setTimeout(() => setPlay(false), 2100);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [reduceMotion]);

  if (!play) return null;

  return (
    <div className="steak-intro" aria-hidden="true">
      <div className="steak-intro-vignette" />
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className={`steak-petal steak-petal--${n}`} />
      ))}
      <div className="steak-crust-sweep" />
    </div>
  );
}

export function SteakRevealHero() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();
  const sequenceRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sequenceRef,
    offset: ["start start", "end end"],
  });

  const baseOpacity = useTransform(
    scrollYProgress,
    [0, stages.complete, stages.separation, 0.6, 0.7, stages.handoff],
    [1, 1, 1, 0.5, 0, 0],
  );
  const visualScale = useTransform(
    scrollYProgress,
    [0, stages.separation, stages.open, stages.handoff],
    [1, 1.018, 1.025, 1.025],
  );
  const visualY = useTransform(
    scrollYProgress,
    [0, stages.separation, stages.open, stages.handoff],
    [0, -8, -12, -12],
  );
  const imageShadeOpacity = useTransform(
    scrollYProgress,
    [0, stages.separation, stages.open, stages.handoff],
    [0.42, 0.3, 0.12, 0],
  );
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, stages.separation, 0.58, 0.7, 0.74, stages.handoff],
    [1, 1, 0.62, 0.08, 0, 0],
  );
  const contentY = useTransform(
    scrollYProgress,
    [0, stages.separation, 0.7, stages.handoff],
    [0, -6, -34, -46],
  );
  const metaOpacity = useTransform(
    scrollYProgress,
    [0, 0.34, 0.66, stages.open],
    [1, 0.82, 0.22, 0],
  );
  const glowOpacity = useTransform(
    scrollYProgress,
    [0, stages.complete, stages.separation, stages.open, stages.handoff],
    [0.16, 0.22, 0.48, 0.28, 0],
  );
  const steamOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, stages.separation, 0.64, 0.76, stages.handoff],
    [0.24, 0.34, 0.48, 0.2, 0, 0],
  );
  const handoffOpacity = useTransform(
    scrollYProgress,
    [0, 0.68, 0.74, 0.84, stages.handoff],
    [0, 0, 0.25, 1, 1],
  );
  const handoffY = useTransform(
    scrollYProgress,
    [0.62, stages.open, stages.handoff],
    [34, 18, 0],
  );
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const heroLines =
    language === "ru"
      ? ["Вечер начинается", "не по расписанию."]
      : ["Кеш кесте", "бойынша", "басталмайды."];

  return (
    <section ref={sequenceRef} className="steak-sequence" aria-labelledby="hero-title">
      <div className="steak-sticky">
        <div className="hero-panel steak-hero-panel">
          <div className="hero-grid-lines" aria-hidden="true" />

          <motion.div
            className="steak-handoff"
            style={reduceMotion ? undefined : { opacity: handoffOpacity }}
            aria-hidden="true"
          >
            <motion.div style={reduceMotion ? undefined : { y: handoffY }}>
              <span>02 / TUESDAY</span>
              <p>{d.home.statement}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="steak-visual"
            style={reduceMotion ? undefined : { scale: visualScale, y: visualY }}
          >
            <motion.div
              className="steak-base"
              style={reduceMotion ? undefined : { opacity: baseOpacity }}
            >
              <Image
                src="/images/tuesday-steak-hero.webp"
                alt={
                  language === "ru"
                    ? "Стейк на чёрном камне в тёплом ресторанном свете"
                    : "Жылы мейрамхана жарығындағы қара тас үстіндегі стейк"
                }
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 1600px"
                className="steak-base-image"
              />
            </motion.div>

            <div className="steak-segments steak-segments--desktop" aria-hidden="true">
              {segments.map((segment) => (
                <SteakSegment
                  key={`desktop-${segment.id}`}
                  config={segment}
                  mode="desktop"
                  progress={scrollYProgress}
                />
              ))}
            </div>
            <div className="steak-segments steak-segments--mobile" aria-hidden="true">
              {segments.slice(0, 5).map((segment) => (
                <SteakSegment
                  key={`mobile-${segment.id}`}
                  config={segment}
                  mode="mobile"
                  progress={scrollYProgress}
                />
              ))}
            </div>

            <motion.div
              className="steak-image-shade"
              style={reduceMotion ? undefined : { opacity: imageShadeOpacity }}
              aria-hidden="true"
            />

            <motion.div
              className="steak-steam"
              style={reduceMotion ? undefined : { opacity: steamOpacity }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 160 150" focusable="false">
                <defs>
                  <linearGradient id="steak-steam-tone" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0" stopColor="#e8dcc8" stopOpacity="0" />
                    <stop offset="0.32" stopColor="#f2e8d8" stopOpacity="0.56" />
                    <stop offset="0.74" stopColor="#eee5d8" stopOpacity="0.22" />
                    <stop offset="1" stopColor="#eee5d8" stopOpacity="0" />
                  </linearGradient>
                  <filter id="steak-steam-distortion" x="-60%" y="-30%" width="220%" height="170%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.018 0.055"
                      numOctaves="2"
                      seed="12"
                      result="steam-noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="steam-noise"
                      scale="7"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                    <feGaussianBlur stdDeviation="2.4" />
                  </filter>
                </defs>
                <g
                  fill="none"
                  stroke="url(#steak-steam-tone)"
                  strokeLinecap="round"
                  filter="url(#steak-steam-distortion)"
                >
                  <path className="steak-steam-path steak-steam-path--1" d="M34 139 C22 116 53 103 40 82 C26 60 56 43 47 18" strokeWidth="8" />
                  <path className="steak-steam-path steak-steam-path--2" d="M70 142 C82 118 55 105 72 83 C89 61 62 43 77 13" strokeWidth="7" />
                  <path className="steak-steam-path steak-steam-path--3" d="M107 139 C94 118 121 103 108 78 C97 57 128 41 120 18" strokeWidth="8" />
                  <path className="steak-steam-path steak-steam-path--4" d="M136 143 C150 122 126 105 141 86 C154 68 135 51 146 28" strokeWidth="6" />
                </g>
              </svg>
            </motion.div>
          </motion.div>

          <motion.div
            className="steak-central-glow"
            style={reduceMotion ? undefined : { opacity: glowOpacity }}
            aria-hidden="true"
          />

          <motion.div
            className="steak-hero-content-layer"
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

          <motion.div
            className="hero-meta"
            style={reduceMotion ? undefined : { opacity: metaOpacity }}
          >
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

          <div className="steak-progress" aria-hidden="true">
            <span>OPEN</span>
            <i><motion.b style={reduceMotion ? undefined : { scaleX: progressScale }} /></i>
          </div>

          <SteakIntro />
        </div>
      </div>
    </section>
  );
}
