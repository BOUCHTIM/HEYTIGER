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
import { restaurantInfo } from "@/data/restaurant";

const BASE_URL = "https://heytigerdubai.com";
const DBG_RENDER_TS = Date.now();

// Map ISO days to our opening hours days
const DAY_MAP: Record<string, string> = {
  'Monday': 'Monday',
  'Tuesday': 'Tuesday',
  'Wednesday': 'Wednesday',
  'Thursday': 'Thursday',
  'Friday': 'Friday',
  'Saturday': 'Saturday',
  'Sunday': 'Sunday',
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [{ url: "/heytiger-logo.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/heytiger-logo.png", type: "image/png", sizes: "180x180" }],
    shortcut: ["/heytiger-logo.png"],
  },
  title: {
    default: `HEY, TIGER — ${restaurantInfo.tagline} · ${restaurantInfo.neighborhood} ${restaurantInfo.city}`,
    template: "%s · Hey Tiger Dubai",
  },
  description: restaurantInfo.description,
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
    title: `HEY, TIGER — ${restaurantInfo.tagline} · ${restaurantInfo.neighborhood} ${restaurantInfo.city}`,
    description: restaurantInfo.description,
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
    title: `HEY, TIGER — ${restaurantInfo.tagline}`,
    description: restaurantInfo.description,
    images: ["/herophoto.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "geo.region":   "AE-DU",
    "geo.placename": `${restaurantInfo.neighborhood} ${restaurantInfo.city}`,
  },
};

/* ── Restaurant structured data ─────────────────────────────────── */
const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "BarOrPub",
  name: restaurantInfo.name,
  alternateName: "おいトラ",
  url: BASE_URL,
  logo: `${BASE_URL}/heytiger-logo.png`,
  image: `${BASE_URL}/herophoto.png`,
  description: restaurantInfo.description,
  servesCuisine: ["Japanese", "Izakaya", "Fusion"],
  priceRange: "AED 28–160",
  telephone: restaurantInfo.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: restaurantInfo.address,
    addressLocality: restaurantInfo.neighborhood,
    addressRegion: restaurantInfo.city,
    addressCountry: restaurantInfo.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: restaurantInfo.latitude,
    longitude: restaurantInfo.longitude,
  },
  openingHoursSpecification: restaurantInfo.openingHours
    .filter(h => h.opens !== 'CLOSED')
    .map(h => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.opens,
      closes: h.closes,
    })),
  hasMap: restaurantInfo.googleMapsUrl,
  menu: `${BASE_URL}/menu`,
  acceptsReservations: "True",
  sameAs: Object.values(restaurantInfo.socialLinks).filter(Boolean) as string[],
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
