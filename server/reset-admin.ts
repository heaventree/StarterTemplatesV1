import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function resetAdminUser() {
  try {
    // Delete existing admin user if exists
    await db.delete(users).where(eq(users.username, 'admin'));
    
    // Create a fresh admin user
    const hashedPassword = await hashPassword('admin123');
    const newAdmin = await db.insert(users).values({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    }).returning();

    console.log('Admin user reset successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    return newAdmin[0];
  } catch (error) {
    console.error('Error resetting admin user:', error);
  }
}

// Execute script
// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  resetAdminUser()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export { resetAdminUser };