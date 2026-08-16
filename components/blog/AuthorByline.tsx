// components/blog/AuthorByline.tsx
import Image from "next/image";
import { getAuthor } from "@/lib/authors";

export default function AuthorByline({
  author,
  date,
  size = "md",
  linkable = false,
}: {
  author: string;
  date?: string;
  size?: "sm" | "md";
  /** Links the name to the author's LinkedIn. Only use where AuthorByline isn't already nested inside a <Link> (e.g. post card), since nested anchors are invalid HTML. */
  linkable?: boolean;
}) {
  const { name, avatar, linkedin } = getAuthor(author);
  const dimension = size === "sm" ? 24 : 32;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-surface-container"
        style={{ width: dimension, height: dimension }}
      >
        <Image
          src={avatar}
          alt={name}
          fill
          className="object-cover"
          sizes={`${dimension}px`}
          unoptimized
        />
      </div>
      <p className="text-sm text-on-surface-variant">
        by{" "}
        {linkable && linkedin ? (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface underline-offset-2 hover:text-primary hover:underline"
          >
            {name}
          </a>
        ) : (
          <span className="text-on-surface">{name}</span>
        )}
        {date && <> &middot; {date}</>}
      </p>
    </div>
  );
}
