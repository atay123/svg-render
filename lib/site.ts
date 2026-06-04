import type { Metadata } from "next";
import { en } from "./locales/en";
import { zh } from "./locales/zh";
import { de } from "./locales/de";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { id } from "./locales/id";
import { it } from "./locales/it";
import { ja } from "./locales/ja";
import { ko } from "./locales/ko";
import { nl } from "./locales/nl";
import { pl } from "./locales/pl";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";
import { tr } from "./locales/tr";
import { uk } from "./locales/uk";
import { vi } from "./locales/vi";
import type { LocaleData } from "./types";

const DEFAULT_SITE_URL = "https://www.svgconvert.app";
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || DEFAULT_SITE_URL
);

export const siteConfig = {
  name: "SVGConvert",
  url: siteUrl,
  socialImage: "/og-image.png",
  shortDescription:
    "Free browser-based SVG converter with private client-side processing and batch queue support.",
  keywords: [
    "svg to png",
    "svg converter",
    "svg to jpg",
    "svg to webp",
    "vector converter",
    "browser based svg converter",
    "client side svg conversion",
    "free svg tool",
    "convert svg online",
    "svg export tool",
  ],
};

export const locales = [
  "en",
  "zh",
  "de",
  "es",
  "fr",
  "id",
  "it",
  "ja",
  "ko",
  "nl",
  "pl",
  "pt",
  "ru",
  "tr",
  "uk",
  "vi",
] as const;

export type Locale = (typeof locales)[number];

export const alternateLanguages = {
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
  "x-default": "/",
};

export const localeDataMap: Record<Locale, LocaleData> = {
  en,
  zh,
  de,
  es,
  fr,
  id,
  it,
  ja,
  ko,
  nl,
  pl,
  pt,
  ru,
  tr,
  uk,
  vi,
};

export function getHomeContent(locale: Locale) {
  return (localeDataMap[locale] || localeDataMap["en"]).homeContent;
}

export function getConverterText(locale: Locale) {
  return (localeDataMap[locale] || localeDataMap["en"]).converterText;
}

export function getPageMetadata(locale: Locale): Metadata {
  const content = getHomeContent(locale);
  return {
    metadataBase: new URL(siteConfig.url),
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: content.path,
      languages: alternateLanguages,
    },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}${content.path === "/" ? "" : content.path}`,
      siteName: siteConfig.name,
      title: content.metaTitle,
      description: content.metaDescription,
      locale: content.openGraphLocale,
      images: [
        {
          url: siteConfig.socialImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} social preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.metaTitle,
      description: content.metaDescription,
      images: [siteConfig.socialImage],
    },
  };
}
