import React from "react";
export function Sidenote({
  label,
  children,
}: {
  label?: string;
  children?: React.ReactNode;
}) {
  return (
    <span className="sidenote">
      <span className="sidenote-mark">{label ?? "note"}</span>
      <span className="sidenote-body">{children}</span>
    </span>
  );
}

export function Backlink({
  slug,
  text,
  onOpen,
}: {
  slug: string;
  text?: string;
  onOpen: (slug: string) => void;
}) {
  return (
    <span
      className="backlink"
      onClick={() => onOpen(slug)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(slug);
      }}
    >
      {text ?? "link"}
    </span>
  );
}

export function Admonition({
  type,
  title,
  children,
}: {
  type?: string;
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`admonition admonition-${type ?? "note"}`}>
      <div className="admonition-title">{title ?? "Note"}</div>
      <div className="admonition-body">{children}</div>
    </div>
  );
}
