import { allPosts } from "./loadPosts";

export default function BlogIndex({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ marginTop: 0 }}>Blog</h2>
      <div style={{ display: "grid", gap: 10 }}>
        {allPosts.map(p => (
          <div
            key={p.slug}
            onClick={() => onOpen(p.slug)}
            style={{
              cursor: "pointer",
              padding: 12,
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div style={{ fontSize: 16, color: "#e6e6e6" }}>{p.title}</div>
            <div style={{ fontSize: 13, color: "#9aa0a6" }}>
              {p.date}{p.description ? ` • ${p.description}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}