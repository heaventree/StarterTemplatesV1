import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users } from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const adminUser = await db.select().from(users).where(({ and, eq }) => 
      and(eq(users.username, 'admin'), eq(users.role, 'admin'))
    ).limit(1);

    if (adminUser.length > 0) {
      console.log('Admin user already exists.');
      return;
    }

    // Create admin user if it doesn't exist
    const hashedPassword = await hashPassword('admin123');
    const newAdmin = await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    }).returning();

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    return newAdmin[0];
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Execute script
// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { createAdminUser };