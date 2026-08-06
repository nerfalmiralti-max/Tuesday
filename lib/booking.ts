import type { Language } from "@/lib/i18n";
import { formatPrice } from "@/lib/menu";

export type BookingCart = {
  /** Pre-formatted, numbered, localized dish lines. Empty when nothing selected. */
  lines: string[];
  /** Numeric subtotal from confirmed prices only; 0 when none are known. */
  subtotal: number;
};

export type BookingField =
  | "name"
  | "phone"
  | "date"
  | "time"
  | "guests";

export type BookingFormValues = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  comment: string;
};

export type BookingValidationError =
  | "name"
  | "phone"
  | "date"
  | "time"
  | "guests";

export type BookingValidationResult = {
  errors: Partial<Record<BookingField, BookingValidationError>>;
  firstInvalidField: BookingField | null;
};

export const bookingFieldOrder: BookingField[] = [
  "name",
  "phone",
  "date",
  "time",
  "guests",
];

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateBooking(
  values: BookingFormValues,
  today = localDateString(),
): BookingValidationResult {
  const errors: BookingValidationResult["errors"] = {};
  const phoneDigits = values.phone.replace(/\D/g, "");
  const guestCount = Number(values.guests);

  if (!values.name.trim()) errors.name = "name";
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "phone";
  }
  if (!values.date || values.date < today) errors.date = "date";
  if (!values.time) errors.time = "time";
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    errors.guests = "guests";
  }

  return {
    errors,
    firstInvalidField:
      bookingFieldOrder.find((field) => Boolean(errors[field])) ?? null,
  };
}

export function buildBookingMessage(
  language: Language,
  values: BookingFormValues,
  cart?: BookingCart,
) {
  const comment = values.comment.trim();
  const hasDishes = Boolean(cart && cart.lines.length > 0);

  if (language === "kk") {
    const lines = [
      "Сәлеметсіз бе! Tuesday Lounge Bar-да үстел брондағым келеді.",
      "",
      `Аты-жөні: ${values.name.trim()}`,
      `Телефон: ${values.phone.trim()}`,
      `Күні: ${values.date}`,
      `Уақыты: ${values.time}`,
      `Қонақтар саны: ${values.guests}`,
      `Қосымша ақпарат: ${comment || "Жоқ"}`,
    ];
    if (hasDishes && cart) {
      lines.push("", "Алдын ала таңдалған тағамдар:", ...cart.lines);
      if (cart.subtotal > 0) {
        lines.push(`Мәзірдің алдын ала сомасы: ${formatPrice(cart.subtotal)} ₸`);
      }
      lines.push("", "Тағамдардың бар-жоғын және соңғы соманы мейрамхана растайды.");
    }
    lines.push("", "Үстелдің бос екенін растаңызшы.");
    return lines.join("\n");
  }

  const lines = [
    "Здравствуйте! Хочу забронировать стол в Tuesday Lounge Bar.",
    "",
    `Имя: ${values.name.trim()}`,
    `Телефон: ${values.phone.trim()}`,
    `Дата: ${values.date}`,
    `Время: ${values.time}`,
    `Количество гостей: ${values.guests}`,
    `Комментарий: ${comment || "Нет"}`,
  ];
  if (hasDishes && cart) {
    lines.push("", "Предварительно выбраны блюда:", ...cart.lines);
    if (cart.subtotal > 0) {
      lines.push(`Предварительная сумма меню: ${formatPrice(cart.subtotal)} ₸`);
    }
    lines.push("", "Наличие блюд и итоговую сумму подтверждает ресторан.");
  }
  lines.push("", "Подтвердите, пожалуйста, доступность стола.");
  return lines.join("\n");
}

export function buildWhatsAppUrl(
  language: Language,
  values: BookingFormValues,
  whatsappNumber = "77057833130",
  cart?: BookingCart,
) {
  const message = buildBookingMessage(language, values, cart);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
