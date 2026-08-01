import type { Language } from "@/lib/i18n";

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
) {
  const comment = values.comment.trim();

  if (language === "kk") {
    return [
      "Сәлеметсіз бе! Tuesday Lounge Bar-да үстел брондағым келеді.",
      "",
      `Аты-жөні: ${values.name.trim()}`,
      `Телефон: ${values.phone.trim()}`,
      `Күні: ${values.date}`,
      `Уақыты: ${values.time}`,
      `Қонақтар саны: ${values.guests}`,
      `Қосымша ақпарат: ${comment || "Жоқ"}`,
      "",
      "Үстелдің бос екенін растаңызшы.",
    ].join("\n");
  }

  return [
    "Здравствуйте! Хочу забронировать стол в Tuesday Lounge Bar.",
    "",
    `Имя: ${values.name.trim()}`,
    `Телефон: ${values.phone.trim()}`,
    `Дата: ${values.date}`,
    `Время: ${values.time}`,
    `Количество гостей: ${values.guests}`,
    `Комментарий: ${comment || "Нет"}`,
    "",
    "Подтвердите, пожалуйста, доступность стола.",
  ].join("\n");
}

export function buildWhatsAppUrl(
  language: Language,
  values: BookingFormValues,
  whatsappNumber = "77057833130",
) {
  const message = buildBookingMessage(language, values);
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
