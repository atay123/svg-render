import { SvgConverter } from "@/components/SvgConverter";
import { Sparkles, ShieldCheck, Zap, Settings2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 font-sans pb-20">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-60 animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[-100px] right-0 w-[800px] h-[600px] bg-indigo-400/10 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-60" />
      </div>

      <main className="container mx-auto px-4 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Privacy First • Client Side</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
            SVG to PNG & JPG <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Converter
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Transform SVG vectors into high-quality PNG or JPEG images instantly. 
            Adjust scaling, padding, and background color directly in your browser.
          </p>

          <div className="flex items-center justify-center gap-8 pt-4">
             <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
               <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                 <Zap className="w-4 h-4" />
               </div>
               Instant Render
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
               <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                 <ShieldCheck className="w-4 h-4" />
               </div>
               Secure & Private
             </div>
          </div>
        </div>

        {/* The Tool */}
        <SvgConverter />

        {/* SEO Content Section */}
        <section className="max-w-4xl mx-auto mt-24 space-y-16 text-slate-600">
          
          {/* How to Guide (Featured Snippet Target) */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">
              How to Convert SVG to PNG or JPG?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 pt-4">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">1</div>
                <h3 className="font-semibold text-slate-900 mb-2">Upload SVG</h3>
                <p className="text-sm leading-relaxed">Drag and drop your SVG file or paste the code directly into the editor.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">2</div>
                <h3 className="font-semibold text-slate-900 mb-2">Customize</h3>
                <p className="text-sm leading-relaxed">Adjust width, padding, and background color. Toggle transparency or choose a specific background.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">3</div>
                <h3 className="font-semibold text-slate-900 mb-2">Download</h3>
                <p className="text-sm leading-relaxed">Preview your image instantly and download as a high-quality PNG or JPEG file.</p>
              </div>
            </div>
          </div>

          {/* Features / Why Choose Us */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center">
              Why use this SVG Converter?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                <div className="w-10 h-10 shrink-0 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">100% Client-Side Privacy</h3>
                  <p className="text-sm">Your files never leave your device. All conversion happens locally in your browser, ensuring maximum security for your designs.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                <div className="w-10 h-10 shrink-0 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">High Resolution Output</h3>
                  <p className="text-sm">Scale your vectors to any size without losing quality. Perfect for high-DPI displays and print-ready assets.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                 <div className="w-10 h-10 shrink-0 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Smart Customization</h3>
                  <p className="text-sm">Add padding, change backgrounds, or force transparency. Essential tools for preparing icons and logos for production.</p>
                </div>
              </div>
               <div className="flex gap-4 p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                 <div className="w-10 h-10 shrink-0 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Developer Friendly</h3>
                  <p className="text-sm">Paste SVG code directly or load examples. Debug your SVG exports by visualizing them instantly in different formats.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ & Deep Content Section */}
          <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-slate-200/60">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">What is an SVG file?</h2>
              <p className="text-sm leading-relaxed">
                An <strong>SVG (Scalable Vector Graphics)</strong> is a unique image format that uses mathematical formulas to define shapes, lines, and colors. Unlike standard image formats like PNG or JPG, SVGs are <strong>resolution-independent</strong>, meaning they can be scaled to any size without losing quality or becoming pixelated. This makes them perfect for logos, icons, and web graphics.
              </p>
              <p className="text-sm leading-relaxed">
                However, many web platforms and social media sites don't support direct SVG uploads, which is why converting them to <strong>high-quality PNG or JPG</strong> is often necessary.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Is this SVG converter free to use?</h3>
                  <p className="text-xs">Yes, our SVG to PNG converter is 100% free with no hidden costs, no registration required, and no limits on the number of conversions.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Is it safe to convert my files here?</h3>
                  <p className="text-xs">Absolutely. Unlike other online tools, we process everything <strong>locally in your browser</strong>. Your SVG files and images are never uploaded to any server, ensuring complete privacy.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">Can I convert SVG to transparent PNG?</h3>
                  <p className="text-xs">Yes! Simply choose the PNG format and enable the "Transparent" background toggle in the export settings.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

      </main>

      <footer className="text-center text-slate-400 text-sm py-8 border-t border-slate-200/50 mt-20">
        <p>© {new Date().getFullYear()} SVG Converter. Built with Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}