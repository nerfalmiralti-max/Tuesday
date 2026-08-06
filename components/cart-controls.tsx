"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { useCart } from "@/components/cart-provider";
import { MAX_QUANTITY } from "@/lib/cart";

export function CartControls({
  itemId,
  tone = "light",
}: {
  itemId: string;
  tone?: "light" | "dark";
}) {
  const { dictionary: d } = useLanguage();
  const { quantityOf, add, increment, decrement } = useCart();
  const reduceMotion = useReducedMotion();

  const quantity = quantityOf(itemId);
  const scale = reduceMotion ? undefined : { scale: 0.94 };

  if (quantity === 0) {
    return (
      <motion.button
        type="button"
        className={`cart-add cart-add--${tone}`}
        onClick={() => add(itemId)}
        whileTap={scale}
        aria-label={`${d.cart.add}: ${itemId}`.trim()}
      >
        <Plus size={15} aria-hidden="true" />
        <span>{d.cart.add}</span>
      </motion.button>
    );
  }

  return (
    <div
      className={`cart-stepper cart-stepper--${tone}`}
      role="group"
      aria-label={d.cart.selectedDishes}
    >
      <motion.button
        type="button"
        className="cart-stepper-btn"
        onClick={() => decrement(itemId)}
        whileTap={scale}
        aria-label={d.cart.decrease}
      >
        <Minus size={15} aria-hidden="true" />
      </motion.button>
      <span className="cart-stepper-count" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantity}
            initial={reduceMotion ? false : { y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: -8, opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        className="cart-stepper-btn"
        onClick={() => increment(itemId)}
        whileTap={scale}
        disabled={quantity >= MAX_QUANTITY}
        aria-label={d.cart.increase}
      >
        {quantity >= MAX_QUANTITY ? (
          <Check size={15} aria-hidden="true" />
        ) : (
          <Plus size={15} aria-hidden="true" />
        )}
      </motion.button>
    </div>
  );
}
