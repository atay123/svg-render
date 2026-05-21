import BaseLayout from "@/components/BaseLayout";
import { locales, siteConfig } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
};

export async function generateStaticParams() {
  // Generate static layout pages for all locales except English (which is at the root "/")
  return locales
    .filter((loc) => loc !== "en")
    .map((locale) => ({
      locale,
    }));
}

type Params = Promise<{ locale: string }>;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { locale } = await params;
  return <BaseLayout locale={locale}>{children}</BaseLayout>;
}
