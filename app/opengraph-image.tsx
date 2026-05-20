import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0f172a 0%, #14532d 42%, #f59e0b 100%)",
          color: "white",
          padding: "56px",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            borderRadius: 36,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: 40,
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 24,
                textTransform: "uppercase",
                letterSpacing: "0.24em",
                opacity: 0.85,
              }}
            >
              SVGConvert
            </div>
            <div
              style={{
                fontSize: 72,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: "-0.06em",
                maxWidth: 680,
              }}
            >
              SVG to PNG, JPG, and WebP in your browser.
            </div>
            <div
              style={{
                display: "flex",
                gap: 18,
                fontSize: 28,
                opacity: 0.92,
              }}
            >
              <span>100% client-side</span>
              <span>Batch ZIP export</span>
            </div>
          </div>

          <div
            style={{
              width: 320,
              borderRadius: 28,
              background: "rgba(255,255,255,0.14)",
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 22,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                opacity: 0.82,
              }}
            >
              Why it stands out
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                fontSize: 30,
                fontWeight: 600,
                lineHeight: 1.15,
              }}
            >
              <span>No uploads</span>
              <span>Live preview</span>
              <span>Multi-format export</span>
            </div>
            <div
              style={{
                marginTop: "auto",
                fontSize: 18,
                opacity: 0.82,
                lineHeight: 1.45,
              }}
            >
              {siteConfig.shortDescription}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
