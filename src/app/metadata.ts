import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: '%s | Sparkling World Events',
    default: 'Sparkling World Events | Just dream it, we’ll deliver!'
  },
  description: "Transform your special moments into extraordinary experiences with Nigeria's leading event planning service. From intimate gatherings to grand celebrations, we bring your vision to life with meticulous attention to detail and unparalleled creativity.",
  keywords: "event planning, luxury events, wedding planning, corporate events, Nigerian events, event management, party planning, event coordination, Lagos events, celebration planning, event design, wedding coordination, corporate event planning, social events, event decoration",
  authors: [{ name: "Sparkling World Events" }],
  creator: "Sparkling World Events",
  publisher: "Sparkling World Events",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  category: 'Event Planning',
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://sparklingworldevents.com",
    title: "Sparkling World Events | Just dream it, we’ll deliver!",
    description: "Transform your special moments into extraordinary experiences with Nigeria's leading event planning service. Expert event planning for weddings, corporate events, and social gatherings.",
    siteName: "Sparkling World Events",
    images: [
      {
        url: "https://sparklingworldevents.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sparkling World Events - Premier Event Planning Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparkling World Events | Premier Event Planning",
    description: "Transform your special moments into extraordinary experiences. Expert event planning for weddings, corporate events, and social gatherings in Nigeria.",
    images: ["https://sparklingworldevents.com/images/twitter-image.jpg"],
    creator: "@sparklingworldng",
    site: "@sparklingworldng",
  },
  themeColor: "#1a1a1a",
  verification: {
    google: "your-google-site-verification",
    other: {
      me: ["@sparklingworldng"],
    },
  },
  alternates: {
    canonical: "https://sparklingworldevents.com",
  },
};