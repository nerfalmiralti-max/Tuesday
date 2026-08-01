"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BloomHero } from "@/components/bloom-hero";
import { Reveal } from "@/components/motion-reveal";
import { CtaLink } from "@/components/site-shell";
import { useLanguage } from "@/components/language-provider";
import { business } from "@/lib/business";
import { menuItems } from "@/lib/menu";

export function HomePage() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <>
      <BloomHero />

      <section id="statement" className="statement-section section-light">
        <Reveal className="statement-grid">
          <p className="section-index type-metadata">02 — {d.home.eyebrow}</p>
          <h2 className="type-editorial-statement">{d.home.statement}</h2>
          <p className="statement-note type-body-regular">{d.home.statementNote}</p>
        </Reveal>
      </section>

      <section id="popular" className="popular-section section-light" aria-labelledby="popular-heading">
        <Reveal className="section-heading-grid">
          <p className="eyebrow type-label">{d.home.popularKicker}</p>
          <div>
            <h2 id="popular-heading" className="type-section-title">{d.home.popularTitle}</h2>
            <p className="type-body-regular">{d.home.popularNote}</p>
          </div>
        </Reveal>

        <div className="dish-list">
          {menuItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06}>
              <motion.article
                className="dish-row"
                whileHover={reduceMotion ? undefined : { x: 6 }}
                transition={{ duration: 0.24 }}
              >
                <span className="dish-number type-caption">0{index + 1}</span>
                <h3 className="type-menu-item">{item.name[language]}</h3>
                <div className="dish-orbit" aria-hidden="true">
                  <span />
                </div>
                <span className="dish-mark type-caption">TUE</span>
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
            <p className="eyebrow type-label">{d.home.offerKicker}</p>
            <span className="type-metadata">{d.home.offerHours}</span>
          </div>
          <div className="offer-content">
            <div className="offer-price type-promotional-number" aria-label={d.home.priceLabel}>
              <span>4 500</span>
              <sup>₸</sup>
            </div>
            <div className="offer-copy">
              <h2 id="offer-heading" className="type-section-title">{d.home.offerTitle}</h2>
              <p className="type-body-large">{d.home.offerBody}</p>
              <CtaLink href="/booking" variant="secondary">
                {d.home.bookCta}
              </CtaLink>
            </div>
          </div>
          <div className="offer-code type-caption">12—19 / TUESDAY</div>
        </Reveal>
      </section>

      <section id="about" className="about-section section-light" aria-labelledby="about-heading">
        <Reveal className="about-grid">
          <div>
            <p className="eyebrow type-label">{d.home.aboutKicker}</p>
            <span className="about-number">04</span>
          </div>
          <h2 id="about-heading" className="type-about">{d.home.about}</h2>
        </Reveal>
      </section>

      <section id="reservation" className="reservation-section" aria-labelledby="reservation-heading">
        <Reveal className="reservation-inner">
          <div className="reservation-intro">
            <p className="eyebrow type-label">{d.home.reservationKicker}</p>
            <h2 id="reservation-heading" className="type-section-title">{d.home.reservationTitle}</h2>
            <p className="type-body-large">{d.home.reservationBody}</p>
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

        <div className="final-word" aria-hidden="true">TUESDAY</div>
        <p className="final-line type-caption">{d.home.finalLine}</p>
      </section>
    </>
  );
}
