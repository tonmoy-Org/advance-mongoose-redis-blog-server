import { Document } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    youtubeUrl?: string;
    title_id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBlogCreate {
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    youtubeUrl?: string;
}

export interface IBlogUpdate {
    title?: string;
    content?: string;
    imageUrl?: string;
    category?: string;
    youtubeUrl?: string | null;
}