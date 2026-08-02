"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AtSign,
  ArrowUpRight,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { business } from "@/lib/business";
import type { Language } from "@/lib/i18n";

const navItems = [
  { key: "home" as const, href: "/" },
  { key: "menu" as const, href: "/menu" },
  { key: "booking" as const, href: "/booking" },
];

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, dictionary: d } = useLanguage();

  return (
    <div
      className={`language-toggle${compact ? " language-toggle--compact" : ""}`}
      aria-label={d.common.language}
    >
      {(["ru", "kk"] as Language[]).map((item) => (
        <button
          type="button"
          key={item}
          className={language === item ? "is-active" : ""}
          onClick={() => setLanguage(item)}
          aria-pressed={language === item}
        >
          {item === "ru" ? "RU" : "ҚАЗ"}
        </button>
      ))}
    </div>
  );
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  icon = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  icon?: boolean;
  className?: string;
}) {
  const external =
    href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const classes = `cta cta--${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      {icon ? <ArrowUpRight aria-hidden="true" size={18} /> : null}
    </>
  );

  if (external) {
    return (
      <a
        className={classes}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {content}
    </Link>
  );
}

function Header() {
  const pathname = usePathname();
  const { language, dictionary: d } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="wordmark" href="/" aria-label="Tuesday Lounge Bar">
          <span>TUESDAY</span>
          <small>LOUNGE BAR</small>
        </Link>

        <nav className="desktop-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={pathname === item.href ? "is-active" : ""}
            >
              {d.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageToggle compact />
          <CtaLink href="/booking" className="header-booking">
            {d.nav.reserve}
          </CtaLink>
          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? d.nav.close : d.nav.open}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile">
              {navItems.map((item, index) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={pathname === item.href ? "is-active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>0{index + 1}</span>
                  {d.nav[item.key]}
                </Link>
              ))}
            </nav>
            <div className="mobile-menu-meta">
              <div>
                <small>{d.common.hours}</small>
                <p>{business.hours}</p>
              </div>
              <div>
                <small>{d.common.address}</small>
                <p>{language === "ru" ? business.address.ru : business.address.kk}</p>
              </div>
            </div>
            <LanguageToggle />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const { language, dictionary: d } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="footer-wordmark">TUESDAY</p>
          <p>{d.footer.line}</p>
        </div>
        <div className="footer-links">
          <a href={business.whatsapp.url} target="_blank" rel="noreferrer">
            <MessageCircle size={17} aria-hidden="true" />
            {d.common.whatsapp}
          </a>
          <a href={business.phone.tel}>
            <Phone size={17} aria-hidden="true" />
            {business.phone.display}
          </a>
          <a href={business.instagram} target="_blank" rel="noreferrer">
            <AtSign size={17} aria-hidden="true" />
            Instagram
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {d.footer.rights}</span>
        <a
          href="https://portfolio-ochre-six-34.vercel.app/"
          target="_blank"
          rel="noreferrer"
        >
          Created by Altair
        </a>
        <a href={business.map} target="_blank" rel="noreferrer">
          {language === "ru" ? business.address.ru : business.address.kk}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

function MobileActionBar() {
  const { dictionary: d } = useLanguage();

  return (
    <nav className="mobile-action-bar" aria-label="Quick actions">
      <Link href="/menu">
        <span>01</span>
        {d.nav.menu}
      </Link>
      <Link href="/booking" className="mobile-action-primary">
        <span>02</span>
        {d.nav.booking}
      </Link>
    </nav>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { dictionary: d } = useLanguage();

  return (
    <>
      <a className="skip-link" href="#main-content">
        {d.skip}
      </a>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
