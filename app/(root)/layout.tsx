import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site";
import BaseLayout from "@/components/BaseLayout";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "design tools",
  alternates: {
    languages: {
      en: "/",
      zh: "/zh",
      "zh-CN": "/zh",
      de: "/de",
      es: "/es",
      fr: "/fr",
      id: "/id",
      it: "/it",
      ja: "/ja",
      ko: "/ko",
      nl: "/nl",
      pl: "/pl",
      pt: "/pt",
      ru: "/ru",
      tr: "/tr",
      uk: "/uk",
      vi: "/vi",
    },
  },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f7fb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BaseLayout locale="en">{children}</BaseLayout>;
}
