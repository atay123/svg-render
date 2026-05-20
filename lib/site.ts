import type { Metadata } from "next";

export const siteConfig = {
  name: "SVGConvert",
  url: "https://www.svgconvert.app",
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

export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

type FaqItem = {
  question: string;
  answer: string;
};

type HowToStep = {
  title: string;
  description: string;
};

type HomeContent = {
  lang: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  openGraphLocale: string;
  toolBadge: string;
  title: string;
  intro: string;
  guideBullets: string[];
  nav: {
    english: string;
    chinese: string;
  };
  guideTitle: string;
  guideIntro: string;
  browserBasedTitle: string;
  browserBasedText: string;
  whatIsSvgTitle: string;
  whatIsSvgParagraphs: string[];
  whatIsPngTitle: string;
  whatIsPngParagraphs: string[];
  comparisonTitle: string;
  comparisonIntro: string;
  comparisonColumns: [string, string, string];
  comparisonRows: [string, string, string][];
  convertWhenTitle: string;
  convertWhenItems: string[];
  convertWhenNote: string;
  howToTitle: string;
  howToSteps: HowToStep[];
  privacyTitle: string;
  privacyText: string;
  faqTitle: string;
  faqItems: FaqItem[];
  footerLeft: string;
  footerRight: string;
};

const homeContent: Record<Locale, HomeContent> = {
  en: {
    lang: "en",
    path: "/",
    metaTitle: "SVG to PNG Converter | Free Browser-Based SVG Tool",
    metaDescription:
      "Convert SVG to PNG, JPG, or WebP directly in your browser. Free SVG converter with drag and drop uploads, batch queue, single-file actions, live preview, and private client-side processing.",
    openGraphLocale: "en_US",
    toolBadge: "Free browser-based tool",
    title: "Convert SVG to PNG, JPG, or WebP",
    intro:
      "Convert SVG vector graphics to raster images with high quality. Perfect for web, social media, product uploads, and print. All conversion happens in your browser so your files never leave your device.",
    guideBullets: [
      "Click SELECT FILES to choose one or more .svg files, or drag files into the drop area.",
      "Use CONVERT to process your files, then SAVE one by one or SAVE ALL as a ZIP archive.",
    ],
    nav: {
      english: "English",
      chinese: "中文",
    },
    guideTitle: "SVG to PNG Conversion Guide",
    guideIntro:
      "Convert vector SVG graphics to raster PNG, JPG, or WebP images quickly and easily. This is useful when you need fixed-resolution exports for websites, social platforms, email builders, or software that does not support SVG well.",
    browserBasedTitle: "100% Browser-Based:",
    browserBasedText:
      "All conversion happens in your browser. Your files never leave your device, which keeps the workflow fast and private.",
    whatIsSvgTitle: "What Is SVG?",
    whatIsSvgParagraphs: [
      "Scalable Vector Graphics (SVG) is an XML-based vector image format. Unlike raster images made of pixels, SVG files are built from paths, shapes, and mathematical instructions. That means they can scale up or down without losing sharpness.",
      "SVG works especially well for logos, icons, interface graphics, diagrams, and illustrations. Because it is text-based, it can also be edited with code editors or design tools.",
    ],
    whatIsPngTitle: "What Is PNG?",
    whatIsPngParagraphs: [
      "PNG is a raster image format known for sharp quality and lossless compression. Unlike SVG, PNG has a fixed resolution, but it supports transparency and is accepted by nearly every browser, app, and upload flow.",
      "JPG is useful when you want a smaller file and do not need transparency. WebP is a modern web-friendly format that can balance size and quality.",
    ],
    comparisonTitle: "SVG vs PNG: Key Differences",
    comparisonIntro:
      "SVG is best when you want flexible, editable, scalable graphics. PNG is better when you need predictable pixel output and universal compatibility.",
    comparisonColumns: ["Feature", "SVG", "PNG"],
    comparisonRows: [
      ["Image type", "Vector (math-based)", "Raster (pixel-based)"],
      ["Scaling", "Infinite without quality loss", "Fixed resolution"],
      ["Transparency", "Yes", "Yes"],
      ["Best for", "Icons, logos, illustrations", "Compatibility, uploads, fixed output"],
      ["Editability", "Easy to edit paths and shapes", "Pixel-level editing only"],
    ],
    convertWhenTitle: "When to Convert SVG to PNG",
    convertWhenItems: [
      "Social media platforms often do not accept SVG uploads.",
      "Email clients and older software can render SVG inconsistently.",
      "Some CMS and marketplace flows require fixed-resolution raster files.",
      "PNG works better when you need predictable output size or transparent assets.",
    ],
    convertWhenNote:
      "Keep the original SVG whenever possible. It remains the best source file for future exports at different sizes.",
    howToTitle: "How to Convert",
    howToSteps: [
      {
        title: "Import your SVG",
        description:
          "Drag and drop one or more SVG files, or paste SVG code directly into the editor.",
      },
      {
        title: "Adjust the export",
        description:
          "Choose PNG, JPG, or WebP and adjust width, height, padding, background, or transparency if needed.",
      },
      {
        title: "Download or batch export",
        description:
          "Preview the result, save a single file, delete individual files, or download all converted files in a ZIP archive.",
      },
    ],
    privacyTitle: "Privacy & Security",
    privacyText:
      "Your files are completely safe. All conversion happens locally in your browser using JavaScript. There are no server uploads, no registration walls, and no waiting for a remote processor.",
    faqTitle: "FAQ",
    faqItems: [
      {
        question: "Is this SVG converter really private?",
        answer:
          "Yes. Every conversion runs in your browser using client-side canvas APIs. Your SVG files are not uploaded to our server, stored remotely, or sent to a third-party processor.",
      },
      {
        question: "Can I convert SVG to transparent PNG or WebP?",
        answer:
          "Yes. PNG and WebP both support transparency. Keep the transparent background option enabled and export in either of those formats. JPG does not support transparency.",
      },
      {
        question: "Why would I convert SVG to PNG or JPG?",
        answer:
          "You should convert SVG when a platform needs raster images, such as social media uploads, email builders, marketplace listings, presentation tools, or legacy software that does not render SVG reliably.",
      },
      {
        question: "Does the tool support batch conversion?",
        answer:
          "Yes. You can upload multiple SVG files, keep appending more files to the queue, convert them together, and download them as a ZIP archive.",
      },
      {
        question: "Can I save or delete a single file from the queue?",
        answer:
          "Yes. Each queued file can be selected, downloaded individually, or removed without clearing the rest of the queue.",
      },
      {
        question: "Do I need to register or pay?",
        answer:
          "No. SVGConvert is designed as a free, no-signup SVG converter. Open the page, convert your file, and download the result immediately.",
      },
    ],
    footerLeft:
      "Built with Next.js and browser-based canvas rendering.",
    footerRight: "Your files never leave your device.",
  },
  zh: {
    lang: "zh-CN",
    path: "/zh",
    metaTitle: "SVG 转 PNG 转换器 | 免费浏览器版 SVG 工具",
    metaDescription:
      "直接在浏览器中把 SVG 转成 PNG、JPG 或 WebP。支持拖拽上传、批量队列、单文件保存与删除、实时预览，并且全程本地处理，不上传服务器。",
    openGraphLocale: "zh_CN",
    toolBadge: "免费浏览器工具",
    title: "SVG 转 PNG、JPG 或 WebP",
    intro:
      "将 SVG 矢量图高质量转换为位图图像，适合网页、社交媒体、商品上传和打印。所有转换都在你的浏览器中完成，文件不会离开你的设备。",
    guideBullets: [
      "点击“选择文件”选择一个或多个 .svg 文件，或直接拖拽到上传区域。",
      "点击“转换”处理文件，然后可以逐个保存，或点击“全部保存”一次性下载 ZIP。",
    ],
    nav: {
      english: "English",
      chinese: "中文",
    },
    guideTitle: "SVG 转 PNG 使用指南",
    guideIntro:
      "你可以快速把 SVG 矢量图转换成 PNG、JPG 或 WebP 位图图像。当你需要固定分辨率图片用于网站、社交平台、邮件编辑器或不支持 SVG 的软件时，这个工具会很实用。",
    browserBasedTitle: "100% 浏览器处理：",
    browserBasedText:
      "所有转换都在浏览器中完成，文件不会上传到服务器，因此速度更快，也更私密。",
    whatIsSvgTitle: "什么是 SVG？",
    whatIsSvgParagraphs: [
      "SVG 是一种基于 XML 的矢量图格式。它不是由像素组成，而是由路径、形状和数学指令构成，因此在放大或缩小时不会失真。",
      "SVG 特别适合用于 Logo、图标、界面图形、图表和插画。由于它本质上是文本，还可以直接用代码编辑器或设计工具进行修改。",
    ],
    whatIsPngTitle: "什么是 PNG？",
    whatIsPngParagraphs: [
      "PNG 是一种常见的位图图像格式，特点是清晰、无损压缩，并支持透明背景。与 SVG 不同，PNG 具有固定分辨率，但几乎所有浏览器、应用和上传流程都支持它。",
      "如果你更在意体积且不需要透明背景，可以使用 JPG；如果你希望在网页上兼顾画质与体积，WebP 也是不错的选择。",
    ],
    comparisonTitle: "SVG 和 PNG 的主要区别",
    comparisonIntro:
      "如果你需要可缩放、可编辑的源文件，SVG 更合适；如果你需要固定像素输出和广泛兼容性，PNG 更实用。",
    comparisonColumns: ["特性", "SVG", "PNG"],
    comparisonRows: [
      ["图像类型", "矢量（数学描述）", "位图（像素）"],
      ["缩放", "无限缩放不失真", "固定分辨率"],
      ["透明背景", "支持", "支持"],
      ["适用场景", "图标、Logo、插画", "兼容上传、固定输出"],
      ["可编辑性", "便于编辑路径和形状", "只能做像素级编辑"],
    ],
    convertWhenTitle: "什么时候应该把 SVG 转成 PNG",
    convertWhenItems: [
      "很多社交平台并不接受 SVG 文件上传。",
      "邮件客户端和老旧软件对 SVG 的支持并不稳定。",
      "某些 CMS 或电商平台要求固定分辨率的位图图片。",
      "当你需要透明背景或稳定尺寸输出时，PNG 会更合适。",
    ],
    convertWhenNote:
      "建议始终保留原始 SVG 文件。它仍然是以后生成不同尺寸导出图的最佳源文件。",
    howToTitle: "如何转换",
    howToSteps: [
      {
        title: "导入 SVG",
        description:
          "拖拽上传一个或多个 SVG 文件，或者直接粘贴 SVG 代码。",
      },
      {
        title: "调整导出选项",
        description:
          "选择 PNG、JPG 或 WebP，并按需调整宽度、高度、内边距、背景色和透明选项。",
      },
      {
        title: "下载或批量导出",
        description:
          "实时预览结果，逐个保存文件，也可以删除单个文件，或者一次性打包下载整个队列。",
      },
    ],
    privacyTitle: "隐私与安全",
    privacyText:
      "你的文件是安全的。所有转换都在本地浏览器中通过 JavaScript 完成，不会上传服务器，没有注册门槛，也不需要等待远程处理。",
    faqTitle: "常见问题",
    faqItems: [
      {
        question: "这个 SVG 转换器真的不会上传文件吗？",
        answer:
          "是的。所有转换都在浏览器内通过前端 canvas API 完成。SVG 文件不会上传到我们的服务器，也不会发送给第三方。",
      },
      {
        question: "可以导出透明背景的 PNG 或 WebP 吗？",
        answer:
          "可以。PNG 和 WebP 都支持透明背景。只要开启透明背景选项即可。JPG 不支持透明背景。",
      },
      {
        question: "为什么我要把 SVG 转成 PNG 或 JPG？",
        answer:
          "当你需要在社交媒体、邮件编辑器、商品平台、演示文稿工具或不支持 SVG 的旧软件中使用图片时，通常需要把 SVG 转成位图格式。",
      },
      {
        question: "支持批量转换吗？",
        answer:
          "支持。你可以上传多个 SVG 文件，之后再次上传时也会继续追加到当前队列，然后统一转换并下载 ZIP。",
      },
      {
        question: "队列里的单个文件可以单独保存或删除吗？",
        answer:
          "可以。队列中的每个文件都可以单独选中、单独下载，也可以单独删除，而不会影响其他文件。",
      },
      {
        question: "需要注册或付费吗？",
        answer:
          "不需要。SVGConvert 是一个免费、无需注册的 SVG 转换工具，打开页面即可直接转换和下载。",
      },
    ],
    footerLeft: "基于 Next.js 和浏览器端 canvas 渲染构建。",
    footerRight: "你的文件不会离开你的设备。",
  },
};

export function getHomeContent(locale: Locale) {
  return homeContent[locale];
}

export function getPageMetadata(locale: Locale): Metadata {
  const content = getHomeContent(locale);
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: content.path,
      languages: {
        en: "/",
        "zh-CN": "/zh",
      },
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
          url: "/opengraph-image.png",
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
      images: ["/twitter-image.png"],
    },
  };
}
