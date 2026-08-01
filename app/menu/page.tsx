import type { Metadata } from "next";
import { MenuPageClient } from "@/components/menu-page-client";

export const metadata: Metadata = {
  title: "Меню",
  description:
    "Популярные блюда Tuesday Lounge Bar. Полное меню и актуальные цены можно уточнить через Instagram или WhatsApp.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return <MenuPageClient />;
}

