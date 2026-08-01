import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { LanguageProvider } from "@/components/language-provider";
import { SiteShell } from "@/components/site-shell";
import { siteUrl } from "@/lib/business";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tuesday Lounge Bar — Актау",
    template: "%s | Tuesday Lounge Bar",
  },
  description:
    "Tuesday Lounge Bar — lounge café в Актау. 11-й микрорайон, здание 56. Ежедневно 12:00—02:00.",
  applicationName: "Tuesday Lounge Bar",
  keywords: ["Tuesday Lounge Bar", "Актау", "lounge cafe", "бронирование стола"],
  openGraph: {
    type: "website",
    locale: "ru_KZ",
    alternateLocale: "kk_KZ",
    siteName: "Tuesday Lounge Bar",
    title: "Tuesday Lounge Bar — Актау",
    description: "Еда, разговоры и мягкий свет. Ежедневно с 12:00 до 02:00.",
    url: "/",
    images: [
      {
        url: "/og.png",
        alt: "Tuesday Lounge Bar — Aktau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tuesday Lounge Bar — Актау",
    description: "Еда, разговоры и мягкий свет. Ежедневно с 12:00 до 02:00.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111213",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} ${interTight.variable}`}>
        <LanguageProvider>
          <SiteShell>{children}</SiteShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
