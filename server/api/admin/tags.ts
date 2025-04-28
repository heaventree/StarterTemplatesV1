import { Router } from 'express';
import { db } from '../../db';
import { tags, insertTagSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const allTags = await db.query.tags.findMany();
    res.json(allTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Get a single tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const tag = await db.query.tags.findFirst({
      where: eq(tags.id, tagId)
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  try {
    const validatedData = insertTagSchema.parse(req.body);
    
    const [newTag] = await db.insert(tags)
      .values(validatedData)
      .returning();
    
    res.status(201).json(newTag);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid tag data', details: error.errors });
    }
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// Update a tag
router.put('/:id', async (req, res) => {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const validatedData = insertTagSchema.partial().parse(req.body);
    
    // Add updatedAt timestamp
    const updateData = {
      ...validatedData,
      updatedAt: new Date()
    };
    
    const [updatedTag] = await db.update(tags)
      .set(updateData)
      .where(eq(tags.id, tagId))
      .returning();
    
    if (!updatedTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json(updatedTag);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid tag data', details: error.errors });
    }
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

// Delete a tag
router.delete('/:id', async (req, res) => {
  try {
    const tagId = parseInt(req.params.id);
    if (isNaN(tagId)) {
      return res.status(400).json({ error: 'Invalid tag ID' });
    }

    const [deletedTag] = await db.delete(tags)
      .where(eq(tags.id, tagId))
      .returning();
    
    if (!deletedTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    res.json({ message: 'Tag deleted successfully', tag: deletedTag });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

export default router;