"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion-reveal";
import { CtaLink } from "@/components/site-shell";
import { useLanguage } from "@/components/language-provider";
import { business } from "@/lib/business";
import { menuItems } from "@/lib/menu";

export function MenuPageClient() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <div className="inner-page menu-page">
      <section className="page-hero page-hero--menu" aria-labelledby="menu-title">
        <div className="page-hero-code">TUE / MENU / 01</div>
        <div className="page-hero-main">
          <motion.p
            className="eyebrow"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {d.menu.eyebrow}
          </motion.p>
          <h1 id="menu-title" className="page-title">
            <span className="title-mask">
              <motion.span
                initial={reduceMotion ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {d.menu.title}
              </motion.span>
            </span>
          </h1>
          <motion.p
            className="page-intro"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {d.menu.intro}
          </motion.p>
        </div>
        <a className="page-scroll" href="#popular-menu">
          {d.menu.popular}
          <ArrowDown size={17} aria-hidden="true" />
        </a>
        <div className="menu-hero-mark" aria-hidden="true">M</div>
      </section>

      <section id="popular-menu" className="menu-catalog" aria-labelledby="category-title">
        <aside className="category-nav">
          <p>01</p>
          <a href="#popular-menu" aria-current="true">
            {d.menu.popular}
          </a>
          <span>{String(menuItems.length).padStart(2, "0")}</span>
        </aside>

        <div className="menu-category">
          <Reveal className="menu-category-header">
            <p className="eyebrow">TUE / 01</p>
            <h2 id="category-title">{d.menu.popular}</h2>
          </Reveal>

          <div className="menu-rows">
            {menuItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.06}>
                <motion.article
                  className="menu-row"
                  whileHover={reduceMotion ? undefined : { x: 6 }}
                  transition={{ duration: 0.22 }}
                >
                  <span className="menu-row-index">0{index + 1}</span>
                  <div className="menu-row-name">
                    <h3>{item.name[language]}</h3>
                    <span>{d.menu.imageReady}</span>
                  </div>
                  <p>{d.menu.priceSoon}</p>
                  <ArrowUpRight aria-hidden="true" size={20} />
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="menu-update" aria-labelledby="menu-update-title">
        <Reveal className="menu-update-inner">
          <p className="eyebrow">TUE / UPDATE</p>
          <div>
            <h2 id="menu-update-title">{d.menu.updateTitle}</h2>
            <p>{d.menu.updateBody}</p>
          </div>
          <div className="menu-update-actions">
            <CtaLink href={business.whatsapp.url}>{d.menu.askWhatsapp}</CtaLink>
            <CtaLink href={business.instagram} variant="secondary">
              {d.menu.openInstagram}
            </CtaLink>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

