import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { LanguageProvider } from "@/components/language-provider";
import { SiteShell } from "@/components/site-shell";
import { siteUrl } from "@/lib/business";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
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
    <html lang="ru" className={onest.variable} suppressHydrationWarning>
      <body>
        {/*
          Pre-paint, session-gated flag for the homepage steak entrance. Runs before
          hydration so the CSS reveal starts with no flash; failure leaves the image
          visible (it never hides the steak). Only affects "/".
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(location.pathname==='/'){var k='tuesday-steak-intro-seen-v4';var s=sessionStorage.getItem(k);document.documentElement.setAttribute('data-steak-intro',s?'short':'full');if(!s){sessionStorage.setItem(k,'1');}}}catch(e){}})();",
          }}
        />
        <LanguageProvider>
          <CartProvider>
            <SiteShell>{children}</SiteShell>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
