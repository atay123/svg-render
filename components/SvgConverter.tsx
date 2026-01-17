"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Download, Copy, Check, RefreshCw, Image as ImageIcon, Settings2, X, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

type OutputFormat = "image/jpeg" | "image/png";

export function SvgConverter() {
  const [svgContent, setSvgContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("image");
  
  // Settings
  const [width, setWidth] = useState<number>(800);
  const [padding, setPadding] = useState<number>(0);
  const [format, setFormat] = useState<OutputFormat>("image/png");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [isTransparent, setIsTransparent] = useState<boolean>(true);

  // State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const file = e.dataTransfer.files[0];
    if (file && file.type === "image/svg+xml") {
      readFile(file);
    } else {
      setError("Please drop a valid SVG file.");
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSvgContent(e.target?.result as string);
      setFileName(file.name.replace(".svg", ""));
      setError(null);
    };
    reader.readAsText(file);
  };

  const loadExample = async () => {
    try {
      setIsProcessing(true);
      const res = await fetch("https://gist.githubusercontent.com/simonw/aedecb93564af13ac1596810d40cac3c/raw/83e7f3be5b65bba61124684700fa7925d37c36c3/tiger.svg");
      const text = await res.text();
      setSvgContent(text);
      setFileName("tiger");
      setError(null);
    } catch (err) {
      setError("Failed to load example.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Convert Logic
  const convertSvg = useCallback(() => {
    if (!svgContent.trim()) {
      setPreviewUrl(null);
      setFileSize("");
      return;
    }

    // Debounce is handled by useEffect deps, but for heavy lifting we might want more.
    // For now, let's just do it.
    
    const lowerContent = svgContent.toLowerCase();
    const svgStart = lowerContent.indexOf("<svg");
    
    if (svgStart === -1) {
       // Only show error if user has typed something substantial
       if (svgContent.length > 20) setError("No <svg> tag found.");
       return;
    }

    // Basic cleaning
    // We can rely on the browser's parser too
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Calculate aspect ratio
      const aspectRatio = img.width / img.height;
      const finalWidth = width;
      const finalHeight = Math.round(finalWidth / aspectRatio);

      const totalWidth = finalWidth + (padding * 2);
      const totalHeight = finalHeight + (padding * 2);

      canvas.width = totalWidth;
      canvas.height = totalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw Background
      if (!isTransparent || format === "image/jpeg") {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, totalWidth, totalHeight);
      }

      // Draw Image
      ctx.drawImage(img, padding, padding, finalWidth, finalHeight);

      // Export
      const dataUrl = canvas.toDataURL(format, 0.92);
      setPreviewUrl(dataUrl);
      
      // Calculate Size
      const head = "data:" + format + ";base64,";
      const size = Math.round((dataUrl.length - head.length) * 3 / 4);
      setFileSize((size / 1024).toFixed(2) + " KB");

      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError("Failed to render SVG. Syntax might be invalid.");
    };
    img.src = url;

  }, [svgContent, width, padding, format, bgColor, isTransparent]);

  // Effect to trigger conversion
  useEffect(() => {
    const timer = setTimeout(() => {
      convertSvg();
    }, 300); // 300ms debounce
    return () => clearTimeout(timer);
  }, [convertSvg]);

  // Transparent logic
  useEffect(() => {
    if (isTransparent) {
      setFormat("image/png");
    }
  }, [isTransparent]);

  useEffect(() => {
    if (format === "image/jpeg") {
      setIsTransparent(false);
    }
  }, [format]);


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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input & Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dropzone */}
          <div
            className={cn(
              "relative group rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out p-8 text-center cursor-pointer",
              isDragging 
                ? "border-blue-500 bg-blue-50/50 scale-[1.02]" 
                : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50 bg-white"
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
              className="hidden" 
              onChange={onFileSelect}
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">SVG files only</p>
              </div>
            </div>
          </div>

          {/* Text Area (Code) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                SVG Code
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); loadExample(); }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
              >
                Load Example
              </button>
            </div>
            <textarea
              value={svgContent}
              onChange={(e) => setSvgContent(e.target.value)}
              placeholder="<svg>...</svg>"
              className="w-full h-48 p-4 text-xs font-mono text-slate-600 resize-none focus:outline-none focus:bg-slate-50 transition-colors"
              spellCheck={false}
            />
          </div>

          {/* Settings Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Settings2 className="w-4 h-4" />
              Export Settings
            </div>

            {/* Format */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Format</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setFormat("image/png")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-all",
                    format === "image/png" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  PNG
                </button>
                <button
                  onClick={() => setFormat("image/jpeg")}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-all",
                    format === "image/jpeg" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  JPEG
                </button>
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Width (px)</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
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

            {/* Background */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Background</label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-slate-600">Transparent</span>
                  <div 
                    className={cn(
                      "w-9 h-5 rounded-full relative transition-colors duration-200 ease-in-out",
                      isTransparent ? "bg-blue-600" : "bg-slate-200"
                    )}
                    onClick={() => {
                      if (format === "image/jpeg") {
                         // JPEG cannot be transparent
                         return;
                      }
                      setIsTransparent(!isTransparent);
                    }}
                  >
                    <div className={cn(
                      "absolute top-1 left-1 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-200",
                      isTransparent ? "translate-x-4" : "translate-x-0"
                    )} />
                  </div>
                </label>
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

          </div>
        </div>

        {/* Right Column: Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200/60 overflow-hidden relative flex flex-col min-h-[500px]">
            
            {/* Header / Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 pointer-events-none">
              <div className="pointer-events-auto bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600">
                Preview
              </div>
              {fileSize && (
                <div className="pointer-events-auto bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/50 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600">
                  {fileSize}
                </div>
              )}
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
              {previewUrl ? (
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
                  <img src={previewUrl} alt="Preview" className="relative z-10 max-w-full h-auto object-contain" />
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-40">
                  <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No SVG loaded</p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between gap-4">
               <div className="text-xs text-slate-400 font-medium px-2">
                 {fileName}.{format.split('/')[1]}
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
                 
                 {previewUrl && (
                   <a
                     href={previewUrl}
                     download={`${fileName}.${format === "image/jpeg" ? "jpg" : "png"}`}
                     className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                   >
                     <Download className="w-4 h-4" />
                     Download
                   </a>
                 )}
               </div>
            </div>
          </div>
        </div>

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
