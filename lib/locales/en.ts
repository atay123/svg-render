import { LocaleData } from "../types";

export const en: LocaleData = {
  homeContent: {
  "lang": "en",
  "path": "/",
  "metaTitle": "SVG to PNG – Convert SVG to PNG Online – Free & Secure",
  "metaDescription": "Free browser-based SVG to PNG converter. Convert SVG to PNG, JPG, or WebP online with batch queue, live preview, and 100% private client-side processing.",
  "openGraphLocale": "en_US",
  "title": "Convert SVG to PNG, JPG, or WebP",
  "intro": "Convert SVG vector graphics to raster images with high quality. Perfect for web, social media, product uploads, and print. All conversion happens in your browser so your files never leave your device.",
  "guideBullets": [
    "Click SELECT FILES to choose one or more .svg files, or drag files into the drop area.",
    "Use CONVERT to process your files, then SAVE one by one or SAVE ALL as a ZIP archive."
  ],
  "guideTitle": "SVG to PNG Conversion Guide",
  "guideIntro": "Convert vector SVG graphics to raster PNG, JPG, or WebP images quickly and easily. This is useful when you need fixed-resolution exports for websites, social platforms, email builders, or software that does not support SVG well.",
  "browserBasedTitle": "100% Browser-Based:",
  "browserBasedText": "All conversion happens in your browser. Your files never leave your device, which keeps the workflow fast and private.",
  "whatIsSvgTitle": "What Is SVG?",
  "whatIsSvgParagraphs": [
    "Scalable Vector Graphics (SVG) is an XML-based vector image format. Unlike raster images made of pixels, SVG files are built from paths, shapes, and mathematical instructions. That means they can scale up or down without losing sharpness.",
    "SVG works especially well for logos, icons, interface graphics, diagrams, and illustrations. Because it is text-based, it can also be edited with code editors or design tools."
  ],
  "whatIsPngTitle": "What Is PNG?",
  "whatIsPngParagraphs": [
    "PNG is a raster image format known for sharp quality and lossless compression. Unlike SVG, PNG has a fixed resolution, but it supports transparency and is accepted by nearly every browser, app, and upload flow.",
    "JPG is useful when you want a smaller file and do not need transparency. WebP is a modern web-friendly format that can balance size and quality."
  ],
  "comparisonTitle": "SVG vs PNG: Key Differences",
  "comparisonIntro": "SVG is best when you want flexible, editable, scalable graphics. PNG is better when you need predictable pixel output and universal compatibility.",
  "comparisonColumns": [
    "Feature",
    "SVG",
    "PNG"
  ],
  "comparisonRows": [
    [
      "Image type",
      "Vector (math-based)",
      "Raster (pixel-based)"
    ],
    [
      "Scaling",
      "Infinite without quality loss",
      "Fixed resolution"
    ],
    [
      "Transparency",
      "Yes",
      "Yes"
    ],
    [
      "Best for",
      "Icons, logos, illustrations",
      "Compatibility, uploads, fixed output"
    ],
    [
      "Editability",
      "Easy to edit paths and shapes",
      "Pixel-level editing only"
    ]
  ],
  "convertWhenTitle": "When to Convert SVG to PNG",
  "convertWhenItems": [
    "Social media platforms often do not accept SVG uploads.",
    "Email clients and older software can render SVG inconsistently.",
    "Some CMS and marketplace flows require fixed-resolution raster files.",
    "PNG works better when you need predictable output size or transparent assets."
  ],
  "convertWhenNote": "Keep the original SVG whenever possible. It remains the best source file for future exports at different sizes.",
  "howToTitle": "How to Convert",
  "howToSteps": [
    {
      "title": "Import your SVG",
      "description": "Drag and drop one or more SVG files, or paste SVG code directly into the editor."
    },
    {
      "title": "Adjust the export",
      "description": "Choose PNG, JPG, or WebP and adjust width, height, padding, background, or transparency if needed."
    },
    {
      "title": "Download or batch export",
      "description": "Preview the result, save a single file, delete individual files, or download all converted files in a ZIP archive."
    }
  ],
  "privacyTitle": "Privacy & Security",
  "privacyText": "Your files are completely safe. All conversion happens locally in your browser using JavaScript. There are no server uploads, no registration walls, and no waiting for a remote processor.",
  "faqTitle": "FAQ",
  "faqItems": [
    {
      "question": "Is this SVG converter really private?",
      "answer": "Yes. Every conversion runs in your browser using client-side canvas APIs. Your SVG files are not uploaded to our server, stored remotely, or sent to a third-party processor."
    },
    {
      "question": "Can I convert SVG to transparent PNG or WebP?",
      "answer": "Yes. PNG and WebP both support transparency. Keep the transparent background option enabled and export in either of those formats. JPG does not support transparency."
    },
    {
      "question": "Why would I convert SVG to PNG or JPG?",
      "answer": "You should convert SVG when a platform needs raster images, such as social media uploads, email builders, marketplace listings, presentation tools, or legacy software that does not render SVG reliably."
    },
    {
      "question": "Does the tool support batch conversion?",
      "answer": "Yes. You can upload multiple SVG files, keep appending more files to the queue, convert them together, and download them as a ZIP archive."
    },
    {
      "question": "Can I save or delete a single file from the queue?",
      "answer": "Yes. Each queued file can be selected, downloaded individually, or removed without clearing the rest of the queue."
    },
    {
      "question": "Do I need to register or pay?",
      "answer": "No. SVGConvert is designed as a free, no-signup SVG converter. Open the page, convert your file, and download the result immediately."
    }
  ],
  "footerLeft": "Built with Next.js and browser-based canvas rendering.",
  "footerRight": "Your files never leave your device."
},
  converterText: {
  "uploadTabPrefix": "SVG to",
  "codeTab": "Paste SVG Code",
  "selectFiles": "SELECT FILES",
  "clear": "CLEAR",
  "convert": "CONVERT",
  "processing": "PROCESSING...",
  "save": "SAVE",
  "saveAll": "SAVE ALL",
  "preparing": "PREPARING...",
  "dropzoneTitle": "Drop Your Files Here",
  "dropzoneSubtitle": "Upload one file or up to 20 SVG files. Everything stays in your browser.",
  "fileName": "File name",
  "codePlaceholder": "<svg viewBox='0 0 120 120'>...</svg>",
  "outputOptions": "Output options",
  "format": "Format",
  "scale": "Scale",
  "width": "Width",
  "height": "Height",
  "padding": "Padding",
  "background": "Background",
  "quality": "Quality",
  "transparentBackground": "Transparent background",
  "preview": "Preview",
  "previewEmpty": "Your active SVG preview will appear here.",
  "currentFile": "Current file",
  "previewHint": "Preview updates automatically when you change the SVG or output options.",
  "saveAllHint": "Use CONVERT to prepare all uploaded SVG files for SAVE ALL.",
  "loadedFiles": "Loaded files",
  "codeMode": "Code mode",
  "codeModeHint": "Paste a single SVG snippet, preview it, then save it directly.",
  "singleSave": "SAVE",
  "deleteFile": "DELETE",
  "onlySvg": "Only SVG files are supported.",
  "pasteBeforeConvert": "Paste SVG code before converting.",
  "selectFilesFirst": "Select one or more SVG files first.",
  "convertBeforeSave": "Convert the SVG first.",
  "convertBeforeSaveAll": "Convert your files before saving all.",
  "zipDownloaded": "ZIP archive downloaded.",
  "previewUpdated": "Preview updated. Use SAVE to download the current export.",
  "fileRemoved": "File removed from the queue.",
  "renderFailed": "The SVG could not be rendered. Check the SVG markup.",
  "exampleLoaded": "Example loaded.",
  "queueAppended": "file(s) added to the current queue.",
  "queueLoaded": "file(s) loaded.",
  "formats": {
    "png": "PNG",
    "jpg": "JPG",
    "webp": "WebP"
  },
  "statuses": {
    "idle": "idle",
    "processing": "processing",
    "ready": "ready",
    "error": "error"
  }
}
};
