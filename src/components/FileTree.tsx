import React, { useState } from "react";
import { FiFolderMinus, FiFolderPlus, FiFileText, FiExternalLink } from "react-icons/fi";
import "./css/FileTree.css";

interface FileTreeProps {
  handleCreateBlog: (slug: string) => void;
}

type TreeNode =
  | {
      type: "folder";
      name: string;
      children: TreeNode[];
    }
  | {
      type: "blog";
      name: string;
      slug: string;
    }
  | {
      type: "external";
      name: string;
      href: string;
      download?: boolean;
    };


const blogModules = import.meta.glob("../blog/**/*.md", { as: "raw", eager: true });

function insertPath(root: TreeNode[], parts: string[], slug: string) {
  let cur = root;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (isLast) {
      cur.push({ type: "blog", name: part.replace(/\.md$/i, ""), slug });
      return;
    }

    let folder = cur.find(
      (n): n is Extract<TreeNode, { type: "folder" }> => n.type === "folder" && n.name === part
    );

    if (!folder) {
      folder = { type: "folder", name: part, children: [] };
      cur.push(folder);
    }
    cur = folder.children;
  }
}

const BlogFile = ({ node, onOpen }: any) => (
  <div className="tree-item file" onClick={() => onOpen(node.slug)}>
    <FiFileText />
    <span>{node.name}</span>
  </div>
);

const ExternalFile = ({ node }: any) => (
  <div className="tree-item file">
    <FiFileText />
    <a
      href={node.href}
      target={node.download ? "_self" : "_blank"}
      rel="noreferrer"
      download={node.download}
    >
      {node.name}
    </a>
    {!node.download && <FiExternalLink className="external" />}
  </div>
);


function buildBlogTree(): TreeNode[] {
  const root: TreeNode[] = [];

  Object.keys(blogModules).forEach((path) => {
    // path like "../blog/2025/winter/hello.md"
    const rel = path.replace("../blog/", "");
    const parts = rel.split("/"); // ["2025","winter","hello.md"]
    const slug = rel.replace(/\.md$/i, ""); // "2025/winter/hello"

    insertPath(root, parts, slug);
  });

  // optional: sort folders first, then files
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.type === "folder" && sortNodes(n.children));
  };
  sortNodes(root);

  return root;
}


const tree: TreeNode[] = [
  {
    type: "folder",
    name: "Links",
    children: [
      {
        type: "external",
        name: "My Blog",
        href: "https://blog.alexlu.us",
      },
      {
        type: "external",
        name: "Resume.pdf",
        href: "/downloads/AlexanderLu.pdf",
        download: true,
      },
      {
        type: "folder",
        name: "Class Notes",
        children: [
          {
            type: "external",
            name: "CS170 - Fall 2025",
            href: "downloads/Class Notes/CS170.pdf",
            download: true,
          },
          {
            type: "external",
            name: "MATH110 - Fall 2025",
            href: "downloads/Class Notes/MATH110.pdf",
            download: true,
          },
          {
            type: "external",
            name: "EECS126 - Fall 2025",
            href: "downloads/Class Notes/Stochastic Processes.pdf",
            download: true,
          }
        ]
      }
    ],
  },
  {
    type: "folder",
    name: "Blog Posts",
    children: buildBlogTree(), // returns type: "blog"
  },
];

const Folder: React.FC<{
  node: Extract<TreeNode, { type: "folder" }>;
  onOpen: (slug: string) => void;
}> = ({ node, onOpen }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="tree-node">
      <div className="tree-item folder" onClick={() => setOpen(!open)}>
        {open ? <FiFolderMinus /> : <FiFolderPlus />}
        <span>{node.name}</span>
      </div>

      {open && (
        <div className="tree-children">
          {node.children.map((child, i) => {
            if (child.type === "folder") {
                return <Folder key={i} node={child} onOpen={onOpen} />;
            }
            if (child.type === "blog") {
                return <BlogFile key={i} node={child} onOpen={onOpen} />;
            }
            return <ExternalFile key={i} node={child} />;
          })}
        </div>
      )}
    </div>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ handleCreateBlog }) => {
  return (
    <div className="file-tree">
      {tree.map((node, i) =>
        node.type === "folder" ? (
          <Folder key={i} node={node} onOpen={handleCreateBlog} />
        ) : null
      )}
    </div>
  );
};

export default FileTree;
