"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import {
  cartCount,
  cartReducer,
  cartSubtotal,
  CART_STORAGE_KEY,
  initialCartState,
  parseStoredCart,
  resolveCart,
  serializeCart,
  type CartItem,
  type ResolvedCartEntry,
} from "@/lib/cart";

type CartContextValue = {
  /** Raw persisted entries (id + quantity), for building WhatsApp dish lines. */
  items: CartItem[];
  entries: ResolvedCartEntry[];
  count: number;
  subtotal: number;
  quantityOf: (id: string) => number;
  add: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  // Persistence must skip its very first run so it can't overwrite stored data
  // before the hydration effect below has read it.
  const persistReady = useRef(false);

  // Hydrate from localStorage on mount. The initial (server + first client) render is
  // always the empty cart, so there is no hydration mismatch; this dispatch is a
  // post-hydration client update. No rAF/timeout — those pause in background tabs.
  useEffect(() => {
    try {
      const stored = parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
      if (stored.length > 0) dispatch({ type: "hydrate", items: stored });
    } catch {
      // Storage unavailable (private mode / disabled) — keep the empty cart.
    }
  }, []);

  // Persist whenever items change, skipping the initial mount render.
  useEffect(() => {
    if (!persistReady.current) {
      persistReady.current = true;
      return;
    }
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(state.items));
    } catch {
      // Ignore write failures — the in-memory cart still works this session.
    }
  }, [state.items]);

  const quantityOf = useCallback(
    (id: string) => state.items.find((entry) => entry.id === id)?.quantity ?? 0,
    [state.items],
  );

  const add = useCallback((id: string) => dispatch({ type: "add", id }), []);
  const increment = useCallback((id: string) => dispatch({ type: "increment", id }), []);
  const decrement = useCallback((id: string) => dispatch({ type: "decrement", id }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const entries = useMemo(() => resolveCart(state.items), [state.items]);
  const count = useMemo(() => cartCount(state.items), [state.items]);
  const subtotal = useMemo(() => cartSubtotal(state.items), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      entries,
      count,
      subtotal,
      quantityOf,
      add,
      increment,
      decrement,
      remove,
      clear,
    }),
    [state.items, entries, count, subtotal, quantityOf, add, increment, decrement, remove, clear],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {count > 0 ? count : ""}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
