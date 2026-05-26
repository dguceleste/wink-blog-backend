import { Router } from 'express';
import {
  getPublicPosts,
  getAllPosts,
  getPostById,
  createPost,
  publishPost,
  deletePost,
} from '../controllers/postsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// ── Public routes ─────────────────────────────────────────────
// GET /api/posts          — list published posts (filter by ?hashtag=tag1,tag2)
router.get('/', getPublicPosts);

// ── Admin routes (require Authorization: Bearer <ADMIN_TOKEN>) ─
// GET /api/posts/all      — list all posts (any status)
router.get('/all', requireAuth, getAllPosts);

// GET /api/posts/:id      — single published post
router.get('/:id', getPostById);

// POST /api/posts         — create post (status=draft, author=Brian Fox)
router.post('/', requireAuth, createPost);

// PATCH /api/posts/:id/publish — publish a draft
router.patch('/:id/publish', requireAuth, publishPost);

// DELETE /api/posts/:id   — delete a post
router.delete('/:id', requireAuth, deletePost);

export default router;
