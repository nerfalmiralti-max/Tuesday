"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { CartControls } from "@/components/cart-controls";
import { useCart } from "@/components/cart-provider";
import { useLanguage } from "@/components/language-provider";
import { formatPrice } from "@/lib/menu";

export function CartDrawer() {
  const { language, dictionary: d } = useLanguage();
  const { entries, count, subtotal, remove, clear } = useCart();
  const reduceMotion = useReducedMotion();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const visible = count > 0;

  // Keep body padded so the sticky mobile bar never hides the last content.
  useEffect(() => {
    document.body.classList.toggle("has-cart-bar", visible);
    return () => document.body.classList.remove("has-cart-bar");
  }, [visible]);

  // If the cart empties (e.g. all removed), reset the sheet (deferred to avoid a sync setState).
  useEffect(() => {
    if (count !== 0) return;
    const raf = window.requestAnimationFrame(() => {
      setOpen(false);
      setConfirmClear(false);
    });
    return () => window.cancelAnimationFrame(raf);
  }, [count]);

  // Escape to close + body scroll lock + focus management.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") trapFocus(event, panelRef.current);
    };
    document.addEventListener("keydown", onKey);
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }, 20);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(focusTimer);
      (previouslyFocused ?? trigger)?.focus?.();
    };
  }, [open]);

  const goToBooking = () => {
    setOpen(false);
    router.push("/booking");
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    clear();
    setConfirmClear(false);
  };

  if (!visible) return null;

  const countLabel = `${count} ${d.cart.items}`;

  return (
    <>
      {/* Desktop floating summary */}
      <button
        ref={triggerRef}
        type="button"
        className="cart-fab"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={d.cart.open}
      >
        <ShoppingBag size={18} aria-hidden="true" />
        <span className="cart-fab-count">{count}</span>
        {subtotal > 0 ? (
          <span className="cart-fab-total">
            {formatPrice(subtotal)}&nbsp;₸
          </span>
        ) : (
          <span className="cart-fab-total">{d.cart.viewCart}</span>
        )}
      </button>

      {/* Mobile sticky bar */}
      <button type="button" className="cart-bar" onClick={() => setOpen(true)} aria-label={d.cart.open}>
        <span className="cart-bar-left">
          <ShoppingBag size={17} aria-hidden="true" />
          <span>
            <strong>{countLabel}</strong>
            <small>{d.cart.preliminaryShort}</small>
          </span>
        </span>
        <span className="cart-bar-right">
          {subtotal > 0 ? <span>{formatPrice(subtotal)}&nbsp;₸</span> : null}
          <span className="cart-bar-cta">
            {d.cart.viewCart}
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="cart-overlay"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={panelRef}
              className="cart-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={reduceMotion ? false : { x: "6%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "6%", opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <header className="cart-panel-head">
                <div>
                  <p className="eyebrow type-label">{d.cart.title}</p>
                  <h2 id={titleId}>{d.cart.selectedDishes}</h2>
                </div>
                <button
                  type="button"
                  className="cart-panel-close"
                  onClick={() => setOpen(false)}
                  aria-label={d.cart.close}
                  data-autofocus
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </header>

              <p className="cart-panel-note">{d.cart.preliminary}</p>

              <ul className="cart-lines">
                {entries.map((entry) => (
                  <li key={entry.id} className="cart-line">
                    <div className="cart-line-main">
                      <h3>{entry.item.name[language]}</h3>
                      <p className="cart-line-meta">
                        {entry.item.volume ? <span>{entry.item.volume}</span> : null}
                        <span>
                          {entry.price === null
                            ? d.cart.priceTbd
                            : `${formatPrice(entry.price)} ₸`}
                        </span>
                      </p>
                    </div>
                    <div className="cart-line-side">
                      <CartControls itemId={entry.id} />
                      <div className="cart-line-total">
                        {entry.lineTotal === null
                          ? d.cart.priceTbd
                          : `${formatPrice(entry.lineTotal)} ₸`}
                      </div>
                      <button
                        type="button"
                        className="cart-line-remove"
                        onClick={() => remove(entry.id)}
                        aria-label={`${d.cart.remove}: ${entry.item.name[language]}`}
                      >
                        {d.cart.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-panel-foot">
                <div className="cart-subtotal">
                  <span>{d.cart.subtotal}</span>
                  <strong>{subtotal > 0 ? `${formatPrice(subtotal)} ₸` : d.cart.priceTbd}</strong>
                </div>
                <p className="cart-confirm-note">{d.cart.confirmNotice}</p>
                <button type="button" className="cta cta--primary cart-continue" onClick={goToBooking}>
                  <span>{d.cart.continue}</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className={`cart-clear${confirmClear ? " is-confirming" : ""}`}
                  onClick={handleClear}
                  onBlur={() => setConfirmClear(false)}
                >
                  {confirmClear ? d.cart.clearConfirm : d.cart.clear}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function trapFocus(event: KeyboardEvent, container: HTMLElement | null) {
  if (!container) return;
  const focusable = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
