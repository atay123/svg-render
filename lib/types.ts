export type FaqItem = {
  question: string;
  answer: string;
};

export type HowToStep = {
  title: string;
  description: string;
};

export type HomeContent = {
  lang: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  openGraphLocale: string;
  toolBadge?: string;
  title: string;
  intro: string;
  guideBullets: string[];
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
  comparisonColumns: string[];
  comparisonRows: string[][];
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

export type ConverterText = {
  uploadTabPrefix: string;
  codeTab: string;
  selectFiles: string;
  clear: string;
  convert: string;
  processing: string;
  save: string;
  saveAll: string;
  preparing: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  fileName: string;
  codePlaceholder: string;
  outputOptions: string;
  format: string;
  scale: string;
  width: string;
  height: string;
  padding: string;
  background: string;
  quality: string;
  transparentBackground: string;
  preview: string;
  previewEmpty: string;
  currentFile: string;
  previewHint: string;
  saveAllHint: string;
  loadedFiles: string;
  codeMode: string;
  codeModeHint: string;
  singleSave: string;
  deleteFile: string;
  onlySvg: string;
  pasteBeforeConvert: string;
  selectFilesFirst: string;
  convertBeforeSave: string;
  convertBeforeSaveAll: string;
  zipDownloaded: string;
  previewUpdated: string;
  fileRemoved: string;
  renderFailed: string;
  exampleLoaded: string;
  queueAppended: string;
  queueLoaded: string;
  formats: {
    png: string;
    jpg: string;
    webp: string;
  };
  statuses: {
    idle: string;
    processing: string;
    ready: string;
    error: string;
  };
};

export type LocaleData = {
  homeContent: HomeContent;
  converterText: ConverterText;
};
