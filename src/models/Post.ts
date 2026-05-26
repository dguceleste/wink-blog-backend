import { Schema, model, Document } from 'mongoose';

export type PostStatus = 'draft' | 'published';

export interface IPost extends Document {
  title: string;
  body: string;
  hashtags: string[];
  status: PostStatus;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 300 },
    body: { type: String, required: true },
    hashtags: { type: [String], default: [] },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: { type: String, default: 'Brian Fox', immutable: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Index for hashtag filtering
postSchema.index({ hashtags: 1 });
postSchema.index({ status: 1, publishedAt: -1 });

export const Post = model<IPost>('Post', postSchema);
