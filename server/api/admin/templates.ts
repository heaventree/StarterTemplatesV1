import { Router } from 'express';
import { db } from '../../db';
import { templates, insertTemplateSchema } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = Router();

// Get all templates with sorting options
router.get('/', async (req, res) => {
  try {
    const allTemplates = await db.query.templates.findMany({
      orderBy: (templates, { asc }) => [asc(templates.displayOrder)]
    });
    res.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get a single template by ID
router.get('/:id', async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const template = await db.query.templates.findFirst({
      where: eq(templates.id, templateId)
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// Create a new template
router.post('/', async (req, res) => {
  try {
    const validatedData = insertTemplateSchema.parse(req.body);
    
    const [newTemplate] = await db.insert(templates)
      .values(validatedData)
      .returning();
    
    res.status(201).json(newTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid template data', details: error.errors });
    }
    console.error('Error creating template:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Update a template
router.put('/:id', async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const validatedData = insertTemplateSchema.partial().parse(req.body);
    
    // Add updatedAt timestamp
    validatedData.updatedAt = new Date();
    
    const [updatedTemplate] = await db.update(templates)
      .set(validatedData)
      .where(eq(templates.id, templateId))
      .returning();
    
    if (!updatedTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(updatedTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid template data', details: error.errors });
    }
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

// Delete a template
router.delete('/:id', async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const [deletedTemplate] = await db.delete(templates)
      .where(eq(templates.id, templateId))
      .returning();
    
    if (!deletedTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json({ message: 'Template deleted successfully', template: deletedTemplate });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// Update display order for multiple templates at once
router.post('/reorder', async (req, res) => {
  try {
    const { templateIds } = req.body;
    
    if (!Array.isArray(templateIds)) {
      return res.status(400).json({ error: 'templateIds must be an array of template IDs' });
    }
    
    // Start a transaction for reordering
    const results = await db.transaction(async (tx) => {
      const updates = [];
      
      for (let i = 0; i < templateIds.length; i++) {
        updates.push(
          tx.update(templates)
            .set({ displayOrder: i, updatedAt: new Date() })
            .where(eq(templates.id, templateIds[i]))
            .execute()
        );
      }
      
      return Promise.all(updates);
    });
    
    res.json({ message: 'Templates reordered successfully', count: results.length });
  } catch (error) {
    console.error('Error reordering templates:', error);
    res.status(500).json({ error: 'Failed to reorder templates' });
  }
});

// Update featured status for a template
router.post('/:id/featured', async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const { isFeatured } = req.body;
    
    if (typeof isFeatured !== 'boolean') {
      return res.status(400).json({ error: 'isFeatured must be a boolean' });
    }
    
    const [updatedTemplate] = await db.update(templates)
      .set({ 
        isFeatured, 
        updatedAt: new Date() 
      })
      .where(eq(templates.id, templateId))
      .returning();
    
    if (!updatedTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template featured status:', error);
    res.status(500).json({ error: 'Failed to update template featured status' });
  }
});

export default router;