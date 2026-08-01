import type { Metadata } from "next";
import { BookingPageClient } from "@/components/booking-form";

export const metadata: Metadata = {
  title: "Бронирование",
  description:
    "Отправьте запрос на бронирование стола в Tuesday Lounge Bar через WhatsApp.",
  alternates: { canonical: "/booking" },
};

export default function BookingPage() {
  return <BookingPageClient />;
}

