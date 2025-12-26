import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import { Sidenote, Backlink, Admonition } from "./ShortCodes";
import type { BlogPost } from "./loadPosts";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // pick any theme
import "./blog.css";

function preprocessShortcodes(md: string) {
  // {{< sidenote "label" >}} body {{< /sidenote >}}
  md = md.replace(
    /\{\{<\s*sidenote\s+"([^"]+)"\s*>\}\}([\s\S]*?)\{\{<\s*\/sidenote\s*>\}\}/g,
    (_m, label, body) => `<sidenote label="${label}">${body}</sidenote>`
  );

  md = md.replace(
    /\{\{<\s*backlink\s+"([^"]+)"\s+"([^"]+)"\s*>\}\}/g,
    (_m, slug, text) =>
      `<backlink slug="${slug}" text="${text}"></backlink>`
  );

  md = md.replace(
    /\{\{<\s*admonition\s+type="([^"]+)"\s+title="([^"]+)"\s*>\}\}([\s\S]*?)\{\{<\s*\/admonition\s*>\}\}/g,
    (_m, type, title, body) =>
      `<admonition type="${type}" title="${title}">${body}</admonition>`
  );

  return md;
}


export default function BlogPostView({
  post,
  onOpenBlog,
}: {
  post: BlogPost;
  onOpenBlog: (slug: string) => void;
}) {
  const body = preprocessShortcodes(post.body);

  return (
    <div className="blog-wrap">
      <header className="blog-header">
        <div className="blog-kicker">Blog</div>

        <h1 className="blog-title">{post.title}</h1>

        {post.description ? <p className="blog-desc">{post.description}</p> : null}

        <div className="blog-meta">
          <span className="blog-date">{post.date}</span>
          {post.author ? <span className="blog-author"> • {post.author}</span> : null}
        </div>

        {post.tags?.length ? (
          <div className="blog-tags">
            {post.tags.map((t) => (
              <span key={t} className="blog-tag">{t}</span>
            ))}
          </div>
        ) : null}
      </header>
      <article className="blog-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}
          components={
            {
              img: (props: any) => (
                <img {...props} className="md-img" loading="lazy" decoding="async" />
              ),
              sidenote: (props: any) => <Sidenote {...props} />,
              backlink: (props: any) => <Backlink {...props} onOpen={onOpenBlog} />,
              admonition: (props: any) => <Admonition {...props} />,
            } as any
          }
        >
          {body}
        </ReactMarkdown>
      </article>
    </div>
  );
}
