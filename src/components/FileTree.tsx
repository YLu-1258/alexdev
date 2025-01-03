import React from 'react';
import './css/FileTree.css';

interface File {
    id: string;
    name: string;
    content: string;
}

interface FileTreeProps {
    onFileSelect: (file: File) => void;
}

const FileTree: React.FC<FileTreeProps> = ({  }) => {
    const files: File[] = [
        { id: '1', name: 'My Blog', content: "https://ylu-1258.github.io/YLU_blog/" },
    ];

    const handleFileClick = (content: string) => {
        window.open(content, '_blank'); // Redirects to the URL
    };

    return (
        <div className="filetree">
            {files.map(file => (
                <div
                    key={file.id}
                    className="file"
                    onClick={() => handleFileClick(file.content)}
                >
                    {file.name}
                </div>
            ))}
        </div>
    );
};

export default FileTree;
