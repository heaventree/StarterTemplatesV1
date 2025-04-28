import { 
  users, type User, type InsertUser,
  templates, type Template, type InsertTemplate,
  pageBuilders, type PageBuilder, type InsertPageBuilder,
  tasks, type Task, type InsertTask,
  taskComments, type TaskComment, type InsertTaskComment,
  categories, type Category, type InsertCategory,
  tags, type Tag, type InsertTag,
  labels, type Label, type InsertLabel
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
  updateTemplate(id: number, templateData: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: number): Promise<boolean>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Tag methods
  getAllTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: number, tagData: Partial<InsertTag>): Promise<Tag | undefined>;
  deleteTag(id: number): Promise<boolean>;
  
  // Label methods
  getAllLabels(): Promise<Label[]>;
  getLabelById(id: number): Promise<Label | undefined>;
  createLabel(label: InsertLabel): Promise<Label>;
  updateLabel(id: number, labelData: Partial<InsertLabel>): Promise<Label | undefined>;
  deleteLabel(id: number): Promise<boolean>;
  
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

  async updateTemplate(id: number, templateData: Partial<InsertTemplate>): Promise<Template | undefined> {
    const [updatedTemplate] = await db
      .update(templates)
      .set(templateData)
      .where(eq(templates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteTemplate(id: number): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id)).returning({ id: templates.id });
    return result.length > 0;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(categories.displayOrder);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning({ id: categories.id });
    return result.length > 0;
  }

  // Tag methods
  async getAllTags(): Promise<Tag[]> {
    return db.select().from(tags);
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const [tag] = await db.insert(tags).values(insertTag).returning();
    return tag;
  }

  async updateTag(id: number, tagData: Partial<InsertTag>): Promise<Tag | undefined> {
    const [updatedTag] = await db
      .update(tags)
      .set(tagData)
      .where(eq(tags.id, id))
      .returning();
    return updatedTag;
  }

  async deleteTag(id: number): Promise<boolean> {
    const result = await db.delete(tags).where(eq(tags.id, id)).returning({ id: tags.id });
    return result.length > 0;
  }

  // Label methods
  async getAllLabels(): Promise<Label[]> {
    return db.select().from(labels).orderBy(labels.displayOrder);
  }

  async getLabelById(id: number): Promise<Label | undefined> {
    const [label] = await db.select().from(labels).where(eq(labels.id, id));
    return label;
  }

  async createLabel(insertLabel: InsertLabel): Promise<Label> {
    const [label] = await db.insert(labels).values(insertLabel).returning();
    return label;
  }

  async updateLabel(id: number, labelData: Partial<InsertLabel>): Promise<Label | undefined> {
    const [updatedLabel] = await db
      .update(labels)
      .set(labelData)
      .where(eq(labels.id, id))
      .returning();
    return updatedLabel;
  }

  async deleteLabel(id: number): Promise<boolean> {
    const result = await db.delete(labels).where(eq(labels.id, id)).returning({ id: labels.id });
    return result.length > 0;
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