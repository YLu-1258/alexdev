import React, { useState } from "react";
import { FiFolder, FiFolderMinus, FiFolderPlus, FiFileText, FiExternalLink } from "react-icons/fi";
import "./css/FileTree.css";

type TreeNode =
  | {
      type: "folder";
      name: string;
      children: TreeNode[];
    }
  | {
      type: "file";
      name: string;
      href: string;
      download?: boolean;
    };

const tree: TreeNode[] = [
  {
    type: "folder",
    name: "Links",
    children: [
      {
        type: "file",
        name: "My Blog",
        href: "https://blog.alexlu.us",
      },
      {
        type: "file",
        name: "Resume.pdf",
        href: "/downloads/AlexanderLu.pdf",
        download: true,
      },
    ],
  },
];

const Folder: React.FC<{ node: Extract<TreeNode, { type: "folder" }> }> = ({ node }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="tree-node">
      <div className="tree-item folder" onClick={() => setOpen(!open)}>
        {open ? <FiFolderMinus /> : <FiFolderPlus />}
        <span>{node.name}</span>
      </div>

      {open && (
        <div className="tree-children">
          {node.children.map((child, i) =>
            child.type === "folder" ? (
              <Folder key={i} node={child} />
            ) : (
              <File key={i} node={child} />
            )
          )}
        </div>
      )}
    </div>
  );
};

const File: React.FC<{ node: Extract<TreeNode, { type: "file" }> }> = ({ node }) => {
  return (
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
};

const FileTree: React.FC = () => {
  return (
    <div className="file-tree">
      {tree.map((node, i) =>
        node.type === "folder" ? <Folder key={i} node={node} /> : null
      )}
    </div>
  );
};

export default FileTree;
