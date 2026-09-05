import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    title: `${site.name} | Mobile Wound Care in the DFW Area`,
    description:
      "Expert wound care delivered to you. Mobile visits and telehealth consultations across the Dallas-Fort Worth area.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | Mobile Wound Care in the DFW Area`,
    description:
      "Expert wound care delivered to you. Mobile visits and telehealth consultations across the Dallas-Fort Worth area.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1615" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
