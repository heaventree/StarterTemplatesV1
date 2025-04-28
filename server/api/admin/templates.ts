import { Request, Response, Router } from 'express';
import { storage } from '../../storage';
import { insertTemplateSchema } from '@shared/schema';
import { db } from '../../db';
import { templates } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const templatesRouter = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Get all templates
templatesRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const allTemplates = await storage.getAllTemplates();
    res.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get a specific template by ID
templatesRouter.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const template = await storage.getTemplateById(templateId);
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
templatesRouter.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateData = insertTemplateSchema.parse(req.body);
    const newTemplate = await storage.createTemplate(templateData);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(400).json({ error: 'Failed to create template' });
  }
});

// Update a template
templatesRouter.patch('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const existingTemplate = await storage.getTemplateById(templateId);
    if (!existingTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Validate the partial update data
    const updateData = req.body;
    
    // Update the template in the database
    const [updatedTemplate] = await db
      .update(templates)
      .set(updateData)
      .where(eq(templates.id, templateId))
      .returning();

    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(400).json({ error: 'Failed to update template' });
  }
});

// Delete a template
templatesRouter.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const existingTemplate = await storage.getTemplateById(templateId);
    if (!existingTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Delete the template from the database
    await db
      .delete(templates)
      .where(eq(templates.id, templateId));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// Update template order - Move up/down
templatesRouter.post('/:id/move', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const { direction } = req.body;
    if (!direction || (direction !== 'up' && direction !== 'down')) {
      return res.status(400).json({ error: 'Invalid direction. Must be "up" or "down"' });
    }

    const allTemplates = await storage.getAllTemplates();
    const currentTemplate = allTemplates.find(t => t.id === templateId);
    
    if (!currentTemplate) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Sort templates by their display order
    const sortedTemplates = [...allTemplates].sort((a, b) => {
      // Handle null displayOrder values
      const orderA = a.displayOrder ?? 9999;
      const orderB = b.displayOrder ?? 9999;
      return orderA - orderB;
    });

    const currentIndex = sortedTemplates.findIndex(t => t.id === templateId);
    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Template not found in ordered list' });
    }

    // Calculate target index based on direction
    const targetIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1) 
      : Math.min(sortedTemplates.length - 1, currentIndex + 1);

    // If already at the limit, return unchanged
    if (targetIndex === currentIndex) {
      return res.json({ message: 'No change in position' });
    }

    // Swap display orders
    const targetTemplate = sortedTemplates[targetIndex];
    
    await db.transaction(async (tx) => {
      // Update the current template's display order
      await tx
        .update(templates)
        .set({ displayOrder: targetTemplate.displayOrder })
        .where(eq(templates.id, currentTemplate.id));
      
      // Update the target template's display order
      await tx
        .update(templates)
        .set({ displayOrder: currentTemplate.displayOrder })
        .where(eq(templates.id, targetTemplate.id));
    });

    res.json({ 
      message: `Template moved ${direction} successfully`,
      newOrder: targetTemplate.displayOrder 
    });
  } catch (error) {
    console.error('Error moving template:', error);
    res.status(500).json({ error: 'Failed to move template' });
  }
});

// Toggle featured status
templatesRouter.post('/:id/toggle-featured', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const template = await storage.getTemplateById(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const newFeaturedStatus = !template.isFeatured;
    
    // Update the template's featured status
    const [updatedTemplate] = await db
      .update(templates)
      .set({ isFeatured: newFeaturedStatus })
      .where(eq(templates.id, templateId))
      .returning();

    res.json({ 
      message: `Template ${newFeaturedStatus ? 'featured' : 'unfeatured'} successfully`,
      template: updatedTemplate
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ error: 'Failed to update featured status' });
  }
});