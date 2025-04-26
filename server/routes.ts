import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { insertTaskSchema, insertTaskCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static image files
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
  
  // API routes
  app.get("/api/templates", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const pageBuilder = req.query.pageBuilder as string | undefined;
      
      let templates;
      if (category) {
        templates = await storage.getTemplatesByCategory(category);
        console.log(`Fetched ${templates.length} templates for category: ${category}`);
      } else if (pageBuilder) {
        templates = await storage.getTemplatesByPageBuilder(pageBuilder);
        console.log(`Fetched ${templates.length} templates for page builder: ${pageBuilder}`);
      } else {
        templates = await storage.getAllTemplates();
        console.log(`Fetched ${templates.length} templates total`);
      }
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const template = await storage.getTemplateById(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.get("/api/page-builders", async (req, res) => {
    try {
      const pageBuilders = await storage.getAllPageBuilders();
      res.json(pageBuilders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page builders" });
    }
  });

  app.get("/api/page-builders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pageBuilder = await storage.getPageBuilderById(id);
      
      if (!pageBuilder) {
        return res.status(404).json({ message: "Page builder not found" });
      }
      
      res.json(pageBuilder);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch page builder" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // In a real application, we would store the email
      // For now, just return success
      res.json({ success: true, message: "Subscription successful" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Task Management API routes
  // Get all tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const phase = req.query.phase as string | undefined;
      const category = req.query.category as string | undefined;
      const status = req.query.status as string | undefined;
      const assigneeId = req.query.assigneeId ? parseInt(req.query.assigneeId as string) : undefined;
      
      let tasks;
      if (phase) {
        tasks = await storage.getTasksByPhase(phase);
      } else if (category) {
        tasks = await storage.getTasksByCategory(category);
      } else if (status) {
        tasks = await storage.getTasksByStatus(status);
      } else if (assigneeId) {
        tasks = await storage.getTasksByAssignee(assigneeId);
      } else {
        tasks = await storage.getAllTasks();
      }
      
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  // Get task by ID
  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTaskById(id);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task" });
    }
  });

  // Create new task
  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid task data", 
          errors: validatedData.error.format() 
        });
      }
      
      const task = await storage.createTask(validatedData.data);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  // Update existing task
  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Partial validation
      const validationSchema = insertTaskSchema.partial();
      const validatedData = validationSchema.safeParse(req.body);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid task data", 
          errors: validatedData.error.format() 
        });
      }
      
      const updatedTask = await storage.updateTask(id, validatedData.data);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  // Delete task
  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteTask(id);
      
      if (!result) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Task comments
  // Get comments for a task
  app.get("/api/tasks/:taskId/comments", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const task = await storage.getTaskById(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const comments = await storage.getTaskComments(taskId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching task comments:", error);
      res.status(500).json({ message: "Failed to fetch task comments" });
    }
  });

  // Add comment to a task
  app.post("/api/tasks/:taskId/comments", async (req, res) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const task = await storage.getTaskById(taskId);
      
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      const commentData = {
        ...req.body,
        taskId
      };
      
      const validatedData = insertTaskCommentSchema.safeParse(commentData);
      
      if (!validatedData.success) {
        return res.status(400).json({ 
          message: "Invalid comment data", 
          errors: validatedData.error.format() 
        });
      }
      
      const comment = await storage.createTaskComment(validatedData.data);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating task comment:", error);
      res.status(500).json({ message: "Failed to create task comment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
