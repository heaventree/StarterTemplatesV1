import { Request, Response, Router } from 'express';
import { storage } from '../../storage';
import { insertTagSchema } from '@shared/schema';
import { db } from '../../db';
import { tags } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const tagsRouter = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Get all tags
tagsRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const allTags = await db.select().from(tags);
    res.json(allTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Get a specific tag by ID
tagsRouter.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const tag = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);
    if (!tag.length) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag[0]);
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

// Create a new tag
tagsRouter.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const tagData = insertTagSchema.parse(req.body);
    const [newTag] = await db.insert(tags).values(tagData).returning();
    res.status(201).json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(400).json({ error: 'Failed to create tag' });
  }
});

// Update a tag
tagsRouter.patch('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const existingTag = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);
    if (!existingTag.length) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Validate the partial update data
    const updateData = req.body;
    
    // Update the tag in the database
    const [updatedTag] = await db
      .update(tags)
      .set(updateData)
      .where(eq(tags.id, tagId))
      .returning();

    res.json(updatedTag);
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(400).json({ error: 'Failed to update tag' });
  }
});

// Delete a tag
tagsRouter.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const existingTag = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);
    if (!existingTag.length) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    // Delete the tag from the database
    await db
      .delete(tags)
      .where(eq(tags.id, tagId));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});