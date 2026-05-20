import Link from "next/link";
import { SvgConverter } from "@/components/SvgConverter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getHomeContent, type Locale, siteConfig } from "@/lib/site";

export function HomePage({ locale }: { locale: Locale }) {
  const content = getHomeContent(locale);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    applicationCategory: "DesignApplication",
    operatingSystem: "Any",
    description: content.metaDescription,
    url: `${siteConfig.url}${content.path === "/" ? "" : content.path}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "SVG to PNG conversion",
      "SVG to JPG conversion",
      "SVG to WebP conversion",
      "100% browser-based processing",
      "Batch queue uploads",
      "Single-file download and delete actions",
      "Live preview",
      "ZIP download",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: locale === "zh" ? "如何将 SVG 转为 PNG" : "How to convert SVG to PNG",
    description:
      locale === "zh"
        ? "选择 SVG 文件或粘贴 SVG 代码，在浏览器中完成转换并下载结果。"
        : "Select SVG files or paste SVG code, convert them in the browser, and save the results.",
    step: content.howToSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <div lang={content.lang} className="min-h-screen bg-[#f5f7fb] text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link href={locale === "en" ? "/" : `/${locale}`} className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="text-[#eb7d66]">svg</span>
            <span className="text-slate-800">convert</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSelector currentLocale={locale} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6">
        <section className="space-y-6 pt-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 sm:text-5xl">
            {content.title}
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600">
            {content.intro}
          </p>
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-xs backdrop-blur-md">
            <ul className="space-y-4 text-left text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              {content.guideBullets.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600 sm:h-6 sm:w-6 sm:text-sm">
                    {idx + 1}
                  </span>
                  <span className="flex-1 pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="converter" className="scroll-mt-24">
          <SvgConverter locale={locale} />
        </section>

        <section className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.guideTitle}</h2>
            <p className="text-lg leading-8 text-slate-700">{content.guideIntro}</p>
            <p className="text-lg leading-8 text-slate-700">
              <strong>{content.browserBasedTitle}</strong> {content.browserBasedText}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.whatIsSvgTitle}</h2>
            {content.whatIsSvgParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.whatIsPngTitle}</h2>
            {content.whatIsPngParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-8 text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.comparisonTitle}</h2>
            <p className="text-lg leading-8 text-slate-700">{content.comparisonIntro}</p>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <table className="min-w-full text-left text-base">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    {content.comparisonColumns.map((column) => (
                      <th key={column} className="px-4 py-3 font-semibold">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.comparisonRows.map((row) => (
                    <tr key={row[0]} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium text-slate-700">{row[0]}</td>
                      <td className="px-4 py-3 text-slate-600">{row[1]}</td>
                      <td className="px-4 py-3 text-slate-600">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.convertWhenTitle}</h2>
            <ul className="space-y-3 text-lg leading-8 text-slate-700">
              {content.convertWhenItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-lg leading-8 text-slate-700">{content.convertWhenNote}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.howToTitle}</h2>
            <ol className="space-y-3 text-lg leading-8 text-slate-700">
              {content.howToSteps.map((step, index) => (
                <li key={step.title}>
                  <strong>
                    {index + 1}. {step.title}:
                  </strong>{" "}
                  {step.description}
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.privacyTitle}</h2>
            <p className="text-lg leading-8 text-slate-700">{content.privacyText}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-700">{content.faqTitle}</h2>
            <div className="space-y-3">
              {content.faqItems.map((item, index) => (
                <details
                  key={item.question}
                  open={index === 0}
                  className="rounded-lg border border-slate-200 bg-white px-5 py-4"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-slate-700">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-base leading-8 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {content.footerLeft}
          </p>
          <p>{content.footerRight}</p>
        </div>
      </footer>
    </div>
  );
}
