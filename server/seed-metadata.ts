import { db } from './db';
import { categories, labels, tags } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function seedMetadata() {
  try {
    console.log('Starting to seed categories, tags, and labels...');

    // Seed categories
    const categoriesList = [
      { name: 'Local Business', displayOrder: 10 },
      { name: 'Non Profit', displayOrder: 20 },
      { name: 'Personal', displayOrder: 30 },
      { name: 'Professional', displayOrder: 40 },
      { name: 'Restaurant', displayOrder: 50 },
      { name: 'eCommerce', displayOrder: 60 },
      { name: 'eLearning', displayOrder: 70 }
    ];

    console.log('Seeding categories...');
    for (const category of categoriesList) {
      // Check if category exists
      const exists = await db.select({ count: sql`count(*)` }).from(categories)
        .where(sql`lower(name) = lower(${category.name})`)
        .then(result => Number(result[0].count) > 0);

      if (!exists) {
        await db.insert(categories).values(category);
        console.log(`Added category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${category.name}`);
      }
    }

    // Seed labels
    const labelsList = [
      { name: 'Free', color: '#22c55e', textColor: '#ffffff', displayOrder: 10 },
      { name: 'Pro', color: '#6366f1', textColor: '#ffffff', displayOrder: 20 },
      { name: 'New', color: '#f59e0b', textColor: '#ffffff', displayOrder: 30 },
      { name: 'Popular', color: '#ef4444', textColor: '#ffffff', displayOrder: 40 }
    ];

    console.log('Seeding labels...');
    for (const label of labelsList) {
      // Check if label exists
      const exists = await db.select({ count: sql`count(*)` }).from(labels)
        .where(sql`lower(name) = lower(${label.name})`)
        .then(result => Number(result[0].count) > 0);

      if (!exists) {
        await db.insert(labels).values(label);
        console.log(`Added label: ${label.name}`);
      } else {
        console.log(`Label already exists: ${label.name}`);
      }
    }

    // Seed some common tags
    const tagsList = [
      { name: 'Business', slug: 'business' },
      { name: 'Creative', slug: 'creative' },
      { name: 'Blog', slug: 'blog' },
      { name: 'Restaurant', slug: 'restaurant' },
      { name: 'Portfolio', slug: 'portfolio' },
      { name: 'Education', slug: 'education' },
      { name: 'Technology', slug: 'technology' },
      { name: 'Store', slug: 'store' },
      { name: 'Health', slug: 'health' },
      { name: 'Travel', slug: 'travel' }
    ];

    console.log('Seeding tags...');
    for (const tag of tagsList) {
      // Check if tag exists
      const exists = await db.select({ count: sql`count(*)` }).from(tags)
        .where(sql`lower(name) = lower(${tag.name})`)
        .then(result => Number(result[0].count) > 0);

      if (!exists) {
        await db.insert(tags).values(tag);
        console.log(`Added tag: ${tag.name}`);
      } else {
        console.log(`Tag already exists: ${tag.name}`);
      }
    }

    // Update templates to add pill labels based on isPro field
    await db.execute(sql`
      UPDATE templates 
      SET pill_labels = 
        CASE 
          WHEN is_pro = true THEN ARRAY['Pro']::text[] 
          ELSE ARRAY['Free']::text[] 
        END
      WHERE pill_labels IS NULL OR array_length(pill_labels, 1) IS NULL
    `);
    console.log('Updated templates with Free/Pro labels');

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding categories and labels:', error);
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMetadata()
    .then(() => {
      console.log('Seed script execution completed');
      process.exit(0);
    })
    .catch(error => {
      console.error('Seed script execution failed:', error);
      process.exit(1);
    });
}

export { seedMetadata };