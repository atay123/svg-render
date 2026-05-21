"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Download,
  FileImage,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { svgExamples } from "@/lib/example-svgs";
import { type Locale, getConverterText } from "@/lib/site";
import { cn } from "@/lib/utils";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";
type ItemStatus = "idle" | "processing" | "ready" | "error";

type PreviewResult = {
  dataUrl: string;
  width: number;
  height: number;
  sizeLabel: string;
};

type FileItem = {
  id: string;
  name: string;
  svgContent: string;
  status: ItemStatus;
  result?: PreviewResult;
  error?: string;
};


function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sanitizeFileName(value: string) {
  return (
    value
      .trim()
      .replace(/[^\w.-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image"
  );
}

function bytesToLabel(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(bytes / 1024).toFixed(2)} KB`;
}

function parseIntrinsicSize(content: string) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "image/svg+xml");
    const svg = doc.querySelector("svg");

    if (!svg || doc.querySelector("parsererror")) {
      return null;
    }

    const parseValue = (value?: string | null) => {
      if (!value) return null;
      const number = Number.parseFloat(value);
      return Number.isFinite(number) && number > 0 ? number : null;
    };

    const width = parseValue(svg.getAttribute("width"));
    const height = parseValue(svg.getAttribute("height"));

    if (width && height) {
      return { width, height };
    }

    const viewBox = svg.getAttribute("viewBox");
    if (!viewBox) {
      return null;
    }

    const parts = viewBox
      .trim()
      .split(/[,\s]+/)
      .map((item) => Number.parseFloat(item));

    if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
      return { width: parts[2], height: parts[3] };
    }

    return null;
  } catch {
    return null;
  }
}

function readSvgFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read SVG file."));
    reader.readAsText(file);
  });
}

function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl);
  return response.blob();
}

function getUniqueName(baseName: string, existingNames: Set<string>) {
  const cleanBase = sanitizeFileName(baseName);
  if (!existingNames.has(cleanBase.toLowerCase())) {
    existingNames.add(cleanBase.toLowerCase());
    return cleanBase;
  }

  let index = 2;
  let next = `${cleanBase}-${index}`;
  while (existingNames.has(next.toLowerCase())) {
    index += 1;
    next = `${cleanBase}-${index}`;
  }
  existingNames.add(next.toLowerCase());
  return next;
}

function getLocalText(locale: Locale) {
  const isZh = locale === "zh";
  return {
    sizingMode: isZh ? "尺寸模式" : "Sizing Mode",
    originalSize: isZh ? "自适应原始尺寸 (Auto / Original)" : "Auto / Original Size",
    scaleFactor: isZh ? "等比缩放 (Scale)" : "Scale Multiplier",
    customWidth: isZh ? "自适应宽度 (Width-based)" : "Fixed Width (Auto Height)",
    customHeight: isZh ? "自适应高度 (Height-based)" : "Fixed Height (Auto Width)",
    customDimensions: isZh ? "固定宽高 (Fixed Custom)" : "Fixed Width & Height",
    fitContain: isZh ? "保持比例居中 (Contain)" : "Contain (Fit & Center)",
    fitStretch: isZh ? "拉伸变形 (Stretch)" : "Stretch to Fit",
    fitMode: isZh ? "填充方式" : "Fit Mode",
    lockAspectRatio: isZh ? "锁定宽高比" : "Lock Aspect Ratio",
  };
}

export function SvgConverter({ locale }: { locale: Locale }) {
  const text = getConverterText(locale);
  const localText = getLocalText(locale);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastSourceRef = useRef("");

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  const [mode, setMode] = useState<"upload" | "code">("upload");
  const [items, setItems] = useState<FileItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [codeName, setCodeName] = useState("pasted-svg");
  const [codeSvg, setCodeSvg] = useState("");
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [sizingMode, setSizingMode] = useState<"auto" | "scale" | "width" | "height" | "custom">("auto");
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(1);
  const [fitMode, setFitMode] = useState<"contain" | "stretch">("contain");
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [padding, setPadding] = useState(0);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isTransparent, setIsTransparent] = useState(true);
  const [quality, setQuality] = useState(92);
  const [intrinsicSize, setIntrinsicSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const activeUploadItem =
    items.find((item) => item.id === activeId) ?? items[0] ?? null;
  const activeSvg =
    mode === "code" ? codeSvg.trim() : activeUploadItem?.svgContent.trim() ?? "";
  const activeName =
    mode === "code"
      ? sanitizeFileName(codeName)
      : sanitizeFileName(activeUploadItem?.name ?? "image");
  const readyCount = items.filter((item) => item.status === "ready").length;

  const buttonClassName =
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

  const getFormatLabel = (value: OutputFormat) => {
    if (value === "image/jpeg") return text.formats.jpg;
    if (value === "image/webp") return text.formats.webp;
    return text.formats.png;
  };

  const setItemsIdle = useCallback(() => {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        status: "idle",
        result: undefined,
        error: undefined,
      }))
    );
  }, []);

  const getExportDimensions = useCallback(
    (svgContent: string) => {
      const size = parseIntrinsicSize(svgContent) || { width: 512, height: 512 };
      const aspect = size.width / size.height;

      let exportWidth = width;
      let exportHeight = height;

      if (sizingMode === "auto") {
        exportWidth = size.width;
        exportHeight = size.height;
      } else if (sizingMode === "scale") {
        exportWidth = Math.round(size.width * scaleMultiplier);
        exportHeight = Math.round(size.height * scaleMultiplier);
      } else if (sizingMode === "width") {
        exportWidth = width;
        exportHeight = Math.round(width / aspect);
      } else if (sizingMode === "height") {
        exportWidth = Math.round(height * aspect);
        exportHeight = height;
      } else if (sizingMode === "custom") {
        exportWidth = width;
        exportHeight = height;
      }

      return {
        exportWidth: Math.max(1, exportWidth),
        exportHeight: Math.max(1, exportHeight),
        aspect,
      };
    },
    [width, height, sizingMode, scaleMultiplier]
  );

  const rasterizeSvg = useCallback(
    async (svgContent: string): Promise<PreviewResult> => {
      if (!svgContent.toLowerCase().includes("<svg")) {
        throw new Error(text.renderFailed);
      }

      const blob = new Blob([svgContent], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(blob);

      try {
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(text.renderFailed));
          img.src = svgUrl;
        });

        const { exportWidth, exportHeight, aspect } = getExportDimensions(svgContent);
        const exportPadding = Math.max(0, padding);
        const canvas = document.createElement("canvas");
        canvas.width = exportWidth + exportPadding * 2;
        canvas.height = exportHeight + exportPadding * 2;

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error(text.renderFailed);
        }

        if (!(format !== "image/jpeg" && isTransparent)) {
          context.fillStyle = bgColor;
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        let drawWidth = exportWidth;
        let drawHeight = exportHeight;
        let dx = exportPadding;
        let dy = exportPadding;

        if (sizingMode === "custom" && fitMode === "contain") {
          const targetAspect = exportWidth / exportHeight;
          if (aspect > targetAspect) {
            drawWidth = exportWidth;
            drawHeight = exportWidth / aspect;
            dy = exportPadding + (exportHeight - drawHeight) / 2;
          } else {
            drawHeight = exportHeight;
            drawWidth = exportHeight * aspect;
            dx = exportPadding + (exportWidth - drawWidth) / 2;
          }
        }

        context.drawImage(image, dx, dy, drawWidth, drawHeight);

        const dataUrl =
          format === "image/png"
            ? canvas.toDataURL(format)
            : canvas.toDataURL(format, Math.min(100, Math.max(1, quality)) / 100);
        const base64 = dataUrl.split(",")[1] ?? "";
        const sizeBytes = Math.ceil((base64.length * 3) / 4);

        return {
          dataUrl,
          width: canvas.width,
          height: canvas.height,
          sizeLabel: bytesToLabel(sizeBytes),
        };
      } finally {
        URL.revokeObjectURL(svgUrl);
      }
    },
    [bgColor, format, isTransparent, padding, quality, text.renderFailed, getExportDimensions, sizingMode, fitMode]
  );

  const addFiles = async (files: File[]) => {
    const svgFiles = files.filter(
      (file) =>
        file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")
    );

    if (!svgFiles.length) {
      setNotice(text.onlySvg);
      return;
    }

    const existingNames = new Set(items.map((item) => item.name.toLowerCase()));
    const nextItems: FileItem[] = [];

    for (const file of svgFiles) {
      const svgContent = await readSvgFile(file);
      nextItems.push({
        id: createId(),
        name: getUniqueName(file.name.replace(/\.svg$/i, "") || "image", existingNames),
        svgContent,
        status: "idle",
      });
    }

    const isAppending = items.length > 0;
    setItems((current) => [...current, ...nextItems]);
    setActiveId((current) => current ?? nextItems[0]?.id ?? null);
    setMode("upload");
    setNotice(
      locale === "zh"
        ? `${nextItems.length}${isAppending ? text.queueAppended : text.queueLoaded}`
        : `${nextItems.length} SVG ${isAppending ? text.queueAppended : text.queueLoaded}`
    );
    trackEvent("select_files", {
      count: nextItems.length,
      appended: isAppending,
    });
  };

  const clearAll = () => {
    setItems([]);
    setActiveId(null);
    setCodeSvg("");
    setCodeName("pasted-svg");
    setPreview(null);
    setNotice(null);
    setIntrinsicSize(null);
  };

  const removeItem = (id: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id);
      if (activeId === id) {
        setActiveId(next[0]?.id ?? null);
      }
      return next;
    });
    setNotice(text.fileRemoved);
  };

  const saveItem = async (item: FileItem) => {
    try {
      const result = item.result ?? (await rasterizeSvg(item.svgContent));
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                status: "ready",
                result,
                error: undefined,
              }
            : currentItem
        )
      );
      if (item.id === activeId) {
        setPreview(result);
      }
      downloadDataUrl(
        result.dataUrl,
        `${sanitizeFileName(item.name)}.${format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp"}`
      );
      trackEvent("save_single", {
        format,
        queued: true,
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : text.renderFailed);
    }
  };

  const handleScale = (scale: 1 | 2 | 3 | 4) => {
    setSizingMode("scale");
    setScaleMultiplier(scale);
    setItemsIdle();
  };

  const convertAll = async () => {
    if (mode === "code") {
      if (!codeSvg.trim()) {
        setNotice(text.pasteBeforeConvert);
        return;
      }

      setIsConverting(true);
      try {
        const result = await rasterizeSvg(codeSvg.trim());
        setPreview(result);
        setNotice(text.previewUpdated);
        trackEvent("convert_code_svg", {
          format,
        });
      } catch (error) {
        setNotice(error instanceof Error ? error.message : text.renderFailed);
      } finally {
        setIsConverting(false);
      }
      return;
    }

    if (!items.length) {
      setNotice(text.selectFilesFirst);
      return;
    }

    setIsConverting(true);

    try {
      const nextItems: FileItem[] = [];

      for (const item of items) {
        try {
          const result = await rasterizeSvg(item.svgContent);
          nextItems.push({
            ...item,
            status: "ready",
            result,
            error: undefined,
          });
        } catch (error) {
          nextItems.push({
            ...item,
            status: "error",
            result: undefined,
            error: error instanceof Error ? error.message : text.renderFailed,
          });
        }
      }

      setItems(nextItems);

      const activeResult =
        nextItems.find((item) => item.id === activeId)?.result ??
        nextItems[0]?.result ??
        null;

      if (activeResult) {
        setPreview(activeResult);
      }

      setNotice(
        locale === "zh"
          ? `已完成 ${nextItems.filter((item) => item.status === "ready").length} 个文件的转换。`
          : `${nextItems.filter((item) => item.status === "ready").length} file(s) converted.`
      );
      trackEvent("convert_files", {
        count: nextItems.length,
        format,
      });
    } finally {
      setIsConverting(false);
    }
  };

  const saveCurrent = () => {
    if (!preview) {
      setNotice(text.convertBeforeSave);
      return;
    }

    const extension =
      format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp";
    downloadDataUrl(preview.dataUrl, `${activeName}.${extension}`);
    setNotice(`${activeName}.${extension}`);
    trackEvent("save_single", {
      format,
      queued: false,
    });
  };

  const saveAll = async () => {
    if (!readyCount) {
      setNotice(text.convertBeforeSaveAll);
      return;
    }

    setIsSavingAll(true);
    try {
      const zip = new JSZip();
      for (const item of items) {
        if (!item.result?.dataUrl) continue;
        const blob = await dataUrlToBlob(item.result.dataUrl);
        zip.file(
          `${sanitizeFileName(item.name)}.${format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp"}`,
          blob
        );
      }
      const archive = await zip.generateAsync({ type: "blob" });
      downloadBlob(
        archive,
        `svgconvert-${format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp"}.zip`
      );
      setNotice(text.zipDownloaded);
      trackEvent("save_all", {
        count: readyCount,
        format,
      });
    } finally {
      setIsSavingAll(false);
    }
  };

  useEffect(() => {
    if (format === "image/jpeg" && isTransparent) {
      setIsTransparent(false);
    }
  }, [format, isTransparent]);

  useEffect(() => {
    if (!activeSvg) {
      setPreview(null);
      setIntrinsicSize(null);
      return;
    }

    if (activeSvg !== lastSourceRef.current) {
      lastSourceRef.current = activeSvg;
      const size = parseIntrinsicSize(activeSvg);
      setIntrinsicSize(size);
      if (size?.width && size.height) {
        if (sizingMode === "auto" || sizingMode === "scale") {
          setWidth(Math.max(1, Math.round(size.width)));
          setHeight(Math.max(1, Math.round(size.height)));
        }
      }
    }
  }, [activeSvg, sizingMode]);

  useEffect(() => {
    if (mode === "upload" && items.length && !activeId) {
      setActiveId(items[0].id);
    }
  }, [activeId, items, mode]);

  useEffect(() => {
    if (!items.length && mode === "upload") {
      setPreview(null);
    }
  }, [items.length, mode]);

  useEffect(() => {
    if (!activeSvg) {
      setPreview(null);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      try {
        const result = await rasterizeSvg(activeSvg);
        if (!cancelled) {
          setPreview(result);
        }
      } catch {
        if (!cancelled) {
          setPreview(null);
        }
      }
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [activeSvg, rasterizeSvg]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 pt-5">
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "rounded-t-lg border border-b-0 px-6 py-3 text-base font-semibold",
              mode === "upload"
                ? "border-slate-200 bg-white text-orange-600"
                : "border-transparent bg-slate-100 text-slate-600"
            )}
          >
            {text.uploadTabPrefix} {getFormatLabel(format)}
          </button>
          <button
            type="button"
            onClick={() => setMode("code")}
            className={cn(
              "rounded-t-lg border border-b-0 px-6 py-3 text-base font-semibold",
              mode === "code"
                ? "border-slate-200 bg-white text-orange-600"
                : "border-transparent bg-slate-100 text-slate-600"
            )}
          >
            {text.codeTab}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 pb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(buttonClassName, "bg-blue-500 text-white hover:bg-blue-600")}
          >
            <Upload className="h-4 w-4" />
            {text.selectFiles}
          </button>
          <button
            type="button"
            onClick={clearAll}
            disabled={!items.length && !codeSvg}
            className={cn(
              buttonClassName,
              "bg-rose-200 text-white hover:bg-rose-300 disabled:bg-slate-200 disabled:text-slate-500"
            )}
          >
            <Trash2 className="h-4 w-4" />
            {text.clear}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,image/svg+xml"
            multiple
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              void addFiles(files);
              event.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        {mode === "upload" ? (
          items.length > 0 ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                void addFiles(Array.from(event.dataTransfer.files ?? []));
              }}
              className={cn(
                "relative flex min-h-[280px] w-full flex-col justify-between rounded-lg border-2 p-6 transition bg-slate-50/50",
                isDragging ? "border-blue-300 bg-blue-50/50" : "border-slate-200"
              )}
            >
              {/* Centered SELECT and CLEAR buttons inside the container */}
              <div className="flex justify-center gap-3 mb-6 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm transition"
                >
                  <Upload className="h-4 w-4" />
                  {text.selectFiles}
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 rounded-md bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600 shadow-sm transition"
                >
                  <Trash2 className="h-4 w-4" />
                  {text.clear}
                </button>
              </div>

              {/* Carousel wrapper with Left and Right scroll buttons */}
              <div className="relative flex items-center w-full my-auto px-10">
                <button
                  type="button"
                  onClick={scrollLeft}
                  className="absolute left-0 z-10 p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-600 hover:text-slate-900 transition"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div
                  ref={scrollContainerRef}
                  className="flex w-full gap-4 overflow-x-auto scroll-smooth py-2 scrollbar-none"
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveId(item.id);
                        setNotice(null);
                      }}
                      className={cn(
                        "w-36 h-36 flex-shrink-0 relative rounded-lg border bg-white shadow-xs overflow-hidden flex flex-col justify-between cursor-pointer transition-all",
                        item.id === activeId
                          ? "border-blue-500 ring-2 ring-blue-500/25"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      {/* Card Header (overlay) */}
                      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-2 py-1 bg-slate-900/60 text-white text-[10px] backdrop-blur-xs">
                        <span className="text-left truncate flex-1 pr-1 font-medium select-none">
                          {item.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(item.id);
                          }}
                          className="p-0.5 rounded-full hover:bg-white/20 transition shrink-0"
                          aria-label={text.deleteFile}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Card Body (preview image) */}
                      <div className="flex-1 flex items-center justify-center p-3 mt-4 mb-5 overflow-hidden bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%),linear-gradient(-45deg,#f3f4f6_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f3f4f6_75%),linear-gradient(-45deg,transparent_75%,#f3f4f6_75%)] bg-[length:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0]">
                        {item.result?.dataUrl ? (
                          <Image
                            src={item.result.dataUrl}
                            alt={item.name}
                            width={100}
                            height={100}
                            unoptimized
                            className="max-w-full max-h-full object-contain pointer-events-none"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:object-contain"
                            dangerouslySetInnerHTML={{ __html: item.svgContent }}
                          />
                        )}
                      </div>

                      {/* Card Footer (status-aware action bar) */}
                      <div className="absolute bottom-0 left-0 right-0 z-10">
                        {item.status === "ready" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void saveItem(item);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1 text-center transition"
                          >
                            {text.save}
                          </button>
                        )}
                        {item.status === "idle" && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void saveItem(item);
                            }}
                            className="w-full bg-slate-700/80 hover:bg-slate-800 text-white text-[10px] font-bold py-1 text-center transition"
                          >
                            {text.save}
                          </button>
                        )}
                        {item.status === "processing" && (
                          <div className="w-full bg-blue-600/90 text-white text-[10px] font-bold py-1 text-center animate-pulse">
                            {text.processing}
                          </div>
                        )}
                        {item.status === "error" && (
                          <div className="w-full bg-red-600/90 text-white text-[9px] font-bold py-1 text-center truncate px-1">
                            {item.error || text.statuses.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={scrollRight}
                  className="absolute right-0 z-10 p-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-slate-600 hover:text-slate-900 transition"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                void addFiles(Array.from(event.dataTransfer.files ?? []));
              }}
              className={cn(
                "flex min-h-[260px] w-full items-center justify-center rounded-lg border-2 border-dashed px-6 text-center transition",
                isDragging
                  ? "border-blue-300 bg-blue-50"
                  : "border-blue-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/40"
              )}
            >
              <div className="space-y-3">
                <div className="text-3xl font-semibold text-slate-300">
                  {text.dropzoneTitle}
                </div>
                <p className="text-sm text-slate-500">{text.dropzoneSubtitle}</p>
              </div>
            </button>
          )
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">{text.fileName}</span>
                <input
                  type="text"
                  value={codeName}
                  onChange={(event) => {
                    setCodeName(event.target.value);
                    setNotice(null);
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </label>
              <textarea
                value={codeSvg}
                onChange={(event) => {
                  setCodeSvg(event.target.value);
                  setNotice(null);
                }}
                placeholder={text.codePlaceholder}
                spellCheck={false}
                className="min-h-[260px] w-full rounded-lg border border-slate-300 px-4 py-3 font-mono text-sm text-slate-700 outline-none focus:border-blue-400"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              {svgExamples.map((example) => (
                <button
                  key={example.slug}
                  type="button"
                  onClick={() => {
                    setCodeName(example.slug);
                    setCodeSvg(example.markup);
                    setNotice(
                      locale === "zh"
                        ? `${example.nameZh} ${text.exampleLoaded}`
                        : `${example.name} ${text.exampleLoaded}`
                    );
                  }}
                  className="rounded-full border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600"
                >
                  {locale === "zh" ? example.nameZh : example.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void convertAll()}
            disabled={isConverting || (!items.length && !codeSvg)}
            className={cn(buttonClassName, "bg-slate-800 text-white hover:bg-slate-900 relative")}
          >
            {isConverting ? text.processing : text.convert}
            {mode === "upload" && items.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-600 text-[10px] font-bold text-white ring-2 ring-white">
                {items.length}
              </span>
            )}
          </button>

          {mode === "code" && (
            <button
              type="button"
              onClick={saveCurrent}
              disabled={!preview}
              className={cn(buttonClassName, "bg-emerald-500 text-white hover:bg-emerald-600")}
            >
              <Download className="h-4 w-4" />
              {text.save}
            </button>
          )}

          {mode === "upload" && (
            <button
              type="button"
              onClick={() => void saveAll()}
              disabled={isSavingAll || !readyCount}
              className={cn(
                buttonClassName,
                "bg-emerald-600 text-white hover:bg-emerald-700 relative disabled:bg-slate-100 disabled:text-slate-400"
              )}
            >
              {isSavingAll ? text.preparing : text.saveAll}
              {readyCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {readyCount}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={() => setOptionsOpen((current) => !current)}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-700"
          >
            <span>{text.outputOptions}</span>
            <ChevronDown
              className={cn("h-4 w-4 transition", optionsOpen && "rotate-180")}
            />
          </button>

          {optionsOpen ? (
            <div className="grid gap-4 border-t border-slate-200 px-4 py-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">{text.format}</span>
                <select
                  value={format}
                  onChange={(event) => {
                    setFormat(event.target.value as OutputFormat);
                    setItemsIdle();
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                >
                  <option value="image/png">{text.formats.png}</option>
                  <option value="image/jpeg">{text.formats.jpg}</option>
                  <option value="image/webp">{text.formats.webp}</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">{localText.sizingMode}</span>
                <select
                  value={sizingMode}
                  onChange={(event) => {
                    const newMode = event.target.value as "auto" | "scale" | "width" | "height" | "custom";
                    setSizingMode(newMode);
                    setItemsIdle();
                    if ((newMode === "custom" || newMode === "width" || newMode === "height") && intrinsicSize) {
                      setWidth(Math.round(intrinsicSize.width));
                      setHeight(Math.round(intrinsicSize.height));
                    }
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                >
                  <option value="auto">{localText.originalSize}</option>
                  <option value="scale">{localText.scaleFactor}</option>
                  <option value="width">{localText.customWidth}</option>
                  <option value="height">{localText.customHeight}</option>
                  <option value="custom">{localText.customDimensions}</option>
                </select>
              </label>

              {sizingMode === "scale" && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">{text.scale}</span>
                  <div className="flex gap-2">
                    {([1, 2, 3, 4] as const).map((scaleVal) => (
                      <button
                        key={scaleVal}
                        type="button"
                        onClick={() => {
                          handleScale(scaleVal);
                        }}
                        className={cn(
                          "flex-1 rounded-md border px-3 py-2 text-sm font-medium transition",
                          scaleMultiplier === scaleVal
                            ? "border-blue-500 bg-blue-50 text-blue-600 font-bold"
                            : "border-slate-300 text-slate-700 hover:border-blue-300"
                        )}
                      >
                        {scaleVal}x
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">{text.width}</span>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={
                      sizingMode === "auto"
                        ? (intrinsicSize?.width ?? 1200)
                        : sizingMode === "scale"
                        ? Math.round((intrinsicSize?.width ?? 1200) * scaleMultiplier)
                        : sizingMode === "height"
                        ? (intrinsicSize ? Math.round(height * (intrinsicSize.width / intrinsicSize.height)) : height)
                        : width
                    }
                    disabled={sizingMode === "auto" || sizingMode === "scale" || sizingMode === "height"}
                    onChange={(event) => {
                      const newWidth = Math.max(1, Number(event.target.value) || 1);
                      setWidth(newWidth);
                      if (lockAspectRatio && intrinsicSize) {
                        const aspect = intrinsicSize.width / intrinsicSize.height;
                        setHeight(Math.max(1, Math.round(newWidth / aspect)));
                      }
                      setItemsIdle();
                    }}
                    className={cn(
                      "w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-blue-400",
                      (sizingMode === "auto" || sizingMode === "scale" || sizingMode === "height")
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                        : "border-slate-300 text-slate-700 bg-white"
                    )}
                  />
                  {(sizingMode === "auto" || sizingMode === "scale" || sizingMode === "height") && (
                    <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-semibold px-1 py-0.5 bg-slate-200/50 rounded select-none">
                      AUTO
                    </span>
                  )}
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">{text.height}</span>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={
                      sizingMode === "auto"
                        ? (intrinsicSize?.height ?? 1200)
                        : sizingMode === "scale"
                        ? Math.round((intrinsicSize?.height ?? 1200) * scaleMultiplier)
                        : sizingMode === "width"
                        ? (intrinsicSize ? Math.round(width / (intrinsicSize.width / intrinsicSize.height)) : width)
                        : height
                    }
                    disabled={sizingMode === "auto" || sizingMode === "scale" || sizingMode === "width"}
                    onChange={(event) => {
                      const newHeight = Math.max(1, Number(event.target.value) || 1);
                      setHeight(newHeight);
                      if (lockAspectRatio && intrinsicSize) {
                        const aspect = intrinsicSize.width / intrinsicSize.height;
                        setWidth(Math.max(1, Math.round(newHeight * aspect)));
                      }
                      setItemsIdle();
                    }}
                    className={cn(
                      "w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-blue-400",
                      (sizingMode === "auto" || sizingMode === "scale" || sizingMode === "width")
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                        : "border-slate-300 text-slate-700 bg-white"
                    )}
                  />
                  {(sizingMode === "auto" || sizingMode === "scale" || sizingMode === "width") && (
                    <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-semibold px-1 py-0.5 bg-slate-200/50 rounded select-none">
                      AUTO
                    </span>
                  )}
                </div>
              </label>

              {sizingMode === "custom" && (
                <label className="flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  <span>{localText.lockAspectRatio}</span>
                  <input
                    type="checkbox"
                    checked={lockAspectRatio}
                    onChange={(event) => {
                      const nextLock = event.target.checked;
                      setLockAspectRatio(nextLock);
                      if (nextLock && intrinsicSize) {
                        const aspect = intrinsicSize.width / intrinsicSize.height;
                        setHeight(Math.max(1, Math.round(width / aspect)));
                        setItemsIdle();
                      }
                    }}
                  />
                </label>
              )}

              {sizingMode === "custom" && (
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">{localText.fitMode}</span>
                  <select
                    value={fitMode}
                    onChange={(event) => {
                      setFitMode(event.target.value as "contain" | "stretch");
                      setItemsIdle();
                    }}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="contain">{localText.fitContain}</option>
                    <option value="stretch">{localText.fitStretch}</option>
                  </select>
                </label>
              )}

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">{text.padding}</span>
                <input
                  type="number"
                  min={0}
                  value={padding}
                  onChange={(event) => {
                    setPadding(Math.max(0, Number(event.target.value) || 0));
                    setItemsIdle();
                  }}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">{text.background}</span>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(event) => {
                    setBgColor(event.target.value);
                    setItemsIdle();
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 py-1"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-600">{text.quality}</span>
                <input
                  type="range"
                  min={60}
                  max={100}
                  step={1}
                  value={quality}
                  onChange={(event) => {
                    setQuality(Number(event.target.value));
                    setItemsIdle();
                  }}
                  disabled={format === "image/png"}
                  className="w-full accent-blue-500"
                />
              </label>

              <label className="flex items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                <span>{text.transparentBackground}</span>
                <input
                  type="checkbox"
                  checked={isTransparent}
                  onChange={(event) => {
                    setIsTransparent(event.target.checked);
                    setItemsIdle();
                  }}
                  disabled={format === "image/jpeg"}
                />
              </label>
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-700">{text.preview}</div>
              {preview ? (
                <div className="text-sm text-slate-500">
                  {preview.width} × {preview.height} • {preview.sizeLabel}
                </div>
              ) : null}
            </div>

            <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4">
              {preview ? (
                <div className="grid w-full place-items-center bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%),linear-gradient(-45deg,#e5e7eb_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e7eb_75%),linear-gradient(-45deg,transparent_75%,#e5e7eb_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] p-6">
                  <Image
                    src={preview.dataUrl}
                    alt={text.preview}
                    width={preview.width}
                    height={preview.height}
                    unoptimized
                    className="max-h-[360px] w-auto max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <FileImage className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="text-sm text-slate-500">{text.previewEmpty}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {text.currentFile}
              </h3>
              <p className="mt-2 break-words text-base font-semibold text-slate-800">
                {activeName}.{format === "image/png" ? "png" : format === "image/jpeg" ? "jpg" : "webp"}
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p>{text.previewHint}</p>
              <p>{text.saveAllHint}</p>
            </div>

            {notice ? (
              <div className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
                {notice}
              </div>
            ) : null}



            {mode === "code" ? (
              <div className="space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <Code2 className="h-4 w-4" />
                  {text.codeMode}
                </div>
                <p>{text.codeModeHint}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
