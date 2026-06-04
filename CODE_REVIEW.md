# 代码审查报告 — SVG Converter App

> 审查日期：2026-06-04
> 仓库：`atay123/svg-render` ↔ 本地 `svg-converter-app`
> 技术栈：Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 + TypeScript
> 对标产品：svgtopng.com

整体评价：项目结构清晰、纯客户端处理（隐私友好）、i18n（16 语言）+ 结构化数据（JSON-LD）做得不错，SEO 基础扎实。但存在 **几个会直接影响 SEO 与社交分享的真实 bug**，以及一些安全、性能、可访问性和可维护性方面的改进点。

---

## 🔴 P0 — 必须修复（影响线上 SEO / 分享 / 正确性）

### 1. 社交分享图（OG / Twitter）路径错误 → 线上 404
- **位置**：`app/(root)/layout.tsx:45,54`、`lib/site.ts:124,135`
- **问题**：metadata 中手动写死 `images: ["/opengraph-image.png"]` 和 `["/twitter-image.png"]`，但项目用的是 Next.js **文件约定动态路由** `app/opengraph-image.tsx` / `app/twitter-image.tsx`，构建产物路由是 `/opengraph-image` 和 `/twitter-image`（**没有 `.png` 后缀**）。
- **后果**：
  1. 手动指定的 `images` 会**覆盖**文件约定自动注入的标签，导致最终 `<meta property="og:image">` 指向不存在的 `/opengraph-image.png`（404）。
  2. 在 Twitter/X、Facebook、微信、Slack、飞书等平台分享时**封面图无法显示**。
- **修复**：删除 `metadata` 中手动的 `openGraph.images` 与 `twitter.images`，让 Next.js 通过文件约定自动注入正确的动态图地址（会自动带上 hash 与正确的绝对 URL）。

### 2. 站点域名可能配置错误 → canonical / sitemap / OG 全部指向错误域名
- **位置**：`lib/site.ts:22` `url: "https://www.svgconvert.app"`
- **问题**：该域名被用于 `metadataBase`、canonical、hreflang、sitemap、robots、JSON-LD `url`、OG `url`。如果 Vercel 实际部署域名 **不是** `www.svgconvert.app`，则：
  - canonical 指向别的域名 → 搜索引擎认为本站是副本，**不收录 / 权重流失**；
  - sitemap、hreflang 全部错误；
  - 这是 SEO 上**最致命**的一类错误。
- **待确认**：线上真实主域名是什么？（见文末"需要你确认"）。修复后建议改为读取 `process.env.NEXT_PUBLIC_SITE_URL`，避免硬编码。

### 3. 构建告警：`metadataBase` 未生效，社交图回退到 localhost
- **现象**：`npm run build` 输出
  `⚠ metadataBase property in metadata export is not set ... using "http://localhost:3000"`
- **问题**：动态 OG/Twitter 图片路由（`opengraph-image.tsx` / `twitter-image.tsx`）及 `/_not-found` 等位置未继承 `metadataBase`，导致生成的社交图绝对地址可能是 `http://localhost:3000/...`。
- **修复**：确保根 layout 的 `metadata.metadataBase` 始终存在（已设置，但告警仍在 → 与 #2 域名问题、`generateMetadata` 对非法 locale 返回 `{}`（丢失 metadataBase）有关）。建议在 `app/[locale]/page.tsx` 的 `generateMetadata` 非法分支也保留 `metadataBase`。

---

## 🟠 P1 — 高优先级（安全 / 明显体验问题）

### 4. 上传 SVG 内联渲染存在 XSS 风险
- **位置**：`components/SvgConverter.tsx:816` `dangerouslySetInnerHTML={{ __html: item.svgContent }}`
- **问题**：队列缩略图把用户上传的原始 SVG 直接以 innerHTML 注入 DOM。恶意 SVG 可携带 `<script>`、`<foreignObject>`、事件处理器（如 `onload`）、外链资源等。虽然纯前端工具主要是"自我 XSS"风险有限，但仍可被用于钓鱼/数据外传（SVG 内 `<image href="http://attacker...">` 会发起请求）。
- **对比**：真正的栅格化路径用的是 `Blob + <img>`（沙箱化、脚本不执行），是安全的；**只有缩略图预览这一处**用了 innerHTML。
- **修复建议**：缩略图也改用 `Blob URL + <img>`（与栅格化逻辑统一），或对 SVG 做净化（去除 `<script>` / 事件属性 / 外链）。统一后还能顺带消除重复逻辑。

### 5. 批量转换时缩略图永远不显示 "processing" 状态
- **位置**：`components/SvgConverter.tsx:486-510` `convertAll`
- **问题**：`convertAll` 直接在循环里同步算出结果再 `setItems`，从未把 item 置为 `"processing"`。卡片底部的 `processing` 分支（`857` 行附近）实际上是**死代码**，用户点 Convert 后没有逐项进度反馈。
- **修复**：转换前先把所有/当前 item 标记为 `processing`，逐个完成后更新；或至少在大批量时给出进度。

