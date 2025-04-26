import { 
  users, type User, type InsertUser,
  templates, type Template, type InsertTemplate,
  pageBuilders, type PageBuilder, type InsertPageBuilder,
  tasks, type Task, type InsertTask,
  taskComments, type TaskComment, type InsertTaskComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Template methods
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getTemplatesByPageBuilder(pageBuilder: string): Promise<Template[]>;
  getTemplateById(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Page Builder methods
  getAllPageBuilders(): Promise<PageBuilder[]>;
  getPageBuilderById(id: number): Promise<PageBuilder | undefined>;
  createPageBuilder(pageBuilder: InsertPageBuilder): Promise<PageBuilder>;

  // Task methods
  getAllTasks(): Promise<Task[]>;
  getTasksByPhase(phase: string): Promise<Task[]>;
  getTasksByCategory(category: string): Promise<Task[]>;
  getTasksByStatus(status: string): Promise<Task[]>;
  getTasksByAssignee(userId: number): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Task Comment methods
  getTaskComments(taskId: number): Promise<TaskComment[]>;
  createTaskComment(comment: InsertTaskComment): Promise<TaskComment>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return db.select().from(templates);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return db.select().from(templates).where(eq(templates.category, category));
  }

  async getTemplatesByPageBuilder(pageBuilder: string): Promise<Template[]> {
    return db.select().from(templates).where(eq(templates.pageBuilder, pageBuilder));
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const [template] = await db.insert(templates).values(insertTemplate).returning();
    return template;
  }

  // Page Builder methods
  async getAllPageBuilders(): Promise<PageBuilder[]> {
    return db.select().from(pageBuilders);
  }

  async getPageBuilderById(id: number): Promise<PageBuilder | undefined> {
    const [pageBuilder] = await db.select().from(pageBuilders).where(eq(pageBuilders.id, id));
    return pageBuilder;
  }

  async createPageBuilder(insertPageBuilder: InsertPageBuilder): Promise<PageBuilder> {
    const [pageBuilder] = await db.insert(pageBuilders).values(insertPageBuilder).returning();
    return pageBuilder;
  }

  // Task methods
  async getAllTasks(): Promise<Task[]> {
    return db.select().from(tasks);
  }

  async getTasksByPhase(phase: string): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.phase, phase));
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.category, category));
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.status, status));
  }

  async getTasksByAssignee(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.assignedTo, userId));
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set(taskData)
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    // First, delete related comments
    await db.delete(taskComments).where(eq(taskComments.taskId, id));
    
    // Then delete the task
    const result = await db.delete(tasks).where(eq(tasks.id, id)).returning({ id: tasks.id });
    return result.length > 0;
  }

  // Task Comment methods
  async getTaskComments(taskId: number): Promise<TaskComment[]> {
    return db
      .select()
      .from(taskComments)
      .where(eq(taskComments.taskId, taskId))
      .orderBy(desc(taskComments.createdAt));
  }

  async createTaskComment(insertComment: InsertTaskComment): Promise<TaskComment> {
    const [comment] = await db.insert(taskComments).values(insertComment).returning();
    return comment;
  }
}

// Initialize the database storage
export const storage = new DatabaseStorage();