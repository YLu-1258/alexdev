import matter from "gray-matter";
import { Buffer } from "buffer";
(globalThis as any).Buffer = Buffer;

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author?: string;
  description?: string;
  tags?: string[];
  body: string;
};

const modules = import.meta.glob("../**/*.md", { as: "raw", eager: true });
console.log("glob keys:", Object.entries(modules));

export const allPosts: BlogPost[] = Object.entries(modules).map(([path, raw]) => {
  const slug = path.split("/").pop()!.replace(".md", "");
  const { data, content } = matter(String(raw));

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    author: data.author ? String(data.author) : undefined,
    description: data.description ? String(data.description) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    body: content,
  };
}).sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string) => allPosts.find(p => p.slug === slug);

