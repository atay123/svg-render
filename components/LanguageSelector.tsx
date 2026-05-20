"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";
import { type Locale, locales } from "@/lib/site";

export const languageNames: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  id: "Indonesia",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  nl: "Nederlands",
  pl: "Polski",
  pt: "Português",
  ru: "Русский",
  tr: "Türkçe",
  uk: "Українська",
  vi: "Tiếng Việt",
};

interface LanguageSelectorProps {
  currentLocale: Locale;
}

export function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedLocale: Locale) => {
    setIsOpen(false);
    const targetPath = selectedLocale === "en" ? "/" : `/${selectedLocale}`;
    router.push(targetPath);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#eb7d66]/20 active:scale-95"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 text-slate-500" />
        <span className="hidden sm:inline">{languageNames[currentLocale]}</span>
        <span className="sm:hidden">{currentLocale.toUpperCase()}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-100 bg-white/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 sm:w-80">
          <div className="grid grid-cols-2 gap-1 text-slate-700">
            {locales.map((loc) => {
              const isActive = loc === currentLocale;
              return (
                <button
                  key={loc}
                  onClick={() => handleSelect(loc)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors duration-150 hover:bg-[#f5f7fb] hover:text-[#eb7d66] ${
                    isActive ? "bg-blue-50/50 text-[#eb7d66] font-bold" : "text-slate-600"
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span>{languageNames[loc]}</span>
                  {isActive && <Check className="h-3.5 w-3.5 text-[#eb7d66]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
