import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBookingMessage,
  buildWhatsAppUrl,
  validateBooking,
} from "../lib/booking.ts";

const validValues = {
  name: "Алина",
  phone: "+7 701 234 56 78",
  date: "2026-08-12",
  time: "20:30",
  guests: "4",
  comment: "",
};

test("validates empty fields and focuses name first", () => {
  const result = validateBooking(
    { name: "", phone: "", date: "", time: "", guests: "0", comment: "" },
    "2026-08-01",
  );

  assert.deepEqual(result.errors, {
    name: "name",
    phone: "phone",
    date: "date",
    time: "time",
    guests: "guests",
  });
  assert.equal(result.firstInvalidField, "name");
});

test("rejects an invalid phone and a past date", () => {
  const result = validateBooking(
    { ...validValues, phone: "123", date: "2026-07-31" },
    "2026-08-01",
  );

  assert.equal(result.errors.phone, "phone");
  assert.equal(result.errors.date, "date");
  assert.equal(result.firstInvalidField, "phone");
});

test("builds the exact Russian message with an empty-comment fallback", () => {
  const message = buildBookingMessage("ru", validValues);

  assert.equal(
    message,
    [
      "Здравствуйте! Хочу забронировать стол в Tuesday Lounge Bar.",
      "",
      "Имя: Алина",
      "Телефон: +7 701 234 56 78",
      "Дата: 2026-08-12",
      "Время: 20:30",
      "Количество гостей: 4",
      "Комментарий: Нет",
      "",
      "Подтвердите, пожалуйста, доступность стола.",
    ].join("\n"),
  );
});

test("preserves Kazakh glyphs, comments, and line breaks in the WhatsApp URL", () => {
  const values = {
    ...validValues,
    name: "Әлия Ғалымқызы",
    comment: "Терезе жанындағы үстел болса жақсы",
  };
  const message = buildBookingMessage("kk", values);
  const url = buildWhatsAppUrl("kk", values);

  assert.match(message, /Сәлеметсіз бе!/);
  assert.match(message, /Аты-жөні: Әлия Ғалымқызы/);
  assert.match(message, /Қосымша ақпарат: Терезе жанындағы үстел болса жақсы/);
  assert.match(message, /Үстелдің бос екенін растаңызшы\./);
  assert.equal(new URL(url).origin, "https://wa.me");
  assert.equal(new URL(url).pathname, "/77057833130");
  assert.equal(new URL(url).searchParams.get("text"), message);
  assert.equal(decodeURIComponent(url.split("?text=")[1]), message);
  assert.match(buildBookingMessage("kk", validValues), /Қосымша ақпарат: Жоқ/);
});
