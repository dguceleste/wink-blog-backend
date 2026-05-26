import { Request, Response } from 'express';
import { Post } from '../models/Post';

/**
 * GET /api/posts
 * Public — returns only published posts.
 * Query params: hashtag (optional, comma-separated or repeated)
 */
export const getPublicPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const hashtags = req.query.hashtag;
    const filter: Record<string, unknown> = { status: 'published' };

    if (hashtags) {
      const tagList = Array.isArray(hashtags)
        ? hashtags.map(String)
        : String(hashtags).split(',').map((t) => t.trim()).filter(Boolean);
      if (tagList.length > 0) filter.hashtags = { $in: tagList };
    }

    const posts = await Post.find(filter).sort({ publishedAt: -1 }).lean();
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /api/posts/all  (admin)
 * Returns all posts regardless of status.
 */
export const getAllPosts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /api/posts/:id
 * Returns a single post by id (public — only published).
 */
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findOne({ _id: req.params.id, status: 'published' }).lean();
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }
    res.json({ success: true, data: post });
  } catch {
    res.status(404).json({ success: false, message: 'Post not found' });
  }
};

/**
 * POST /api/posts  (admin)
 * Create a new post. Status defaults to "draft". Author is always "Brian Fox".
 * Body: { title, body, hashtags? }
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, body, hashtags } = req.body as {
      title?: string;
      body?: string;
      hashtags?: string[];
    };

    if (!title?.trim() || !body?.trim()) {
      res.status(400).json({ success: false, message: '"title" and "body" are required' });
      return;
    }

    const post = await Post.create({
      title: title.trim(),
      body: body.trim(),
      hashtags: Array.isArray(hashtags) ? hashtags.map(String) : [],
      status: 'draft',
      author: 'Brian Fox',
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * PATCH /api/posts/:id/publish  (admin)
 * Change post status from draft → published.
 */
export const publishPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }
    if (post.status === 'published') {
      res.status(400).json({ success: false, message: 'Post is already published' });
      return;
    }
    post.status = 'published';
    post.publishedAt = new Date();
    await post.save();
    res.json({ success: true, data: post });
  } catch {
    res.status(404).json({ success: false, message: 'Post not found' });
  }
};

/**
 * DELETE /api/posts/:id  (admin)
 * Hard-delete a post.
 */
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) { res.status(404).json({ success: false, message: 'Post not found' }); return; }
    res.json({ success: true, message: 'Post deleted' });
  } catch {
    res.status(404).json({ success: false, message: 'Post not found' });
  }
};
