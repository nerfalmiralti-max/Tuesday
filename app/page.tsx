import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Lounge Bar в Актау",
  description:
    "Tuesday Lounge Bar в Актау: lounge café для еды, встреч и вечерней атмосферы. Бронирование столов через WhatsApp.",
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: business.name,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.ru,
    addressLocality: "Aktau",
    addressCountry: "KZ",
  },
  telephone: business.phone.international,
  sameAs: [business.instagram],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePage />
    </>
  );
}

