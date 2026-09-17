export interface Tab {
    id: string;
    title: string;
    type: 'blog' | 'about' | 'awards' | 'projects' | 'experience' | 'skills' | 'research' | 'courses';
    content: React.ReactNode;
    path?: string;
}

export interface Page {
    title: string;
    type: 'blog' | 'about' | 'awards' | 'projects' | 'experience' | 'skills' | 'research' | 'courses';
    content: React.ReactNode;
    path?: string;
}
