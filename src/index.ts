import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import postsRouter from './routes/posts';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────
app.use('/api/posts', postsRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Start ─────────────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
