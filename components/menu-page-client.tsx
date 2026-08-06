"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { CartControls } from "@/components/cart-controls";
import { Reveal } from "@/components/motion-reveal";
import { CtaLink } from "@/components/site-shell";
import { useLanguage } from "@/components/language-provider";
import { business } from "@/lib/business";
import {
  formatPrice,
  itemsByCategory,
  menuItems,
  popularItems,
  populatedCategories,
  type MenuItem,
} from "@/lib/menu";

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.04 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function normalize(value: string) {
  return value.toLocaleLowerCase().replace(/ё/g, "е").trim();
}

export function MenuPageClient() {
  const { language, dictionary: d } = useLanguage();
  const reduceMotion = useReducedMotion();

  const [activeCategory, setActiveCategory] = useState(populatedCategories[0].id);
  const [query, setQuery] = useState("");

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const markShift = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  const results = useMemo(() => {
    if (!isSearching) return [];
    const q = normalize(trimmedQuery);
    return menuItems.filter((item) => {
      const haystack = normalize(
        [
          item.name.ru,
          item.name.kk,
          item.description?.ru ?? "",
          item.description?.kk ?? "",
        ].join(" "),
      );
      return haystack.includes(q);
    });
  }, [isSearching, trimmedQuery]);

  const activeItems = isSearching ? results : itemsByCategory(activeCategory);
  const stageKey = isSearching ? "search-results" : activeCategory;

  const renderPrice = (item: MenuItem) => {
    if (item.price === null) {
      return <span className="dish-item-price dish-item-price--soon">{d.menu.priceOnRequest}</span>;
    }
    return (
      <span className="dish-item-price">
        {item.priceFrom ? <em>{d.menu.from}&nbsp;</em> : null}
        {formatPrice(item.price)}
        <i aria-hidden="true">{d.common.currency}</i>
      </span>
    );
  };

  return (
    <div className="inner-page menu-page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="page-hero page-hero--menu" aria-labelledby="menu-title">
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
            initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            {d.menu.intro}
          </motion.p>
        </div>
        <a className="page-scroll" href="#popular-menu">
          {d.menu.popularTitle}
          <ArrowDown size={17} aria-hidden="true" />
        </a>
        <motion.div
          className="menu-hero-mark"
          aria-hidden="true"
          style={reduceMotion ? undefined : { y: markShift }}
        >
          M
        </motion.div>
      </section>

      {/* ── Popular dishes (cinematic) ───────────────────────── */}
      <section id="popular-menu" className="menu-popular" aria-labelledby="menu-popular-title">
        <motion.div
          className="menu-popular-inner"
          initial={reduceMotion ? undefined : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.25 }}
          variants={listVariants}
        >
          <motion.div className="menu-popular-head" variants={cardVariants}>
            <p className="eyebrow type-label">{d.menu.popularKicker}</p>
            <h2 id="menu-popular-title" className="type-section-title">
              {d.menu.popularTitle}
            </h2>
            <p className="type-body-regular menu-popular-note">{d.menu.popularNote}</p>
          </motion.div>

          <div className="menu-popular-grid">
            {popularItems.map((item, index) => (
              <motion.article
                key={item.id}
                className="popular-card"
                variants={cardVariants}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="popular-card-index">0{index + 1}</span>
                <span className="popular-card-glow" aria-hidden="true" />
                <h3>{item.name[language]}</h3>
                <div className="popular-card-foot">
                  {renderPrice(item)}
                  <CartControls itemId={item.id} tone="dark" />
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Daytime hookah promotion ─────────────────────────── */}
      <section id="menu-offer" className="menu-offer" aria-labelledby="menu-offer-title">
        <Reveal className="menu-offer-panel">
          <div className="menu-offer-sweep" aria-hidden="true" />
          <div className="menu-offer-glow" aria-hidden="true" />
          <div className="menu-offer-top">
            <p className="eyebrow type-label">{d.menu.promoKicker}</p>
            <span className="type-metadata">{d.menu.promoHours}</span>
          </div>
          <div className="menu-offer-body">
            <div className="menu-offer-price" aria-label={`4 500 ${d.common.currency}`}>
              <span>4 500</span>
              <sup>{d.common.currency}</sup>
            </div>
            <div className="menu-offer-copy">
              <h2 id="menu-offer-title" className="type-section-title">
                {d.menu.promoTitle}
                <em>{d.menu.promoWith}</em>
              </h2>
              <p className="type-body-large">{d.menu.promoBody}</p>
              <CtaLink href="/booking" variant="secondary">
                {d.menu.bookCta}
              </CtaLink>
            </div>
          </div>
          <div className="menu-offer-code type-caption">12—19 / TUESDAY</div>
        </Reveal>
      </section>

      {/* ── Full catalog ─────────────────────────────────────── */}
      <section className="menu-catalog-v2" aria-labelledby="catalog-title">
        <div className="catalog-head">
          <div className="catalog-head-copy">
            <p className="eyebrow type-label">{d.menu.catalogKicker}</p>
            <h2 id="catalog-title" className="type-section-title">
              {d.menu.catalogTitle}
            </h2>
          </div>
          <div className="catalog-search" role="search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={d.menu.searchPlaceholder}
              aria-label={d.menu.searchLabel}
              autoComplete="off"
            />
            {isSearching ? (
              <button type="button" onClick={() => setQuery("")} aria-label={d.menu.clearSearch}>
                <X size={16} aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        <nav
          className={`category-bar${isSearching ? " category-bar--dim" : ""}`}
          aria-label={d.menu.catalogTitle}
        >
          {(["kitchen", "bar"] as const).map((group) => (
            <div className="category-group" key={group}>
              <span className="category-group-label">
                {group === "kitchen" ? d.menu.groupKitchen : d.menu.groupBar}
              </span>
              <div className="category-chips">
                {populatedCategories
                  .filter((category) => category.group === group)
                  .map((category) => {
                    const isActive = !isSearching && category.id === activeCategory;
                    return (
                      <button
                        type="button"
                        key={category.id}
                        className={`category-chip${isActive ? " is-active" : ""}`}
                        aria-pressed={isActive}
                        onClick={(event) => {
                          setQuery("");
                          setActiveCategory(category.id);
                          event.currentTarget.scrollIntoView({
                            inline: "center",
                            block: "nearest",
                            behavior: "smooth",
                          });
                        }}
                      >
                        {category.title[language]}
                        {isActive ? (
                          <motion.span
                            className="category-chip-underline"
                            layoutId="category-underline"
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          />
                        ) : null}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="category-stage">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={stageKey}
              className="category-panel"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              {isSearching ? (
                <p className="category-panel-title type-label">
                  {d.menu.searchResults}
                  <span>{String(activeItems.length).padStart(2, "0")}</span>
                </p>
              ) : null}

              {activeItems.length === 0 ? (
                <div className="menu-empty" role="status">
                  <p>{isSearching ? d.menu.noResults : d.menu.emptyCategory}</p>
                  {isSearching ? <span>{d.menu.noResultsHint}</span> : null}
                </div>
              ) : (
                <motion.ul
                  className="dish-items"
                  variants={listVariants}
                  initial={reduceMotion ? false : "hidden"}
                  animate="show"
                >
                  {activeItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      className="dish-item"
                      variants={cardVariants}
                      whileHover={reduceMotion ? undefined : { x: 6 }}
                      transition={{ duration: 0.24 }}
                    >
                      <span className="dish-item-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="dish-item-body">
                        <h3>
                          {item.name[language]}
                          {item.volume ? <span className="dish-item-volume">{item.volume}</span> : null}
                          {item.popular ? (
                            <span className="dish-item-badge">{d.menu.popularKicker}</span>
                          ) : null}
                        </h3>
                        {item.description ? (
                          <p className="dish-item-desc">{item.description[language]}</p>
                        ) : null}
                      </div>
                      <span className="dish-item-leader" aria-hidden="true" />
                      <div className="dish-item-actions">
                        {renderPrice(item)}
                        <CartControls itemId={item.id} />
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </motion.div>
          </AnimatePresence>

          <p className="menu-service-note type-caption">{d.menu.serviceNote}</p>
        </div>
      </section>

      {/* ── Reservation CTA + contact ────────────────────────── */}
      <section className="menu-reserve" aria-labelledby="menu-reserve-title">
        <Reveal className="menu-reserve-inner">
          <div className="menu-reserve-copy">
            <p className="eyebrow type-label">{d.menu.reserveKicker}</p>
            <h2 id="menu-reserve-title" className="type-section-title">
              {d.menu.reserveTitle}
            </h2>
            <p className="type-body-large">{d.menu.reserveBody}</p>
            <div className="menu-reserve-actions">
              <CtaLink href="/booking">{d.menu.bookCta}</CtaLink>
              <CtaLink href={business.whatsapp.url} variant="secondary">
                {d.common.whatsapp}
              </CtaLink>
            </div>
          </div>
          <div className="menu-reserve-contact">
            <p className="type-label">{d.menu.contactTitle}</p>
            <p>{d.menu.contactBody}</p>
            <div className="menu-reserve-links">
              <CtaLink href={business.whatsapp.url} variant="secondary">
                {d.menu.askWhatsapp}
              </CtaLink>
              <CtaLink href={business.instagram} variant="secondary">
                {d.menu.openInstagram}
              </CtaLink>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
