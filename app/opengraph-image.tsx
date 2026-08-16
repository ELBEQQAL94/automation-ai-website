// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

export const alt = "Automatoro - AI-Powered Process Automation";
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
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            marginBottom: 32,
            background: "linear-gradient(135deg, #10b981 0%, #4edea3 100%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#e5e2e1" }}>
          Automatoro
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#bbcabf", marginTop: 12 }}>
          Eliminate manual busywork. Automatically.
        </div>
      </div>
    ),
    { ...size }
  );
}
