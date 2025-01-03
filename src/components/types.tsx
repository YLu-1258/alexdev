export interface Tab {
    id: string;
    title: string;
    type: 'blog' | 'about' | 'awards' | 'projects' | 'contact' | 'courses';
    content: React.ReactNode;
}

export interface Page {
    title: string;
    type: 'blog' | 'about' | 'awards' | 'projects' | 'contact' | 'courses';
    content: React.ReactNode;
}