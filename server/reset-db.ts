import { db } from './db';
import { users, templates, pageBuilders, tasks, taskComments } from '@shared/schema';
import { sql } from 'drizzle-orm';

async function resetDatabase() {
  console.log('Starting database reset...');

  try {
    // Drop all tables in reverse order of dependencies
    console.log('Dropping task_comments table...');
    await db.execute(sql`DROP TABLE IF EXISTS task_comments`);
    
    console.log('Dropping tasks table...');
    await db.execute(sql`DROP TABLE IF EXISTS tasks`);
    
    console.log('Dropping templates table...');
    await db.execute(sql`DROP TABLE IF EXISTS templates`);
    
    console.log('Dropping page_builders table...');
    await db.execute(sql`DROP TABLE IF EXISTS page_builders`);
    
    console.log('Dropping users table...');
    await db.execute(sql`DROP TABLE IF EXISTS users`);
    
    console.log('Database reset completed successfully!');
    console.log('You can now run the seeding script to populate the database with fresh data.');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase().catch(error => {
  console.error('Error in reset script:', error);
  process.exit(1);
});