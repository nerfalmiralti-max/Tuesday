import assert from "node:assert/strict";
import test from "node:test";

import {
  cartCount,
  cartReducer,
  cartSubtotal,
  initialCartState,
  parseStoredCart,
  resolveCart,
  serializeCart,
  whatsappDishLines,
  MAX_QUANTITY,
} from "@/lib/cart.ts";
import { buildBookingMessage, buildWhatsAppUrl } from "@/lib/booking.ts";
import { menuItems } from "@/lib/menu.ts";

// Pick a couple of real menu ids with known numeric prices.
const priced = menuItems.filter((i) => typeof i.price === "number" && i.price > 0);
const A = priced[0].id;
const B = priced[1].id;
const priceA = priced[0].price;
const priceB = priced[1].price;

const reduce = (state, ...actions) =>
  actions.reduce((acc, action) => cartReducer(acc, action), state);

test("adds a new item with quantity 1", () => {
  const state = reduce(initialCartState, { type: "add", id: A });
  assert.deepEqual(state.items, [{ id: A, quantity: 1 }]);
});

test("adding the same item again increases quantity (no duplicates)", () => {
  const state = reduce(initialCartState, { type: "add", id: A }, { type: "add", id: A });
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].quantity, 2);
});

test("increment and decrement adjust quantity", () => {
  const state = reduce(
    initialCartState,
    { type: "add", id: A },
    { type: "increment", id: A },
    { type: "decrement", id: A },
  );
  assert.equal(state.items[0].quantity, 1);
});

test("decrement from 1 removes the item", () => {
  const state = reduce(initialCartState, { type: "add", id: A }, { type: "decrement", id: A });
  assert.deepEqual(state.items, []);
});

test("explicit remove and clear", () => {
  const filled = reduce(initialCartState, { type: "add", id: A }, { type: "add", id: B });
  assert.deepEqual(reduce(filled, { type: "remove", id: A }).items, [{ id: B, quantity: 1 }]);
  assert.deepEqual(reduce(filled, { type: "clear" }).items, []);
});

test("quantity is capped at the maximum", () => {
  let state = reduce(initialCartState, { type: "add", id: A });
  for (let i = 0; i < 40; i += 1) state = cartReducer(state, { type: "increment", id: A });
  assert.equal(state.items[0].quantity, MAX_QUANTITY);
  // add also respects the cap
  let viaAdd = reduce(initialCartState, { type: "add", id: A });
  for (let i = 0; i < 40; i += 1) viaAdd = cartReducer(viaAdd, { type: "add", id: A });
  assert.equal(viaAdd.items[0].quantity, MAX_QUANTITY);
});

test("count and subtotal use numeric prices only", () => {
  const items = [
    { id: A, quantity: 2 },
    { id: B, quantity: 1 },
  ];
  assert.equal(cartCount(items), 3);
  assert.equal(cartSubtotal(items), priceA * 2 + priceB);
});

test("items with unknown price are ignored in subtotal", () => {
  const noPrice = menuItems.find((i) => i.price === null);
  const items = [{ id: A, quantity: 1 }];
  if (noPrice) items.push({ id: noPrice.id, quantity: 3 });
  assert.equal(cartSubtotal(items), priceA);
  assert.equal(cartCount(items), noPrice ? 4 : 1);
});

test("restores valid stored state and round-trips", () => {
  const items = [{ id: A, quantity: 2 }];
  const restored = parseStoredCart(serializeCart(items));
  assert.deepEqual(restored, items);
});

test("recovers from corrupted / outdated / unknown storage", () => {
  assert.deepEqual(parseStoredCart("not json"), []);
  assert.deepEqual(parseStoredCart(JSON.stringify({ version: 999, items: [] })), []);
  assert.deepEqual(parseStoredCart(JSON.stringify({ version: 1, items: "nope" })), []);
  assert.deepEqual(
    parseStoredCart(JSON.stringify({ version: 1, items: [{ id: "does-not-exist", quantity: 2 }] })),
    [],
  );
  // out-of-range quantity is clamped
  const clamped = parseStoredCart(JSON.stringify({ version: 1, items: [{ id: A, quantity: 999 }] }));
  assert.equal(clamped[0].quantity, MAX_QUANTITY);
});

test("resolveCart drops items no longer on the menu", () => {
  const entries = resolveCart([{ id: A, quantity: 1 }, { id: "ghost", quantity: 1 }]);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].id, A);
});

test("Russian WhatsApp message includes booking fields and dishes", () => {
  const values = {
    name: "Али",
    phone: "+7 700 000 00 00",
    date: "2026-08-10",
    time: "20:00",
    guests: "2",
    comment: "",
  };
  const lines = whatsappDishLines([{ id: A, quantity: 2 }], "ru", "цена уточняется");
  const message = buildBookingMessage("ru", values, { lines, subtotal: priceA * 2 });
  assert.match(message, /Tuesday Lounge Bar/);
  assert.match(message, /Имя: Али/);
  assert.match(message, /Предварительно выбраны блюда:/);
  assert.match(message, /Предварительная сумма меню:/);
  assert.match(message, /подтверждает ресторан\./);
  assert.doesNotMatch(message, /undefined/);
});

test("Kazakh WhatsApp message uses Kazakh labels", () => {
  const values = {
    name: "Аружан",
    phone: "+7 700 111 22 33",
    date: "2026-08-11",
    time: "19:30",
    guests: "3",
    comment: "терезе жанында",
  };
  const lines = whatsappDishLines([{ id: B, quantity: 1 }], "kk", "бағасы нақтыланады");
  const message = buildBookingMessage("kk", values, { lines, subtotal: priceB });
  assert.match(message, /үстел брондағым келеді/);
  assert.match(message, /Алдын ала таңдалған тағамдар:/);
  assert.match(message, /мейрамхана растайды\./);
  assert.doesNotMatch(message, /undefined/);
});

test("empty-cart booking message omits the dish section", () => {
  const values = {
    name: "Гость",
    phone: "+7 700 222 33 44",
    date: "2026-08-12",
    time: "21:00",
    guests: "4",
    comment: "",
  };
  const message = buildBookingMessage("ru", values);
  assert.doesNotMatch(message, /Предварительно выбраны блюда/);
  assert.match(message, /Подтвердите/);
});

test("unknown-price dish shows label, not an invented number", () => {
  const lines = whatsappDishLines([{ id: A, quantity: 1 }], "ru", "цена уточняется");
  assert.equal(lines.length, 1);
  assert.match(lines[0], new RegExp("\\d"));
});

test("WhatsApp url is correctly single-encoded", () => {
  const values = {
    name: "Тест",
    phone: "+7 700 000 00 00",
    date: "2026-08-10",
    time: "20:00",
    guests: "2",
    comment: "",
  };
  const url = buildWhatsAppUrl("ru", values, "77057833130", {
    lines: whatsappDishLines([{ id: A, quantity: 1 }], "ru", "цена уточняется"),
    subtotal: priceA,
  });
  assert.match(url, /^https:\/\/wa\.me\/77057833130\?text=/);
  const text = decodeURIComponent(url.split("text=")[1]);
  // one decode restores newlines — proves no double-encoding
  assert.match(text, /\n/);
  assert.doesNotMatch(url, /%25[0-9A-Fa-f]{2}/);
});
