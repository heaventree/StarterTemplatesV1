import { Router } from 'express';
import { db } from '../../db';
import { categories, insertCategorySchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const allCategories = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.displayOrder)]
    });
    res.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId)
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create a new category
router.post('/', async (req, res) => {
  try {
    const validatedData = insertCategorySchema.parse(req.body);
    
    const [newCategory] = await db.insert(categories)
      .values(validatedData)
      .returning();
    
    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid category data', details: error.errors });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const validatedData = insertCategorySchema.partial().parse(req.body);
    
    // Add updatedAt timestamp
    validatedData.updatedAt = new Date();
    
    const [updatedCategory] = await db.update(categories)
      .set(validatedData)
      .where(eq(categories.id, categoryId))
      .returning();
    
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid category data', details: error.errors });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const [deletedCategory] = await db.delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();
    
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully', category: deletedCategory });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Update display order for multiple categories at once
router.post('/reorder', async (req, res) => {
  try {
    const { categoryIds } = req.body;
    
    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ error: 'categoryIds must be an array of category IDs' });
    }
    
    // Start a transaction for reordering
    const results = await db.transaction(async (tx) => {
      const updates = [];
      
      for (let i = 0; i < categoryIds.length; i++) {
        updates.push(
          tx.update(categories)
            .set({ displayOrder: i, updatedAt: new Date() })
            .where(eq(categories.id, categoryIds[i]))
            .execute()
        );
      }
      
      return Promise.all(updates);
    });
    
    res.json({ message: 'Categories reordered successfully', count: results.length });
  } catch (error) {
    console.error('Error reordering categories:', error);
    res.status(500).json({ error: 'Failed to reorder categories' });
  }
});

export default router;