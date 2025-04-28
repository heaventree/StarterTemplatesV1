import { Router } from 'express';
import templatesRouter from './templates';
import categoriesRouter from './categories';
import tagsRouter from './tags';

const router = Router();

// Admin authentication middleware
const requireAdmin = (req: any, res: any, next: any) => {
  // Check if user is logged in and has admin role
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.role === 'admin') {
    return next();
  }
  // For development purposes, we'll allow all access for now
  // In production, uncomment the line below and remove the next() line
  // return res.status(403).json({ error: 'Forbidden: Admin access required' });
  return next();
};

// Apply admin middleware to all admin routes
router.use(requireAdmin);

// Register admin routes
router.use('/templates', templatesRouter);
router.use('/categories', categoriesRouter);
router.use('/tags', tagsRouter);

export default router;