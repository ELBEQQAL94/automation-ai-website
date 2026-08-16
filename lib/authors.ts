// lib/authors.ts
export type Author = {
  name: string;
  avatar: string;
  linkedin?: string;
};

const AUTHORS: Record<string, Author> = {
  "Youssef Elbeqqal": {
    name: "Youssef Elbeqqal",
    avatar: "/author/youssef-elbeqqal.webp",
    linkedin: "https://www.linkedin.com/in/youssef-el-beqqal-640b6917a/",
  },
};

const FALLBACK_AVATAR = "/blog/placeholder.svg";

export function getAuthor(name: string): Author {
  return AUTHORS[name] ?? { name, avatar: FALLBACK_AVATAR };
}
