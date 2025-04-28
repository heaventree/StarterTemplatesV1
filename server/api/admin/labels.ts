import { Request, Response, Router } from 'express';
import { storage } from '../../storage';
import { insertLabelSchema } from '@shared/schema';
import { db } from '../../db';
import { labels } from '@shared/schema';
import { eq, asc } from 'drizzle-orm';

export const labelsRouter = Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Get all labels
labelsRouter.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const allLabels = await db.select().from(labels).orderBy(asc(labels.displayOrder));
    res.json(allLabels);
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

// Get a specific label by ID
labelsRouter.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const labelId = parseInt(req.params.id);
    if (isNaN(labelId)) {
      return res.status(400).json({ error: 'Invalid label ID' });
    }

    const label = await db.select().from(labels).where(eq(labels.id, labelId)).limit(1);
    if (!label.length) {
      return res.status(404).json({ error: 'Label not found' });
    }

    res.json(label[0]);
  } catch (error) {
    console.error('Error fetching label:', error);
    res.status(500).json({ error: 'Failed to fetch label' });
  }
});

// Create a new label
labelsRouter.post('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const labelData = insertLabelSchema.parse(req.body);
    const [newLabel] = await db.insert(labels).values(labelData).returning();
    res.status(201).json(newLabel);
  } catch (error) {
    console.error('Error creating label:', error);
    res.status(400).json({ error: 'Failed to create label', details: error });
  }
});

// Update a label
labelsRouter.patch('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const labelId = parseInt(req.params.id);
    if (isNaN(labelId)) {
      return res.status(400).json({ error: 'Invalid label ID' });
    }

    const existingLabel = await db.select().from(labels).where(eq(labels.id, labelId)).limit(1);
    if (!existingLabel.length) {
      return res.status(404).json({ error: 'Label not found' });
    }

    // Validate the partial update data
    const updateData = req.body;
    
    // Update the label in the database
    const [updatedLabel] = await db
      .update(labels)
      .set(updateData)
      .where(eq(labels.id, labelId))
      .returning();

    res.json(updatedLabel);
  } catch (error) {
    console.error('Error updating label:', error);
    res.status(400).json({ error: 'Failed to update label' });
  }
});

// Delete a label
labelsRouter.delete('/:id', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const labelId = parseInt(req.params.id);
    if (isNaN(labelId)) {
      return res.status(400).json({ error: 'Invalid label ID' });
    }

    const existingLabel = await db.select().from(labels).where(eq(labels.id, labelId)).limit(1);
    if (!existingLabel.length) {
      return res.status(404).json({ error: 'Label not found' });
    }

    // Delete the label from the database
    await db
      .delete(labels)
      .where(eq(labels.id, labelId));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting label:', error);
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

// Update label order - Move up/down
labelsRouter.post('/:id/move', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const labelId = parseInt(req.params.id);
    if (isNaN(labelId)) {
      return res.status(400).json({ error: 'Invalid label ID' });
    }

    const { direction } = req.body;
    if (!direction || (direction !== 'up' && direction !== 'down')) {
      return res.status(400).json({ error: 'Invalid direction, must be "up" or "down"' });
    }

    // Get the current label
    const existingLabels = await db.select().from(labels).orderBy(asc(labels.displayOrder));
    const currentIndex = existingLabels.findIndex(c => c.id === labelId);
    
    if (currentIndex === -1) {
      return res.status(404).json({ error: 'Label not found' });
    }

    // If moving up and not at the top already
    if (direction === 'up' && currentIndex > 0) {
      const prevLabel = existingLabels[currentIndex - 1];
      const currLabel = existingLabels[currentIndex];
      
      // Swap display order
      await db.update(labels)
        .set({ displayOrder: currLabel.displayOrder })
        .where(eq(labels.id, prevLabel.id));
        
      await db.update(labels)
        .set({ displayOrder: prevLabel.displayOrder })
        .where(eq(labels.id, currLabel.id));
    }
    // If moving down and not at the bottom already
    else if (direction === 'down' && currentIndex < existingLabels.length - 1) {
      const nextLabel = existingLabels[currentIndex + 1];
      const currLabel = existingLabels[currentIndex];
      
      // Swap display order
      await db.update(labels)
        .set({ displayOrder: currLabel.displayOrder })
        .where(eq(labels.id, nextLabel.id));
        
      await db.update(labels)
        .set({ displayOrder: nextLabel.displayOrder })
        .where(eq(labels.id, currLabel.id));
    }
    
    // Get updated labels
    const updatedLabels = await db.select().from(labels).orderBy(asc(labels.displayOrder));
    res.json(updatedLabels);
  } catch (error) {
    console.error('Error updating label order:', error);
    res.status(500).json({ error: 'Failed to update label order' });
  }
});