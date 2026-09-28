import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Loader from "@/components/Loader";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { restaurantInfo } from "@/data/restaurant";

const BASE_URL = "https://heytigerdubai.com";

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
        url: "/og.jpg",
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
    images: ["/og.jpg"],
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
  image: `${BASE_URL}/og.jpg`,
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
      </body>
    </html>
  );
}
