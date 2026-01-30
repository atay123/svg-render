# 会话总结（SVG 转换器）

## 背景
- 项目：svgconvert.app（Next.js + Tailwind）
- 目标：优化 UX/UI，贴近头部竞品（isvgtopng.com），提升 SEO 与可用性。
- 重点：流程简化、批量能力、WebP、缩放、背景预设、ZIP 打包。

## 竞品要点（isvgtopng.com）
- 顶部流程清晰：上传 → 格式 → 缩放 → 背景 → 转换
- UI 简洁，进阶设置下沉
- 强调本地处理与隐私

## 已实现改动（高层）
- 批量队列 + Convert All + 单项下载
- ZIP 下载（JSZip）
- WebP 支持 + 质量滑条（Advanced）
- 缩放预设 + 宽高输入 + 锁定比例
- 背景预设 + 颜色选择；透明仅 PNG
- 结构优化：主要设置集中，Advanced/Batch 可折叠
- 预览仅在有输出时显示；无预览时左侧全宽

## 当前交互与结构
1) Upload / SVG Code tab（同一卡片）
2) Export Settings（格式/缩放/背景）
3) Advanced Settings（默认收起）
4) Batch Queue（默认展开）
5) Preview 面板（可隐藏/显示）

## 下载与按钮逻辑
- 单个 ready：按钮显示 “Download image”
- 多个 ready：按钮显示 “Download ZIP (n)”
- 无输出：按钮显示 “Convert to download”
- 下载按钮在队列滚动时 sticky 固定

## 新增优化（本轮）
- Advanced/Batch 标题加入展开指示（Chevron + Expanded/Collapsed 文案）
- 批量队列默认展开
- 预览面板支持隐藏/显示开关
- 修复点击未转换条目导致预览面板闪动（使用 lastPreviewUrl 保持布局）
- 交互区域统一加 cursor-pointer（折叠按钮、下载、删除等）

## 已解决问题
- 缩放预设叠加错误（4x → 3x）
- “Paste SVG code instead” 触发文件选择问题
- 预览区重复下载按钮清理

## 涉及文件
- components/SvgConverter.tsx（主要 UI/逻辑）
- app/page.tsx（文案与 FAQ）
- package.json / package-lock.json（JSZip）

## TODO / 可选优化
- 折叠状态记忆（localStorage）
- 队列项 hover 提示“下载该项”
- 列表滚动时高亮/自动滚动到最新完成项
- 预览面板可折叠时提示/空态视觉
- 下载按钮文案中文化与统一
