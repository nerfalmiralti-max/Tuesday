"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/motion-reveal";
import { CtaLink } from "@/components/site-shell";
import { useLanguage } from "@/components/language-provider";
import { business } from "@/lib/business";
import { menuItems } from "@/lib/menu";

export function HomePage() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    heroRef.current.style.setProperty("--pointer-x", `${x}%`);
    heroRef.current.style.setProperty("--pointer-y", `${y}%`);
  };

  const heroLines =
    language === "ru"
      ? ["Вечер начинается", "не по расписанию."]
      : ["Кеш кесте бойынша", "басталмайды."];

  return (
    <>
      <section className="hero-frame" aria-labelledby="hero-title">
        <motion.div
          ref={heroRef}
          className="hero-panel"
          onPointerMove={handlePointerMove}
          initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0 round 22px)" }}
          animate={{ clipPath: "inset(0 0 0% 0 round 22px)" }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="hero-grid-lines" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-t" aria-hidden="true">
            T
          </div>

          <div className="hero-topline">
            <p>{d.home.eyebrow}</p>
            <p className="hero-status">
              <span aria-hidden="true" />
              {d.home.status}
            </p>
          </div>

          <div className="hero-content">
            <motion.p
              className="hero-index"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              TUE / 01
            </motion.p>
            <div>
              <h1 id="hero-title" className="hero-title">
                {heroLines.map((line, index) => (
                  <span className="title-mask" key={line}>
                    <motion.span
                      initial={reduceMotion ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: 0.22 + index * 0.12,
                        duration: 0.84,
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
                transition={{ delay: 0.62, duration: 0.65 }}
              >
                <p>{d.home.heroBody}</p>
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
        </motion.div>
      </section>

      <section id="statement" className="statement-section section-light">
        <Reveal className="statement-grid">
          <p className="section-index">02 — {d.home.eyebrow}</p>
          <h2>{d.home.statement}</h2>
          <p className="statement-note">{d.home.statementNote}</p>
        </Reveal>
      </section>

      <section id="popular" className="popular-section section-light" aria-labelledby="popular-heading">
        <Reveal className="section-heading-grid">
          <p className="eyebrow">{d.home.popularKicker}</p>
          <div>
            <h2 id="popular-heading">{d.home.popularTitle}</h2>
            <p>{d.home.popularNote}</p>
          </div>
        </Reveal>

        <div className="dish-list">
          {menuItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <motion.article
                className="dish-row"
                whileHover={reduceMotion ? undefined : { x: 8 }}
                transition={{ duration: 0.25 }}
              >
                <span className="dish-number">0{index + 1}</span>
                <h3>{item.name[language]}</h3>
                <div className="dish-orbit" aria-hidden="true">
                  <span />
                </div>
                <span className="dish-mark">TUE</span>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <div className="section-end-link">
          <CtaLink href="/menu" variant="ghost">
            {d.home.menuCta}
          </CtaLink>
        </div>
      </section>

      <section id="offer" className="offer-frame" aria-labelledby="offer-heading">
        <Reveal className="offer-panel">
          <div className="offer-light" aria-hidden="true" />
          <div className="offer-topline">
            <p className="eyebrow">{d.home.offerKicker}</p>
            <span>{d.home.offerHours}</span>
          </div>
          <div className="offer-content">
            <div className="offer-price" aria-label={d.home.priceLabel}>
              <span>4 500</span>
              <sup>₸</sup>
            </div>
            <div className="offer-copy">
              <h2 id="offer-heading">{d.home.offerTitle}</h2>
              <p>{d.home.offerBody}</p>
              <CtaLink href="/booking" variant="secondary">
                {d.home.bookCta}
              </CtaLink>
            </div>
          </div>
          <div className="offer-code">12—19 / TUESDAY</div>
        </Reveal>
      </section>

      <section id="about" className="about-section section-light" aria-labelledby="about-heading">
        <Reveal className="about-grid">
          <div>
            <p className="eyebrow">{d.home.aboutKicker}</p>
            <span className="about-number">04</span>
          </div>
          <h2 id="about-heading">{d.home.about}</h2>
        </Reveal>
      </section>

      <section id="reservation" className="reservation-section" aria-labelledby="reservation-heading">
        <Reveal className="reservation-inner">
          <div className="reservation-intro">
            <p className="eyebrow">{d.home.reservationKicker}</p>
            <h2 id="reservation-heading">{d.home.reservationTitle}</h2>
            <p>{d.home.reservationBody}</p>
            <div className="reservation-actions">
              <CtaLink href="/booking">{d.home.bookCta}</CtaLink>
              <CtaLink href={business.whatsapp.url} variant="secondary">
                {d.common.whatsapp}
              </CtaLink>
            </div>
          </div>

          <dl className="reservation-details">
            <div>
              <dt>{d.common.hours}</dt>
              <dd>{business.hours}</dd>
            </div>
            <div>
              <dt>{d.common.address}</dt>
              <dd>{language === "ru" ? business.address.ru : business.address.kk}</dd>
            </div>
            <div>
              <dt>{d.common.phone}</dt>
              <dd>
                <a href={business.phone.tel}>{business.phone.display}</a>
              </dd>
            </div>
          </dl>
        </Reveal>

        <div className="final-word" aria-hidden="true">
          TUESDAY
        </div>
        <p className="final-line">{d.home.finalLine}</p>
      </section>
    </>
  );
}
