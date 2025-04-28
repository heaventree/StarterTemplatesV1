import { Request, Response, Router } from 'express';
import { storage } from '../../storage';
import { insertCategorySchema } from '@shared/schema';
import { db } from '../../db';
import { categories } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const categoriesRouter = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Get all categories
categoriesRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categories).orderBy(categories.displayOrder);
    res.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a specific category by ID
categoriesRouter.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const category = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
    if (!category.length) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create a new category
categoriesRouter.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categoryData = insertCategorySchema.parse(req.body);
    const [newCategory] = await db.insert(categories).values(categoryData).returning();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ error: 'Failed to create category' });
  }
});

// Update a category
categoriesRouter.patch('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const existingCategory = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
    if (!existingCategory.length) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Validate the partial update data
    const updateData = req.body;
    
    // Update the category in the database
    const [updatedCategory] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, categoryId))
      .returning();

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ error: 'Failed to update category' });
  }
});

// Delete a category
categoriesRouter.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const existingCategory = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
    if (!existingCategory.length) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete the category from the database
    await db
      .delete(categories)
      .where(eq(categories.id, categoryId));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Update category order - Move up/down
categoriesRouter.post('/:id/move', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    if (isNaN(categoryId)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }

    const { direction } = req.body;
    if (!direction || (direction !== 'up' && direction !== 'down')) {
      return res.status(400).json({ error: 'Invalid direction. Must be "up" or "down"' });
    }

    const allCategories = await db.select().from(categories).orderBy(categories.displayOrder);
    const currentCategory = allCategories.find(c => c.id === categoryId);
    
    if (!currentCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const currentIndex = allCategories.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Category not found in ordered list' });
    }

    // Calculate target index based on direction
    const targetIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1) 
      : Math.min(allCategories.length - 1, currentIndex + 1);

    // If already at the limit, return unchanged
    if (targetIndex === currentIndex) {
      return res.json({ message: 'No change in position' });
    }

    // Swap display orders
    const targetCategory = allCategories[targetIndex];
    
    await db.transaction(async (tx) => {
      // Update the current category's display order
      await tx
        .update(categories)
        .set({ displayOrder: targetCategory.displayOrder })
        .where(eq(categories.id, currentCategory.id));
      
      // Update the target category's display order
      await tx
        .update(categories)
        .set({ displayOrder: currentCategory.displayOrder })
        .where(eq(categories.id, targetCategory.id));
    });

    res.json({ 
      message: `Category moved ${direction} successfully`,
      newOrder: targetCategory.displayOrder 
    });
  } catch (error) {
    console.error('Error moving category:', error);
    res.status(500).json({ error: 'Failed to move category' });
  }
});