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
  skillTags?: string[];
  body: string;
};

const HIDDEN_SUFFIX = /\s*<hidden>\s*$/i;

function parseTags(raw: unknown): { tags?: string[]; skillTags?: string[] } {
  if (!Array.isArray(raw)) return {};

  const parsed = raw
    .map((tag) => String(tag))
    .map((tag) => ({
      hidden: HIDDEN_SUFFIX.test(tag),
      value: tag.replace(HIDDEN_SUFFIX, "").trim(),
    }))
    .filter((tag) => tag.value.length > 0);

  return {
    tags: parsed.length > 0 ? parsed.map((tag) => tag.value) : undefined,
    skillTags: parsed.some((tag) => !tag.hidden)
      ? parsed.filter((tag) => !tag.hidden).map((tag) => tag.value)
      : undefined,
  };
}

const modules = import.meta.glob("../**/*.md", { as: "raw", eager: true });
console.log("glob keys:", Object.entries(modules));

export const allPosts: BlogPost[] = Object.entries(modules).map(([path, raw]) => {
  const slug = path.split("/").pop()!.replace(".md", "");
  const { data, content } = matter(String(raw));
  const parsedTags = parseTags(data.tags);

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    author: data.author ? String(data.author) : undefined,
    description: data.description ? String(data.description) : undefined,
    tags: parsedTags.tags,
    skillTags: parsedTags.skillTags,
    body: content,
  };
}).sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug: string) => allPosts.find(p => p.slug === slug);

