import { SvgConverter } from "@/components/SvgConverter";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

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
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
            Transform your SVG <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              into Pixel Perfect Images
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Convert SVG vectors to high-quality PNG or JPEG instantly. 
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

      </main>

      <footer className="text-center text-slate-400 text-sm py-8 border-t border-slate-200/50 mt-20">
        <p>© {new Date().getFullYear()} SVG Converter. Built with Next.js & Tailwind CSS.</p>
      </footer>
    </div>
  );
}