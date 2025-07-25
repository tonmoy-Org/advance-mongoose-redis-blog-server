import { Schema, model } from 'mongoose';
import { IBlog } from './blog/blog.interface';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    youtubeUrl: { type: String },
    title_id: { type: String, unique: true },
  },
  { timestamps: true }
);

// Create indexes
blogSchema.index({ title: 'text', content: 'text' });
blogSchema.index({ category: 1 });
blogSchema.index({ createdAt: -1 });

// Pre-save hook to generate title_id
blogSchema.pre<IBlog>('save', function (next) {
  if (!this.title_id) {
    this.title_id = this.title.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

export const Blog = model<IBlog>('Blog', blogSchema);