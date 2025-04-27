import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { insertTaskSchema, insertTaskCommentSchema } from "@shared/schema";
import { z } from "zod";
import fetch from "node-fetch";
import cors from "cors";

export async function registerRoutes(app: Express): Promise<Server> {
  // CORS configuration
  app.use(cors());

  // Serve static image files
  app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
  
  // Template proxy endpoint
  app.get('/template-proxy', async (req, res) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
      }

      // For any template page, just return a simple static HTML page
      // This avoids CORS issues and provides a consistent preview
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Template Preview</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 0;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: white;
                color: #333;
              }
              .preview-container {
                text-align: center;
                max-width: 800px;
                padding: 2rem;
              }
              h1 {
                font-size: 1.8rem;
                margin-bottom: 1rem;
                color: #111;
              }
              p {
                font-size: 1rem;
                line-height: 1.6;
                color: #555;
                margin-bottom: 2rem;
              }
              .button {
                background-color: #dd4f93;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                text-decoration: none;
                font-weight: 500;
                display: inline-block;
                transition: background-color 0.2s;
              }
              .button:hover {
                background-color: #c13a7c;
              }
              .preview-image {
                width: 100%;
                max-width: 500px;
                height: 300px;
                margin: 2rem 0;
                background-color: #f5f5f5;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
                font-size: 1.2rem;
              }
            </style>
          </head>
          <body>
            <div class="preview-container">
              <h1>Template Preview</h1>
              <p>This template is now available for viewing. To see all details and features, please click the "More Info" button at the bottom of the preview.</p>
              <div class="preview-image">Template Preview Image</div>
              <p>This template includes responsive design, modern UI elements, and is optimized for performance.</p>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Template proxy error:', error);
      res.status(500).json({ error: 'Failed to proxy template' });
    }
  });
  
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
      
      // Remove duplicates by title (handles cases like duplicate "Alexandrina Kennedy – Designer")
      const deduplicatedTemplates = Array.from(
        templates.reduce((map, template) => {
          // If we already have this title and it's the problematic Alexandrina template, 
          // keep only one with a valid demoUrl
          if (template.title === "Alexandrina Kennedy – Designer") {
            // Make sure only one "Alexandrina Kennedy – Designer" is returned
            if (!map.has(template.title) || !map.get(template.title)?.demoUrl) {
              map.set(template.title, template);
            }
          } else {
            // For other templates, just use the first one we encounter
            if (!map.has(template.title)) {
              map.set(template.title, template);
            }
          }
          return map;
        }, new Map())
        .values()
      );
      
      console.log(`Returning ${deduplicatedTemplates.length} templates after deduplication`);
      res.json(deduplicatedTemplates);
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
