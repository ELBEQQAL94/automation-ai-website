// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

export const alt = "Automatoro Blog Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Automatoro Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #131313 0%, #1c1b1b 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: "#10b981" }}>
          Automatoro
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#e5e2e1", lineHeight: 1.2 }}>
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