### 6. AUTO 模式下宽高显示值与实际导出值不一致
- **位置**：`SvgConverter.tsx:1087,1127`（显示 `?? 1200`）vs `getExportDimensions` 兜底 `512`（`254` 行）
- **问题**：当 SVG 无 `width/height/viewBox` 时，输入框 AUTO 显示 `1200/1200`，但实际导出按 `512×512`。用户看到的尺寸是错的。
- **修复**：统一兜底值（建议都用 `512`），或显示真实将导出的尺寸。

---

## 🟡 P2 — 中优先级（SEO / 可访问性 / 性能）

### 7. hreflang 缺少 `x-default`
- **位置**：`lib/site.ts:94-113`、`app/(root)/layout.tsx:17-37`
- **问题**：多语言站点未提供 `x-default`，Google 无法确定无匹配语言时的默认页。
- **修复**：在 `alternates.languages` 增加 `"x-default": "/"`。

### 8. 队列卡片不可键盘访问
- **位置**：`SvgConverter.tsx:771` 可点击 `<div onClick>` 选择文件，无 `role` / `tabIndex` / 键盘事件。
- **修复**：改为 `<button>` 或加 `role="button"` + `tabIndex={0}` + `onKeyDown`（Enter/Space）。

### 9. JSZip 应按需懒加载
- **位置**：`SvgConverter.tsx:5` 顶层 `import JSZip`
- **问题**：JSZip 体积不小（~95KB+），但只有点击 "Save All" 时才用得到，却被打进首屏主 bundle。
- **修复**：改为 `const JSZip = (await import("jszip")).default` 在 `saveAll` 内动态导入，减小首屏 JS。

### 10. 缺少安全响应头 / `next.config.ts` 为空
- **位置**：`next.config.ts`
- **问题**：未配置任何安全头。
- **修复建议**：增加 `poweredByHeader: false`，并通过 `headers()` 配置 `X-Content-Type-Options: nosniff`、`Referrer-Policy`、`X-Frame-Options: SAMEORIGIN`，可选 CSP（注意 GA/Vercel Analytics 内联脚本需放行）。

### 11. 每个语言页的 OG 图都是英文文案
- **位置**：`app/opengraph-image.tsx`（硬编码英文）
- **影响**：非英语用户分享时封面仍是英文。属锦上添花，可后置。

---

## 🟢 P3 — 低优先级（可维护性 / 健壮性）

### 12. metadata 配置重复（DRY）
- `alternates.languages` 这张映射表在 `app/(root)/layout.tsx` 和 `lib/site.ts` 各写了一份；`openGraph` 配置也大量重复。建议抽成一个共享常量/函数。

### 13. `parseIntrinsicSize` 对带单位/百分比尺寸处理不严谨
- `SvgConverter.tsx:76` `Number.parseFloat("100%")` → `100`，会把百分比当像素。`px` 能正确解析，但 `%`、`em` 等会误判。建议优先用 `viewBox`，或对带 `%` 的值忽略 width/height 改用 viewBox。

### 14. `getLocalText` 仅区分 zh / en
- `SvgConverter.tsx:160` 尺寸相关文案只有中英两种，其余 14 种语言会落到英文。与已有 16 语言 i18n 体系不一致，建议并入 `ConverterText` 类型集中管理。

### 15. README 仍是 create-next-app 默认模板
- 建议补充项目简介、部署、环境变量（`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_GA_MEASUREMENT_ID`）说明。

### 16. `app/icon.svg` 同时用作 `apple` 图标
- `app/(root)/layout.tsx:70` `apple: "/icon.svg"` —— iOS 不支持 SVG 作为 apple-touch-icon，建议提供 180×180 PNG。

---

## 执行计划（按优先级）

1. **P0-1** 删除手动 OG/Twitter `images`，启用文件约定动态图 ✅ 可立即改
2. **P0-2** 域名改为 `NEXT_PUBLIC_SITE_URL` 环境变量（**需确认线上域名**）
3. **P0-3** `generateMetadata` 非法分支保留 `metadataBase`
4. **P1-4** 缩略图改用 Blob URL（消除 XSS + 复用逻辑）
5. **P1-5** 批量转换补 `processing` 状态
6. **P1-6** 统一 AUTO 兜底尺寸
7. **P2-7** 加 `x-default`
8. **P2-8** 队列卡片键盘可访问
9. **P2-9** JSZip 懒加载
10. **P2-10** 安全头 + `poweredByHeader: false`
11. **P3** 视情况清理重复配置、解析健壮性、README

---

## ❓ 需要你确认
1. **线上真实主域名是什么？**（`svgconvert.app`？`svgtopng.*`？还是 Vercel 默认 `*.vercel.app`？）—— 这直接决定 canonical/sitemap/OG 是否正确，是 SEO 最关键一项。
2. 是否已配置 `NEXT_PUBLIC_GA_MEASUREMENT_ID`（GA4）环境变量？
</content>
</invoke>
