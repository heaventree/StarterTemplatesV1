import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  pageBuilder: text("page_builder").notNull(),
  isPro: boolean("is_pro").notNull().default(false),
  demoUrl: text("demo_url"),
});

export const pageBuilders = pgTable("page_builders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  description: text("description").notNull(),
  templateCount: integer("template_count").notNull(),
  feature: text("feature").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export const insertPageBuilderSchema = createInsertSchema(pageBuilders).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type InsertPageBuilder = z.infer<typeof insertPageBuilderSchema>;
export type PageBuilder = typeof pageBuilders.$inferSelect;
