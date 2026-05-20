export const svgExamples = [
  {
    name: "Gradient Badge",
    nameZh: "渐变徽章",
    slug: "gradient-badge",
    markup: `<svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="badge-bg" x1="40" y1="32" x2="280" y2="288" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0F766E"/>
      <stop offset="1" stop-color="#14B8A6"/>
    </linearGradient>
    <linearGradient id="badge-wave" x1="32" y1="176" x2="288" y2="112" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F97316" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#FACC15" stop-opacity="0.95"/>
    </linearGradient>
  </defs>
  <rect x="24" y="24" width="272" height="272" rx="72" fill="url(#badge-bg)"/>
  <path d="M48 194C82 166 118 150 160 150C202 150 238 166 272 194V240C239 214 202 200 160 200C118 200 81 214 48 240V194Z" fill="url(#badge-wave)"/>
  <circle cx="160" cy="126" r="56" fill="white" fill-opacity="0.14"/>
  <path d="M123 101H158C182 101 197 114 197 136C197 157 182 171 158 171H145V219H123V101ZM145 118V154H157C170 154 175 147 175 136C175 125 170 118 157 118H145Z" fill="white"/>
</svg>`,
  },
  {
    name: "Stats Panel",
    nameZh: "数据面板",
    slug: "stats-panel",
    markup: `<svg width="520" height="340" viewBox="0 0 520 340" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="520" height="340" rx="28" fill="#F8FAFC"/>
  <rect x="26" y="26" width="468" height="288" rx="22" fill="white"/>
  <rect x="52" y="64" width="122" height="88" rx="18" fill="#0F172A"/>
  <rect x="190" y="64" width="122" height="88" rx="18" fill="#EEF2FF"/>
  <rect x="328" y="64" width="140" height="88" rx="18" fill="#ECFDF5"/>
  <path d="M72 240L137 188L190 210L254 142L308 169L370 108L440 128" stroke="#0F766E" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="137" cy="188" r="10" fill="#F97316"/>
  <circle cx="254" cy="142" r="10" fill="#F97316"/>
  <circle cx="370" cy="108" r="10" fill="#F97316"/>
  <rect x="72" y="92" width="58" height="12" rx="6" fill="#334155"/>
  <rect x="72" y="114" width="78" height="12" rx="6" fill="#334155"/>
  <rect x="208" y="92" width="54" height="12" rx="6" fill="#4338CA"/>
  <rect x="208" y="114" width="74" height="12" rx="6" fill="#818CF8"/>
  <rect x="346" y="92" width="62" height="12" rx="6" fill="#047857"/>
  <rect x="346" y="114" width="48" height="12" rx="6" fill="#34D399"/>
</svg>`,
  },
  {
    name: "Orbit Mark",
    nameZh: "轨道图标",
    slug: "orbit-mark",
    markup: `<svg width="360" height="360" viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="360" rx="72" fill="#0B1324"/>
  <circle cx="180" cy="180" r="116" stroke="#1D4ED8" stroke-width="18" stroke-dasharray="560 140"/>
  <circle cx="180" cy="180" r="72" stroke="#14B8A6" stroke-width="18" stroke-dasharray="180 80"/>
  <circle cx="180" cy="180" r="22" fill="#F8FAFC"/>
  <circle cx="95" cy="111" r="16" fill="#F97316"/>
  <circle cx="255" cy="247" r="16" fill="#FACC15"/>
</svg>`,
  },
  {
    name: "Character Tile",
    nameZh: "人物卡片",
    slug: "character-tile",
    markup: `<svg width="360" height="420" viewBox="0 0 360 420" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="360" height="420" rx="42" fill="#FFF7ED"/>
  <ellipse cx="184" cy="352" rx="96" ry="24" fill="#FED7AA"/>
  <path d="M115 285C115 239.16 152.16 202 198 202C243.84 202 281 239.16 281 285V311H115V285Z" fill="#0F766E"/>
  <circle cx="182" cy="166" r="74" fill="#FDBA74"/>
  <path d="M125 157C125 120 152 87 187 87C224 87 254 117 254 154V168H125V157Z" fill="#1E293B"/>
  <circle cx="156" cy="168" r="8" fill="#0F172A"/>
  <circle cx="208" cy="168" r="8" fill="#0F172A"/>
  <path d="M154 208C166 222 198 224 214 208" stroke="#9A3412" stroke-width="8" stroke-linecap="round"/>
  <rect x="132" y="262" width="96" height="20" rx="10" fill="#CCFBF1"/>
  <rect x="244" y="258" width="48" height="64" rx="24" fill="#14B8A6"/>
  <rect x="78" y="258" width="48" height="64" rx="24" fill="#F97316"/>
</svg>`,
  },
] as const;
