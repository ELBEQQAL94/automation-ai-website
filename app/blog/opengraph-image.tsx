// app/blog/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "Automatoro Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #131313 0%, #1c1b1b 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#10b981" }}>
          Automatoro
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#e5e2e1" }}>
          Blog
        </div>
      </div>
    ),
    { ...size }
  );
}
