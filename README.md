# SVGConvert

A privacy-first SVG converter for exporting SVG files to PNG, JPG, and WebP directly in the browser.

SVGConvert is built with Next.js App Router, React, TypeScript, and Tailwind CSS. It is designed for fast client-side SVG rasterization, batch conversion, live previews, and SEO-friendly localized pages.

## Live Site

[https://svgconvert.app](https://svgconvert.app)

## Features

- Convert SVG to PNG, JPG, or WebP
- Upload SVG files or paste SVG source code
- Batch conversion with ZIP export
- Live preview before downloading
- Single-file save and delete actions
- Client-side processing with no server uploads
- Transparent background support for PNG and WebP
- Custom width, height, scale, padding, background, and quality options
- Localized pages with canonical URLs, hreflang, sitemap, robots, and JSON-LD metadata
- Open Graph and Twitter social preview image support

## Why This Project Exists

Many SVG conversion tools require uploading files to a remote server. SVGConvert keeps the conversion workflow in the browser so files stay on the user's device. This makes it useful for quick exports, UI assets, icons, diagrams, logos, and other SVG graphics that need raster output.

## Tech Stack

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JSZip](https://stuk.github.io/jszip/) for batch downloads
- [Vercel Analytics](https://vercel.com/analytics)

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## Environment Variables

Create a `.env.local` file for local development when needed.

```bash
NEXT_PUBLIC_SITE_URL=https://svgconvert.app
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### `NEXT_PUBLIC_SITE_URL`

Controls canonical URLs, sitemap entries, robots output, JSON-LD URLs, and social metadata.

Recommended production value:

```bash
NEXT_PUBLIC_SITE_URL=https://svgconvert.app
```

If this variable is not set, the app falls back to the default site URL configured in `lib/site.ts`.

### `NEXT_PUBLIC_GA_MEASUREMENT_ID`

Optional GA4 measurement ID. Analytics are disabled when this variable is not provided.

## SEO Assets

- `public/og-image.png` is the 1200 x 630 social sharing image used by Open Graph and Twitter metadata.
- `public/apple-touch-icon.png` is the 180 x 180 PNG icon used for Apple touch icon metadata.
- Legacy social image paths are redirected to `/og-image.png` in `next.config.ts`.

## Project Structure

```text
app/          Next.js App Router pages, layouts, sitemap, robots, and metadata routes
components/   Shared React components and the SVG converter UI
lib/          Site configuration, localization data, analytics, and utilities
public/       Static assets such as icons and social preview images
```

## Deployment

The app is ready to deploy on Vercel.

1. Import the repository into Vercel.
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
3. Optionally set `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. Deploy.

After deployment, verify:

- `/sitemap.xml`
- `/robots.txt`
- `/og-image.png`
- canonical and hreflang tags in page source
- Open Graph preview in social sharing validators

## Contributing

Contributions are welcome. Good areas for improvement include:

- Additional localization coverage
- Better SVG parsing edge cases
- UI accessibility improvements
- Export workflow enhancements
- Tests for conversion and metadata behavior

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

## License

This project is open source under the [MIT License](LICENSE).
