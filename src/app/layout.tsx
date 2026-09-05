import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

/* Matches the serif in the client wordmark, used only for the logo lockup. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-brand-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Mobile Wound Care in the DFW Area`,
    template: `%s | ${site.name}`,
  },
  description:
    "Mobile wound care and telehealth consultations across the Dallas-Fort Worth area, led by a board-certified family nurse practitioner.",
  applicationName: site.name,
  authors: [{ name: site.clinician }],
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/Logo/mark.png", type: "image/png" }],
    shortcut: ["/Logo/mark.png"],
    apple: [{ url: "/Logo/mark.png" }],
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    title: `${site.name} | Mobile Wound Care in the DFW Area`,
    description:
      "Expert wound care delivered to you. Mobile visits and telehealth consultations across the Dallas-Fort Worth area.",
    images: [{ url: "/Logo/logo.png", width: 500, height: 500, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Mobile Wound Care in the DFW Area`,
    description:
      "Expert wound care delivered to you. Mobile visits and telehealth consultations across the Dallas-Fort Worth area.",
    images: ["/Logo/logo.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f151c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${cormorant.variable}`}>
      {/*
        suppressHydrationWarning is deliberate and scoped to <body> only.
        Extensions such as Grammarly inject attributes (data-gr-ext-installed,
        data-new-gr-c-s-check-loaded) into <body> before React hydrates, which
        React otherwise reports as a mismatch. The flag is shallow: it silences
        attribute differences on this element alone and still surfaces genuine
        mismatches anywhere inside the tree.
      */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
