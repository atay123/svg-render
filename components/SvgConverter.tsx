"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Download, Copy, Check, Settings2, X, FileCode, ChevronDown, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import JSZip from "jszip";

type OutputFormat = "image/jpeg" | "image/png" | "image/webp";
type QueueStatus = "pending" | "processing" | "done" | "error";

type QueueItem = {
  id: string;
  name: string;
  svgContent: string;
  status: QueueStatus;
  previewUrl?: string;
  fileSize?: string;
  outputFormat?: OutputFormat;
  error?: string;
};

export function SvgConverter() {
  const [svgContent, setSvgContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("image");
  
  // Settings
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [padding, setPadding] = useState<number>(0);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [isTransparent, setIsTransparent] = useState<boolean>(true);
  const [backgroundPreset, setBackgroundPreset] = useState<"transparent" | "white" | "black" | "gray">("transparent");
  const [quality, setQuality] = useState<number>(92);
  const [lockRatio, setLockRatio] = useState(true);
  const [intrinsicRatio, setIntrinsicRatio] = useState<number | null>(null);
  const [intrinsicWidth, setIntrinsicWidth] = useState<number | null>(null);
  const [scalePreset, setScalePreset] = useState<1 | 2 | 3 | 4 | null>(null);
  const [scaleBaseWidth, setScaleBaseWidth] = useState<number | null>(null);

  // State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastPreviewUrl, setLastPreviewUrl] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [fileSize, setFileSize] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputTab, setInputTab] = useState<"upload" | "code">("upload");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [batchOpen, setBatchOpen] = useState(true);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const readyItems = queue.filter((item) => item.previewUrl);
  const showPreview = Boolean(previewVisible && (previewUrl || lastPreviewUrl));

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queueRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const prevStatusesRef = useRef<Map<string, QueueStatus>>(new Map());
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (previewUrl) {
      setLastPreviewUrl(previewUrl);
    }
  }, [previewUrl]);

  useEffect(() => {
    if (!queue.length) {
      setLastPreviewUrl(null);
    }
  }, [queue.length]);

  useEffect(() => {
    if (!queue.length) {
      prevStatusesRef.current.clear();
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
      }
      setHighlightId(null);
      return;
    }

    const prevStatuses = prevStatusesRef.current;
    let completedId: string | null = null;

    for (const item of queue) {
      const prevStatus = prevStatuses.get(item.id);
      if (prevStatus && prevStatus !== "done" && item.status === "done") {
        completedId = item.id;
        break;
      }
    }

    for (const item of queue) {
      prevStatuses.set(item.id, item.status);
    }

    if (completedId) {
      const target = queueRefs.current.get(completedId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      setHighlightId(completedId);
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
      highlightTimerRef.current = setTimeout(() => {
        setHighlightId(null);
        highlightTimerRef.current = null;
      }, 1600);
    }
  }, [queue]);

  const getUniqueName = useCallback((base: string) => {
    const cleanBase = base.trim() || "image";
    const existing = new Set(queue.map((item) => item.name.toLowerCase()));
    if (!existing.has(cleanBase.toLowerCase())) return cleanBase;
    let i = 2;
    while (existing.has(`${cleanBase}-${i}`.toLowerCase())) i += 1;
    return `${cleanBase}-${i}`;
  }, [queue]);

  const makeId = () => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const extractSizeFromSvg = (content: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "image/svg+xml");
      const svg = doc.querySelector("svg");
      if (!svg) return null;

      const widthAttr = svg.getAttribute("width");
      const heightAttr = svg.getAttribute("height");
      const viewBox = svg.getAttribute("viewBox");

      const parseSize = (value?: string | null) => {
        if (!value) return null;
        const num = parseFloat(value);
        return Number.isFinite(num) && num > 0 ? num : null;
      };

      const width = parseSize(widthAttr);
      const height = parseSize(heightAttr);

      if (width && height) return { width, height };

      if (viewBox) {
        const parts = viewBox.trim().split(/[,\s]+/).map((val) => parseFloat(val));
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          return { width: parts[2], height: parts[3] };
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  const readFileAsText = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });

  const addQueueItem = useCallback((name: string, content: string) => {
    const id = makeId();
    const item: QueueItem = {
      id,
      name,
      svgContent: content,
      status: "pending",
    };
    setQueue((prev) => [...prev, item]);
    if (!activeId) {
      setActiveId(id);
      setSvgContent(content);
      setFileName(name);
      setPreviewUrl(null);
      setFileSize("");
      setScalePreset(null);
      setScaleBaseWidth(null);
    }
  }, [activeId]);

  // Handle Drag & Drop
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    handleFiles(files);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    handleFiles(files);
    e.target.value = "";
  };

  const handleFiles = async (files: File[]) => {
    const svgFiles = files.filter((file) => file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg"));
    if (!svgFiles.length) {
      setError("Please upload valid SVG files only.");
      return;
    }
    const skipped = files.length - svgFiles.length;
    if (skipped > 0) {
      setError(`${skipped} file(s) skipped. SVG only.`);
    }
    try {
      for (const file of svgFiles) {
        const content = await readFileAsText(file);
        const baseName = file.name.replace(/\.svg$/i, "");
        const name = getUniqueName(baseName);
        addQueueItem(name, content);
      }
    } catch (err) {
      setError("Failed to read one or more files.");
    }
  };

  const loadExample = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("https://gist.githubusercontent.com/simonw/aedecb93564af13ac1596810d40cac3c/raw/83e7f3be5b65bba61124684700fa7925d37c36c3/tiger.svg");
      const text = await res.text();
      setSvgContent(text);
      setFileName("tiger");
      setActiveId(null);
      setError(null);
    } catch (err) {
      setError("Failed to load example.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderSvgToDataUrl = useCallback((content: string) => {
    return new Promise<{ dataUrl: string; fileSize: string }>((resolve, reject) => {
      const lowerContent = content.toLowerCase();
      const svgStart = lowerContent.indexOf("<svg");

      if (svgStart === -1) {
        reject(new Error("No <svg> tag found."));
        return;
      }

      const blob = new Blob([content], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const aspectRatio = img.width / img.height;
        const finalWidth = width;
        let finalHeight = height;
        if (lockRatio && Number.isFinite(aspectRatio) && aspectRatio > 0) {
          finalHeight = Math.round(finalWidth / aspectRatio);
          if (Math.abs(finalHeight - height) > 1) {
            setHeight(finalHeight);
          }
        }

        const totalWidth = finalWidth + padding * 2;
        const totalHeight = finalHeight + padding * 2;

        canvas.width = totalWidth;
        canvas.height = totalHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Canvas not available."));
          return;
        }

        if (!isTransparent || format === "image/jpeg") {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, totalWidth, totalHeight);
        }

        ctx.drawImage(img, padding, padding, finalWidth, finalHeight);

        const qualityValue = Math.min(100, Math.max(1, quality)) / 100;
        const dataUrl =
          format === "image/png"
            ? canvas.toDataURL(format)
            : canvas.toDataURL(format, qualityValue);
        const head = "data:" + format + ";base64,";
        const size = Math.round((dataUrl.length - head.length) * 3 / 4);
        const displaySize = (size / 1024).toFixed(2) + " KB";

        URL.revokeObjectURL(url);
        resolve({ dataUrl, fileSize: displaySize });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to render SVG. Syntax might be invalid."));
      };
      img.src = url;
    });
  }, [bgColor, format, isTransparent, padding, width, height, quality, lockRatio]);

  // Convert Logic
  const convertSvg = useCallback(() => {
    if (!svgContent.trim()) {
      setPreviewUrl(null);
      setFileSize("");
      return;
    }

    renderSvgToDataUrl(svgContent)
      .then(({ dataUrl, fileSize: size }) => {
        setPreviewUrl(dataUrl);
        setFileSize(size);
        if (activeId) {
          setQueue((prev) =>
            prev.map((item) =>
              item.id === activeId
                ? { ...item, previewUrl: dataUrl, fileSize: size, status: "done", outputFormat: format }
                : item
            )
          );
        }
      })
      .catch((err: Error) => {
        if (svgContent.length > 20) setError(err.message);
      });
  }, [svgContent, renderSvgToDataUrl, activeId, format]);

  // Effect to trigger conversion
  useEffect(() => {
    const timer = setTimeout(() => {
      convertSvg();
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [convertSvg]);

  useEffect(() => {
    if (format !== "image/png") {
      setIsTransparent(false);
      if (backgroundPreset === "transparent") {
        setBackgroundPreset("white");
        setBgColor("#ffffff");
      }
    }
  }, [format, backgroundPreset]);

  useEffect(() => {
    if (!svgContent.trim()) return;
    const size = extractSizeFromSvg(svgContent);
    if (!size) return;
    const ratio = size.width / size.height;
    if (!Number.isFinite(ratio) || ratio <= 0) return;
    setIntrinsicRatio(ratio);
    setIntrinsicWidth(size.width);
    setScaleBaseWidth(size.width);
    if (lockRatio) {
      setHeight(Math.round(width / ratio));
    }
  }, [svgContent, lockRatio, width]);

  const getExtension = (value: OutputFormat) => {
    if (value === "image/jpeg") return "jpg";
    if (value === "image/webp") return "webp";
    return "png";
  };


  const copyToClipboard = async () => {
    if (!previewUrl) return;
    try {
      // We copy the Data URL or the Image Blob?
      // Usually users want the image itself in clipboard or the base64 string.
      // Let's do base64 string for now as it's easier for web usage,
      // BUT for an image tool, copying the *Image* to clipboard is more "Pro".
      
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback to copying Data URL text
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const setActiveItem = (item: QueueItem) => {
    setActiveId(item.id);
    setSvgContent(item.svgContent);
    setFileName(item.name);
    setPreviewUrl(item.previewUrl ?? null);
    setFileSize(item.fileSize ?? "");
    setScalePreset(null);
    setScaleBaseWidth(null);
    setError(null);
  };

  const addEditorToQueue = () => {
    if (!svgContent.trim()) return;
    const name = getUniqueName(fileName || "image");
    addQueueItem(name, svgContent);
  };

  const removeQueueItem = (id: string) => {
    setQueue((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (activeId === id) {
        const nextActive = next[0];
        if (nextActive) {
          setActiveId(nextActive.id);
          setSvgContent(nextActive.svgContent);
          setFileName(nextActive.name);
          setPreviewUrl(nextActive.previewUrl ?? null);
          setFileSize(nextActive.fileSize ?? "");
        } else {
          setActiveId(null);
          setSvgContent("");
          setFileName("image");
          setPreviewUrl(null);
          setFileSize("");
        }
      }
      return next;
    });
  };

  const convertAll = async () => {
    if (!queue.length) return;
    setIsBatchProcessing(true);
    const items = queue.slice();
    for (const item of items) {
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "processing", error: undefined } : q))
      );
      try {
        const result = await renderSvgToDataUrl(item.svgContent);
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: "done", previewUrl: result.dataUrl, fileSize: result.fileSize, outputFormat: format }
              : q
          )
        );
        if (activeId === item.id) {
          setPreviewUrl(result.dataUrl);
          setFileSize(result.fileSize);
        }
      } catch (err) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: "error", error: "Failed to render SVG." }
              : q
          )
        );
      }
    }
    setIsBatchProcessing(false);
  };

  const downloadZip = async () => {
    if (!queue.length) return;
    const ready = queue.filter((item) => item.previewUrl);
    if (!ready.length) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const item of ready) {
        const res = await fetch(item.previewUrl as string);
        const blob = await res.blob();
        const ext = getExtension(item.outputFormat ?? format);
        zip.file(`${item.name}.${ext}`, blob);
      }
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "svg-exports.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Settings */}
        <div className={cn("lg:col-span-6 space-y-6", !showPreview && "lg:col-span-12")}>
          
          {/* Input Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <button
                onClick={() => setInputTab("upload")}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
                  inputTab === "upload"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Upload
              </button>
              <button
                onClick={() => setInputTab("code")}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
                  inputTab === "code"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                SVG Code
              </button>
            </div>

            {inputTab === "upload" ? (
              <div
                className={cn(
                  "relative group border-2 border-dashed transition-all duration-200 ease-in-out p-10 md:p-12 text-center cursor-pointer min-h-[220px] flex items-center justify-center",
                  isDragging 
                    ? "border-blue-500 bg-blue-50/70 scale-[1.02] shadow-lg shadow-blue-500/10" 
                    : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/70 bg-white"
                )}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept=".svg" 
                  multiple
                  className="hidden" 
                  onChange={onFileSelect}
                />
                
                <div className="flex flex-col items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-base font-semibold text-slate-900">Click to upload or drag & drop</p>
                    <p className="text-sm text-slate-500">Multiple files supported • SVG only</p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-sm font-semibold px-5 py-2 shadow-md shadow-blue-600/20">
                    Choose SVG Files
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInputTab("code");
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="text-xs text-slate-500 hover:text-slate-700 font-medium underline"
                  >
                    Paste SVG code instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white">
                <div className="px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    Paste SVG code below
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); addEditorToQueue(); }}
                      className="text-xs text-slate-600 hover:text-slate-800 font-medium hover:underline disabled:opacity-50"
                      disabled={!svgContent.trim()}
                    >
                      Add to Queue
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); loadExample(); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Load Example
                    </button>
                  </div>
                </div>
                <textarea
                  value={svgContent}
                  onChange={(e) => {
                    setSvgContent(e.target.value);
                    if (activeId) {
                      setQueue((prev) =>
                        prev.map((item) =>
                          item.id === activeId
                            ? { ...item, svgContent: e.target.value, status: "pending", previewUrl: undefined, fileSize: undefined }
                            : item
                        )
                      );
                    }
                  }}
                  placeholder="<svg>...</svg>"
                  className="w-full h-52 p-4 text-xs font-mono text-slate-600 resize-none focus:outline-none focus:bg-slate-50 transition-colors"
                  spellCheck={false}
                />
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
                <Settings2 className="w-4 h-4" />
                Export Settings
              </div>
              <button
                type="button"
                onClick={() => setPreviewVisible((prev) => !prev)}
                disabled={!previewUrl}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all",
                  previewUrl
                    ? "border-slate-200 text-slate-600 hover:text-slate-800 hover:border-slate-300"
                    : "border-slate-100 text-slate-300 cursor-not-allowed"
                )}
              >
                {previewVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {previewVisible ? "Hide preview" : "Show preview"}
              </button>
            </div>

            {/* Core Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Scale</label>
                <select
                  value={scalePreset ?? 1}
                  onChange={(e) => {
                    const scale = Number(e.target.value) as 1 | 2 | 3 | 4;
                    const ratio = intrinsicRatio ?? null;
                    const baseWidth =
                      scaleBaseWidth ??
                      intrinsicWidth ??
                      (scalePreset ? Math.round(width / scalePreset) : width);
                    setScaleBaseWidth(baseWidth);
                    const nextWidth = Math.round(baseWidth * scale);
                    setScalePreset(scale);
                    setWidth(nextWidth);
                    if (ratio) {
                      setHeight(Math.round(nextWidth / ratio));
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  <option value={1}>Original</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                  <option value={4}>4x</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Background</label>
                <select
                  value={backgroundPreset}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "transparent") {
                      if (format === "image/png") {
                        setIsTransparent(true);
                        setBackgroundPreset("transparent");
                      }
                      return;
                    }
                    setIsTransparent(false);
                    setBackgroundPreset(value as "white" | "black" | "gray");
                    if (value === "white") setBgColor("#ffffff");
                    if (value === "black") setBgColor("#000000");
                    if (value === "gray") setBgColor("#f1f5f9");
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                >
                  {format === "image/png" && <option value="transparent">Transparent</option>}
                  <option value="white">White</option>
                  <option value="black">Black</option>
                  <option value="gray">Light Gray</option>
                </select>
              </div>
            </div>

            {!isTransparent && (
              <div className="flex items-center gap-3 p-2 border border-slate-200 rounded-lg bg-slate-50">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <span className="text-sm font-mono text-slate-600 uppercase">{bgColor}</span>
              </div>
            )}

          </div>

          {/* Advanced */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setAdvancedOpen((prev) => !prev)}
              className="w-full px-5 py-4 flex items-center justify-between text-slate-800 font-semibold text-sm cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-500 transition-transform",
                    advancedOpen && "rotate-180"
                  )}
                />
                Advanced Settings
              </span>
              <span className="text-xs text-slate-500">{advancedOpen ? "Expanded" : "Collapsed"}</span>
            </button>
            {advancedOpen && (
              <div className="px-5 pb-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => {
                        const next = Math.max(1, Number(e.target.value));
                        setWidth(next);
                        setScalePreset(null);
                        if (lockRatio && intrinsicRatio) {
                          setHeight(Math.round(next / intrinsicRatio));
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => {
                        const next = Math.max(1, Number(e.target.value));
                        setHeight(next);
                        setScalePreset(null);
                        if (lockRatio && intrinsicRatio) {
                          setWidth(Math.round(next * intrinsicRatio));
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lock Ratio</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-slate-600">{lockRatio ? "On" : "Off"}</span>
                    <div 
                      className={cn(
                        "w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out",
                        lockRatio ? "bg-blue-600" : "bg-slate-200"
                      )}
                      onClick={() => setLockRatio(!lockRatio)}
                    >
                      <div className={cn(
                        "absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-200",
                        lockRatio ? "translate-x-4" : "translate-x-0"
                      )} />
                    </div>
                  </label>
                </div>

                {(format === "image/jpeg" || format === "image/webp") && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Quality
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={60}
                        max={100}
                        step={1}
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                      <div className="text-xs font-semibold text-slate-600 w-12 text-right">
                        {quality}%
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Padding (px)</label>
                  <input
                    type="number"
                    value={padding}
                    onChange={(e) => setPadding(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Batch Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-5 py-4 flex items-center justify-between">
              <button
                onClick={() => setBatchOpen((prev) => !prev)}
                className="flex items-center gap-2 text-slate-800 font-semibold text-sm cursor-pointer"
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-500 transition-transform",
                    batchOpen && "rotate-180"
                  )}
                />
                Batch Queue {queue.length ? `(${queue.length})` : ""}
                <span className="text-[11px] font-medium text-slate-500">
                  {batchOpen ? "Expanded" : "Collapsed"}
                </span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={convertAll}
                  disabled={!queue.length || isBatchProcessing}
                  className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  {isBatchProcessing ? "Converting..." : "Convert All"}
                </button>
              </div>
            </div>
            {batchOpen && (
              <div className="px-5 pb-5">
                {!queue.length ? (
                  <div className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-3 border border-slate-100">
                    Drop multiple SVGs or add your pasted code to build a batch queue.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-auto pr-1">
                    <div className="space-y-2 pb-14">
                      {queue.map((item) => (
                      <div
                        key={item.id}
                        ref={(el) => {
                          queueRefs.current.set(item.id, el);
                        }}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs transition-colors",
                          activeId === item.id
                            ? "border-blue-200 bg-blue-50/60"
                            : "border-slate-100 bg-slate-50/50 hover:bg-white",
                          highlightId === item.id && "border-emerald-300 bg-emerald-50/70 shadow-sm"
                        )}
                      >
                        <button
                          onClick={() => setActiveItem(item)}
                          className="flex-1 text-left cursor-pointer"
                        >
                            <div className="font-medium text-slate-700 truncate">{item.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1",
                                  item.status === "done" && "text-green-600",
                                  item.status === "processing" && "text-blue-600",
                                  item.status === "error" && "text-red-600"
                                )}
                              >
                                <span className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  item.status === "pending" && "bg-slate-300",
                                  item.status === "processing" && "bg-blue-500",
                                  item.status === "done" && "bg-green-500",
                                  item.status === "error" && "bg-red-500"
                                )} />
                                {item.status === "pending" && "Pending"}
                                {item.status === "processing" && "Processing"}
                                {item.status === "done" && "Ready"}
                                {item.status === "error" && "Error"}
                              </span>
                              {item.fileSize && <span>{item.fileSize}</span>}
                            </div>
                          </button>
                          <div className="flex items-center gap-2">
                            {item.previewUrl && (
                            <a
                              href={item.previewUrl}
                              download={`${item.name}.${getExtension(item.outputFormat ?? format)}`}
                              className="text-slate-600 hover:text-slate-800 cursor-pointer"
                              title="Download"
                            >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                          <button
                            onClick={() => removeQueueItem(item.id)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="Remove"
                          >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm pt-3">
                      <div className="pt-1">
                        {readyItems.length <= 1 ? (
                          previewUrl ? (
                            <a
                              href={previewUrl}
                              download={`${fileName}.${getExtension(format)}`}
                              className="inline-flex w-full items-center justify-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
                            >
                              Download image
                            </a>
                          ) : (
                            <button
                              disabled
                              className="w-full text-xs font-semibold text-white bg-blue-600/60 px-4 py-2 rounded-lg cursor-not-allowed"
                            >
                              Convert to download
                            </button>
                          )
                        ) : (
                          <button
                            onClick={downloadZip}
                            disabled={readyItems.length < 2 || isZipping}
                            className="w-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            {isZipping ? "Zipping..." : `Download ZIP (${readyItems.length})`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Preview (only when available) */}
        {showPreview && (
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200/60 overflow-hidden relative flex flex-col min-h-[380px]">
              
              {/* Header / Toolbar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 pointer-events-none">
                <div className="pointer-events-auto bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600">
                  Preview
                </div>
                {previewUrl && fileSize && (
                  <div className="pointer-events-auto bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600">
                    {fileSize}
                  </div>
                )}
              </div>

              {/* Canvas Area */}
              <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
                <div className="relative shadow-xl shadow-slate-200/50 rounded-lg overflow-hidden ring-1 ring-slate-900/5 transition-all duration-300">
                  {/* Checkerboard background for transparency */}
                  <div 
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                    }} 
                  />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="relative z-10 max-w-full h-auto object-contain" />
                  ) : (
                    <>
                      <img src={lastPreviewUrl ?? ""} alt="" className="relative z-10 max-w-full h-auto object-contain opacity-0" />
                      <div className="relative z-10 text-xs font-medium text-slate-500 bg-white/80 border border-slate-200 rounded-lg px-3 py-2">
                        No preview yet. Convert this item to generate a preview.
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between gap-4">
                <div className="text-xs text-slate-400 font-medium px-2">
                  {fileName}.{getExtension(format)}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyToClipboard}
                    disabled={!previewUrl}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Image"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-6 py-3 rounded-full shadow-lg border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError(null)} className="ml-2 hover:bg-red-100 rounded-full p-1">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
