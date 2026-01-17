import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SVG to PNG Converter - Free, Secure & High Quality",
  description: "Convert SVG to PNG or JPEG instantly in your browser. Free online tool with custom scaling, padding, and transparency support. Private & secure - no server uploads.",
  keywords: ["svg to png", "svg converter", "svg to jpg", "vector converter", "free svg tool", "browser-based converter"],
  authors: [{ name: "SVG Converter" }],
  openGraph: {
    title: "SVG to PNG Converter",
    description: "Convert SVG vectors to high-quality PNG or JPEG images instantly.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SVG to PNG Converter",
    description: "Convert SVG to PNG or JPEG instantly in your browser.",
  },
  metadataBase: new URL('https://svgconvert.app'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SVG to PNG Converter",
    "url": "https://svgconvert.app",
    "description": "Convert SVG to PNG or JPEG instantly in your browser. Free, secure, and client-side only.",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": "Convert SVG to PNG, Convert SVG to JPEG, Client-side processing, Privacy focused"
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
