import { Router } from 'express';
import { templatesRouter } from './templates';
import { categoriesRouter } from './categories';
import { tagsRouter } from './tags';
import { labelsRouter } from './labels';

const router = Router();

// Admin authentication middleware
const requireAdmin = (req: any, res: any, next: any) => {
  // Check if user is logged in and has admin role
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.user.role === 'admin') {
    return next();
  }
  // For development purposes, we'll allow access if NODE_ENV is not production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Warning: Admin authentication is disabled in development mode');
    return next();
  }
  // In production, require admin authentication
  return res.status(403).json({ error: 'Forbidden: Admin access required' });
};

// Apply admin middleware to all admin routes
router.use(requireAdmin);

// Register admin routes
router.use('/templates', templatesRouter);
router.use('/categories', categoriesRouter);
router.use('/tags', tagsRouter);
router.use('/labels', labelsRouter);

export default router;