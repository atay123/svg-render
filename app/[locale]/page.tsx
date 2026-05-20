import { HomePage } from "@/components/HomePage";
import { getPageMetadata, locales, type Locale } from "@/lib/site";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  // Generate static pages for all locales except English (which is at the root "/")
  return locales
    .filter((loc) => loc !== "en")
    .map((locale) => ({
      locale,
    }));
}

type Params = Promise<{ locale: string }>;

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    return {};
  }
  return getPageMetadata(locale as Locale);
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return <HomePage locale={locale as Locale} />;
}
