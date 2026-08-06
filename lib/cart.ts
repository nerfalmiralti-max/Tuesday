import type { Language } from "@/lib/i18n";
import { formatPrice, menuItems, type MenuItem } from "@/lib/menu";

export const CART_STORAGE_KEY = "tuesday-lounge-cart-v1";
export const CART_VERSION = 1;
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 20;

/** Only stable id + quantity are persisted — everything else resolves from the menu. */
export type CartItem = {
  id: string;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type ResolvedCartEntry = {
  id: string;
  quantity: number;
  item: MenuItem;
  /** Unit price in KZT, or null when the menu has no confirmed price. */
  price: number | null;
  /** quantity × price, or null when price is unknown. */
  lineTotal: number | null;
};

export type CartAction =
  | { type: "add"; id: string }
  | { type: "increment"; id: string }
  | { type: "decrement"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const clampQuantity = (value: number) =>
  Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(value)));

export const initialCartState: CartState = { items: [] };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((entry) => entry.id === action.id);
      if (existing) {
        if (existing.quantity >= MAX_QUANTITY) return state;
        return {
          items: state.items.map((entry) =>
            entry.id === action.id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry,
          ),
        };
      }
      return { items: [...state.items, { id: action.id, quantity: 1 }] };
    }
    case "increment": {
      return {
        items: state.items.map((entry) =>
          entry.id === action.id
            ? { ...entry, quantity: clampQuantity(entry.quantity + 1) }
            : entry,
        ),
      };
    }
    case "decrement": {
      return {
        items: state.items
          .map((entry) =>
            entry.id === action.id
              ? { ...entry, quantity: entry.quantity - 1 }
              : entry,
          )
          .filter((entry) => entry.quantity >= MIN_QUANTITY),
      };
    }
    case "remove": {
      return { items: state.items.filter((entry) => entry.id !== action.id) };
    }
    case "clear": {
      return initialCartState;
    }
    case "hydrate": {
      return { items: action.items };
    }
    default:
      return state;
  }
}

/** Safely parse persisted cart data, discarding malformed / outdated / unknown entries. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      (parsed as { version?: unknown }).version !== CART_VERSION ||
      !Array.isArray((parsed as { items?: unknown }).items)
    ) {
      return [];
    }
    const seen = new Set<string>();
    const items: CartItem[] = [];
    for (const raw of (parsed as { items: unknown[] }).items) {
      if (typeof raw !== "object" || raw === null) continue;
      const id = (raw as { id?: unknown }).id;
      const quantity = (raw as { quantity?: unknown }).quantity;
      if (typeof id !== "string" || typeof quantity !== "number") continue;
      if (!Number.isFinite(quantity)) continue;
      if (seen.has(id)) continue;
      // Drop items that no longer exist in the current menu.
      if (!menuItems.some((item) => item.id === id)) continue;
      seen.add(id);
      items.push({ id, quantity: clampQuantity(quantity) });
    }
    return items;
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItem[]): string {
  return JSON.stringify({ version: CART_VERSION, items });
}

// ── Selectors ──────────────────────────────────────────────
export function cartCount(items: CartItem[]): number {
  return items.reduce((total, entry) => total + entry.quantity, 0);
}

export function resolveCart(items: CartItem[]): ResolvedCartEntry[] {
  return items
    .map((entry) => {
      const item = menuItems.find((menuItem) => menuItem.id === entry.id);
      if (!item) return null;
      const price = item.price;
      return {
        id: entry.id,
        quantity: entry.quantity,
        item,
        price,
        lineTotal: price === null ? null : price * entry.quantity,
      } satisfies ResolvedCartEntry;
    })
    .filter((entry): entry is ResolvedCartEntry => entry !== null);
}

/** Subtotal from numeric prices only — never from formatted strings. */
export function cartSubtotal(items: CartItem[]): number {
  return resolveCart(items).reduce(
    (total, entry) => total + (entry.lineTotal ?? 0),
    0,
  );
}

export function hasMissingPrices(items: CartItem[]): boolean {
  return resolveCart(items).some((entry) => entry.price === null);
}

/**
 * Numbered WhatsApp dish lines in the active language.
 * Items with no confirmed price show quantity only, marked for restaurant confirmation.
 */
export function whatsappDishLines(
  items: CartItem[],
  language: Language,
  priceTbdLabel: string,
): string[] {
  return resolveCart(items).map((entry, index) => {
    const name = entry.item.name[language];
    const position = `${index + 1}. ${name} × ${entry.quantity}`;
    if (entry.lineTotal === null) {
      return `${position} — ${priceTbdLabel}`;
    }
    return `${position} — ${formatPrice(entry.lineTotal)} ₸`;
  });
}
