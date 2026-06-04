# SVGConvert

SVGConvert is a Next.js App Router application for converting SVG files to PNG, JPG, or WebP directly in the browser. Conversion runs client-side with canvas APIs, so uploaded SVG files are not sent to a server.

## Features

- SVG file upload and pasted SVG code workflows
- PNG, JPG, and WebP export formats
- Batch queue conversion with ZIP download
- Live preview and single-file save/delete actions
- Localized pages with canonical, hreflang, sitemap, robots, and JSON-LD metadata

## Development

```bash
npm run dev
```

Open http://localhost:3000 to view the local app.

## Production Build

```bash
npm run build
npm run start
```

## Linting

```bash
npm run lint
```

## Environment Variables

`NEXT_PUBLIC_SITE_URL` controls canonical URLs, sitemap entries, robots output, JSON-LD URLs, and social metadata. It defaults to `https://www.svgconvert.app` when unset.

```bash
NEXT_PUBLIC_SITE_URL=https://www.svgconvert.app
```

`NEXT_PUBLIC_GA_MEASUREMENT_ID` enables GA4 tracking when provided.

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## SEO Assets

- `public/og-image.png` is the 1200 x 630 social sharing image used by Open Graph and Twitter metadata.
- `public/apple-touch-icon.png` is the 180 x 180 PNG icon used for Apple touch icon metadata.
- Legacy social image paths are redirected to `/og-image.png` in `next.config.ts`.
