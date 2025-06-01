import React from 'react';
import './css/FileTree.css';

interface File {
    id: string;
    name: string;
    content: string;
}

interface FileTreeProps {
    onFileSelect?: (file: File) => void; // we’re not using this prop right now
}

const FileTree: React.FC<FileTreeProps> = ({ }) => {
    const files: File[] = [
        { id: '1', name: 'My Blog', content: "https://ylu-1258.github.io/YLU_blog/" },
        { id: '2', name: 'Resume', content: "/downloads/AlexanderLu.pdf" }
    ];

    return (
        <div className="filetree">
            {files.map(file => (
                file.name === 'Resume'
                    ? (
                        <div
                            key={file.id}
                            className="file"
                            
                        >
                            <a href={file.content} download> {file.name} </a>
                        </div>
                    )
                    : (
                        <div
                            key={file.id}
                            className="file"
                            onClick={() => window.open(file.content, '_blank')}
                        >
                            {file.name}
                        </div>
                    )
            ))}
        </div>
    );
};

export default FileTree;
