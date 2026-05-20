import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0f172a 0%, #14532d 42%, #f59e0b 100%)",
          padding: 56,
          color: "white",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            borderRadius: 36,
            padding: 42,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              opacity: 0.82,
            }}
          >
            SVGConvert
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "-0.06em",
              maxWidth: 840,
            }}
          >
            Private SVG exports with live preview and batch ZIP downloads.
          </div>
          <div
            style={{
              display: "flex",
              gap: 18,
              fontSize: 28,
              opacity: 0.9,
            }}
          >
            <span>PNG</span>
            <span>JPG</span>
            <span>WebP</span>
            <span>No server uploads</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
