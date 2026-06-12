import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Script from "next/script";
import "./globals.css";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import GlobalGrain from "@/components/GlobalGrain";
import CustomCursor from "@/components/CustomCursor";
import ChopstickScroll from "@/components/ChopstickScroll";
import NavOverlay from "@/components/NavOverlay";

const BASE_URL = "https://heytigerdubai.com";
const DBG_RENDER_TS = Date.now();

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [{ url: "/heytiger-logo.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/heytiger-logo.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/heytiger-logo.png"],
  },
  title: {
    default: "HEY, TIGER — RAAAAAAR CULTURE · Motor City Dubai",
    template: "%s · Hey Tiger Dubai",
  },
  description:
    "Japanese bar & restaurant in Motor City Dubai. Brunch, ramen and coffee by day. Sake, cocktails and DJ sets by night. A Brass Monkey Hospitality venue.",
  keywords: [
    "Japanese restaurant Dubai", "bar Motor City Dubai",
    "ramen Dubai", "sake bar Dubai", "rooftop Dubai",
    "Hey Tiger", "Brass Monkey Hospitality", "RAAAAAAR CULTURE",
    "izakaya Dubai", "late night Dubai", "Motor City restaurant",
  ],
  authors: [
    { name: "Ghost Camel", url: "https://ghostcamel.com" },
  ],
  creator: "Ghost Camel",
  publisher: "Brass Monkey Hospitality",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: BASE_URL,
    siteName: "Hey Tiger Dubai",
    title: "HEY, TIGER — RAAAAAAR CULTURE · Motor City Dubai",
    description:
      "Three worlds. One address. Japanese bar & restaurant in Motor City Dubai — family brunch to after-hours rooftop.",
    images: [
      {
        url: "/herophoto.png",
        width: 1200,
        height: 630,
        alt: "Hey Tiger — Japanese Bar & Restaurant, Motor City Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HEY, TIGER — RAAAAAAR CULTURE",
    description: "Japanese bar & restaurant. Motor City Dubai. Family by day. After-hours chaos by night.",
    images: ["/herophoto.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "geo.region":   "AE-DU",
    "geo.placename": "Dubai Motor City",
  },
};

/* ── Restaurant structured data ─────────────────────────────────── */
const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  name: "Hey Tiger",
  alternateName: "おいトラ",
  url: BASE_URL,
  logo: `${BASE_URL}/heytiger-logo.png`,
  image: `${BASE_URL}/herophoto.png`,
  description:
    "Japanese bar and restaurant in Motor City Dubai. Ramen, robata, sushi, craft cocktails and 47 sake labels across three floors.",
  servesCuisine: ["Japanese", "Izakaya", "Fusion"],
  priceRange: "AED 65–420",
  telephone: "+971-4-000-0000",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Motor City Club House",
    addressLocality: "Dubai Motor City",
    addressRegion: "Dubai",
    addressCountry: "AE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.0417,
    longitude: 55.2450,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday","Wednesday","Thursday","Friday"], opens: "18:00", closes: "02:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "11:00", closes: "02:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "11:00", closes: "00:00" },
  ],
  hasMap: "https://www.google.com/maps/search/?api=1&query=Hey+Tiger+Motor+City+Dubai",
  menu: `${BASE_URL}/menu`,
  acceptsReservations: "True",
  sameAs: [
    "https://www.instagram.com/heytigerdubai",
    "https://www.tiktok.com/@heytigerdubai",
  ],
  founder: {
    "@type": "Organization",
    name: "Brass Monkey Hospitality",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // #region debug-point A:debug-server-config
  const dbgEnvPath = path.join(process.cwd(), ".dbg", "dev-slow-unstable.env");
  let dbgServerUrl = "";
  let dbgSessionId = "";
  try {
    const dbgEnv = fs.readFileSync(dbgEnvPath, "utf8");
    dbgServerUrl = dbgEnv.match(/^DEBUG_SERVER_URL=(.+)$/m)?.[1]?.trim() ?? "";
    dbgSessionId = dbgEnv.match(/^DEBUG_SESSION_ID=(.+)$/m)?.[1]?.trim() ?? "";
  } catch {}

  try {
    if (dbgServerUrl && dbgSessionId) {
      void fetch(dbgServerUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sessionId: dbgSessionId,
          runId: "pre",
          hypothesisId: "A",
          location: "layout.tsx:ssr",
          msg: "[DEBUG] ssr render",
          data: {},
          ts: DBG_RENDER_TS,
        }),
      }).catch(() => {});
    }
  } catch {}
  // #endregion

  return (
    <html lang="en" className="h-full">
      <head>
        {process.env.NODE_ENV === "production" && (
          <Script
            id="ht-jsonld"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
          />
        )}
      </head>
      <body className="min-h-full antialiased">
        <Loader />
        <CustomCursor />
        <SmoothScroll />
        {children}
        <GlobalGrain />
        <ChopstickScroll />
        <NavOverlay />
      </body>
    </html>
  );
}
