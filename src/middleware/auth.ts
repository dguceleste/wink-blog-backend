import { Request, Response, NextFunction } from 'express';

/**
 * Simple token-based auth guard.
 * Protected routes require header:  Authorization: Bearer wink-admin-secret-token-2024
 * (no real auth system per spec — token is hardcoded in .env.example)
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const adminToken = process.env.ADMIN_TOKEN ?? 'wink-admin-secret-token-2024';

  if (token !== adminToken) {
    res.status(401).json({ success: false, message: 'Unauthorized — invalid or missing token' });
    return;
  }
  next();
};
