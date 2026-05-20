import { LocaleData } from "../types";

export const zh: LocaleData = {
  homeContent: {
  "lang": "zh-CN",
  "path": "/zh",
  "metaTitle": "SVG 转 PNG 转换器 | 免费浏览器版 SVG 工具",
  "metaDescription": "直接在浏览器中把 SVG 转成 PNG、JPG 或 WebP。支持拖拽上传、批量队列、单文件保存与删除、实时预览，并且全程本地处理，不上传服务器。",
  "openGraphLocale": "zh_CN",
  "title": "SVG 转 PNG、JPG 或 WebP",
  "intro": "将 SVG 矢量图高质量转换为位图图像，适合网页、社交媒体、商品上传和打印。所有转换都在你的浏览器中完成，文件不会离开你的设备。",
  "guideBullets": [
    "点击“选择文件”选择一个或多个 .svg 文件，或直接拖拽到上传区域。",
    "点击“转换”处理文件，然后可以逐个保存，或点击“全部保存”一次性下载 ZIP。"
  ],
  "guideTitle": "SVG 转 PNG 使用指南",
  "guideIntro": "你可以快速把 SVG 矢量图转换成 PNG、JPG 或 WebP 位图图像。当你需要固定分辨率图片用于网站、社交平台、邮件编辑器或不支持 SVG 的软件时，这个工具会很实用。",
  "browserBasedTitle": "100% 浏览器处理：",
  "browserBasedText": "所有转换都在浏览器中完成，文件不会上传到服务器，因此速度更快，也更私密。",
  "whatIsSvgTitle": "什么是 SVG？",
  "whatIsSvgParagraphs": [
    "SVG 是一种基于 XML 的矢量图格式。它不是由像素组成，而是由路径、形状和数学指令构成，因此在放大或缩小时不会失真。",
    "SVG 特别适合用于 Logo、图标、界面图形、图表和插画。由于 it 本质上是文本，还可以直接用代码编辑器或设计工具进行修改。"
  ],
  "whatIsPngTitle": "什么是 PNG？",
  "whatIsPngParagraphs": [
    "PNG 是一种常见的位图图像格式，特点是清晰、无损压缩，并支持透明背景。与 SVG 不同，PNG 具有固定分辨率，但几乎所有浏览器、应用和上传流程都支持它。",
    "如果你更在意体积且不需要透明背景，可以使用 JPG；如果你希望在网页上兼顾画质与体积，WebP 也是不错的选择。"
  ],
  "comparisonTitle": "SVG 和 PNG 的主要区别",
  "comparisonIntro": "如果你需要可缩放、可编辑的源文件，SVG 更合适；如果你需要固定像素输出和广泛兼容性，PNG 更实用。",
  "comparisonColumns": [
    "特性",
    "SVG",
    "PNG"
  ],
  "comparisonRows": [
    [
      "图像类型",
      "矢量（数学描述）",
      "位图（像素）"
    ],
    [
      "缩放",
      "无限缩放不失真",
      "固定分辨率"
    ],
    [
      "透明背景",
      "支持",
      "支持"
    ],
    [
      "适用场景",
      "图标、Logo、插画",
      "兼容上传、固定输出"
    ],
    [
      "可编辑性",
      "便于编辑路径和形状",
      "只能做像素级编辑"
    ]
  ],
  "convertWhenTitle": "什么时候应该把 SVG 转成 PNG",
  "convertWhenItems": [
    "很多社交平台并不接受 SVG 文件上传。",
    "邮件客户端和老旧软件对 SVG 的支持并不稳定。",
    "某些 CMS 或电商平台要求固定分辨率的位图图片。",
    "当你需要透明背景或稳定尺寸输出时，PNG 会更合适。"
  ],
  "convertWhenNote": "建议始终保留原始 SVG 文件。它仍然是以后生成不同尺寸导出图的最佳源文件。",
  "howToTitle": "如何转换",
  "howToSteps": [
    {
      "title": "导入 SVG",
      "description": "拖拽上传一个或多个 SVG 文件，或者直接粘贴 SVG 代码。"
    },
    {
      "title": "调整导出选项",
      "description": "选择 PNG、JPG 或 WebP，并按需调整宽度、高度、内边距、背景色和透明选项。"
    },
    {
      "title": "下载或批量导出",
      "description": "实时预览结果，逐个保存文件，也可以删除单个文件，或者一次性打包下载整个队列。"
    }
  ],
  "privacyTitle": "隐私与安全",
  "privacyText": "你的文件是安全的。所有转换都在本地浏览器中通过 JavaScript 完成，不会上传服务器，没有注册门槛，也不需要等待远程处理。",
  "faqTitle": "常见问题",
  "faqItems": [
    {
      "question": "这个 SVG 转换器真的不会上传文件吗？",
      "answer": "是的。所有转换都在浏览器内通过前端 canvas API 完成。SVG 文件不会上传到我们的服务器，也不会发送给第三方。"
    },
    {
      "question": "可以导出透明背景 of PNG 或 WebP 吗？",
      "answer": "可以。PNG 和 WebP 都支持透明背景。只要开启透明背景选项即可。JPG 不支持透明背景。"
    },
    {
      "question": "为什么我要把 SVG 转成 PNG 或 JPG？",
      "answer": "当你需要在社交媒体、邮件编辑器、商品平台、演示文稿工具或不支持 SVG 的旧软件中使用图片时，通常需要把 SVG 转成位图格式。"
    },
    {
      "question": "支持批量转换吗？",
      "answer": "支持。你可以上传多个 SVG 文件，之后再次上传时也会继续追加到当前队列，然后统一转换并下载 ZIP。"
    },
    {
      "question": "队列里的单个文件可以单独保存或删除吗？",
      "answer": "可以。队列中的每个文件都可以单独选中、单独下载，也可以单独删除，而不会影响其他文件。"
    },
    {
      "question": "需要注册或付费吗？",
      "answer": "不需要。SVGConvert 是一个免费、无需注册的 SVG 转换工具，打开页面即可直接转换和下载。"
    }
  ],
  "footerLeft": "基于 Next.js 和浏览器端 canvas 渲染构建。",
  "footerRight": "你的文件不会离开你的设备。"
},
  converterText: {
  "uploadTabPrefix": "SVG 转",
  "codeTab": "粘贴 SVG 代码",
  "selectFiles": "选择文件",
  "clear": "清空",
  "convert": "转换",
  "processing": "处理中...",
  "save": "保存",
  "saveAll": "全部保存",
  "preparing": "准备中...",
  "dropzoneTitle": "将文件拖到这里",
  "dropzoneSubtitle": "支持单个文件或最多 20 个 SVG 文件，全部在浏览器内完成处理。",
  "fileName": "文件名",
  "codePlaceholder": "<svg viewBox='0 0 120 120'>...</svg>",
  "outputOptions": "导出选项",
  "format": "格式",
  "scale": "缩放",
  "width": "宽度",
  "height": "高度",
  "padding": "内边距",
  "background": "背景色",
  "quality": "质量",
  "transparentBackground": "透明背景",
  "preview": "预览",
  "previewEmpty": "当前选中的 SVG 预览会显示在这里。",
  "currentFile": "当前文件",
  "previewHint": "当你修改 SVG 或导出选项时，预览会自动更新。",
  "saveAllHint": "点击“转换”后，可以为整个上传队列生成“全部保存”结果。",
  "loadedFiles": "已上传文件",
  "codeMode": "代码模式",
  "codeModeHint": "粘贴单个 SVG 代码片段，预览后即可直接保存。",
  "singleSave": "保存",
  "deleteFile": "删除",
  "onlySvg": "只支持 SVG 文件。",
  "pasteBeforeConvert": "请先粘贴 SVG 代码再进行转换。",
  "selectFilesFirst": "请先选择一个或多个 SVG 文件。",
  "convertBeforeSave": "请先转换 SVG。",
  "convertBeforeSaveAll": "请先转换文件后再全部保存。",
  "zipDownloaded": "ZIP 压缩包已下载。",
  "previewUpdated": "预览已更新。点击“保存”即可下载当前导出结果。",
  "fileRemoved": "文件已从队列中删除。",
  "renderFailed": "SVG 无法渲染，请检查 SVG 代码是否有效。",
  "exampleLoaded": "示例已加载。",
  "queueAppended": "个文件已追加到当前队列。",
  "queueLoaded": "个文件已载入。",
  "formats": {
    "png": "PNG",
    "jpg": "JPG",
    "webp": "WebP"
  },
  "statuses": {
    "idle": "待转换",
    "processing": "处理中",
    "ready": "已完成",
    "error": "错误"
  }
}
};
