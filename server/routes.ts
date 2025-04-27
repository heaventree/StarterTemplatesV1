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
  
  // Enhanced template proxy endpoint to bypass CORS issues
  app.get('/template-proxy', async (req, res) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
      }

      // Check if the URL is already in our cache or if it's a known problematic URL
      if (url.includes('alexandrina-designer')) {
        console.log(`Using fallback mode for: ${url}`);
        // Return a special response for known problematic templates
        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Template Preview</title>
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                .container { max-width: 800px; margin: 0 auto; padding: 2rem; background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .notice { background-color: #EFF6FF; padding: 1.5rem; border-radius: 0.375rem; margin-bottom: 1.5rem; border-left: 4px solid #3B82F6; }
                h1 { color: #111827; font-size: 1.5rem; margin-bottom: 1rem; }
                p { color: #374151; line-height: 1.6; }
                .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
                .feature { display: flex; align-items: flex-start; gap: 0.5rem; }
                .feature svg { color: #10B981; flex-shrink: 0; margin-top: 0.125rem; }
                .feature p { margin: 0; font-size: 0.875rem; }
                .tags { display: flex; gap: 0.5rem; margin-top: 1.5rem; flex-wrap: wrap; }
                .tag { background-color: #F3F4F6; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; color: #4B5563; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="notice">
                  <h1>Template Information Preview</h1>
                  <p>This is an informational preview. External template previews are temporarily limited due to cross-origin restrictions. We're working on a solution to allow seamless template previewing within our platform.</p>
                </div>
                
                <h2>Alexandrina Kennedy – Designer</h2>
                <p>A professional portfolio template designed specifically for designers and creative professionals. Perfect for showcasing your work with a clean, modern aesthetic.</p>
                
                <div class="features">
                  <div class="feature">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p>Responsive Design</p>
                  </div>
                  <div class="feature">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p>Portfolio Showcase</p>
                  </div>
                  <div class="feature">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p>Contact Form</p>
                  </div>
                  <div class="feature">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <p>Blog Section</p>
                  </div>
                </div>
                
                <div class="tags">
                  <div class="tag">Designer</div>
                  <div class="tag">Portfolio</div>
                  <div class="tag">Creative</div>
                  <div class="tag">Professional</div>
                </div>
              </div>
            </body>
          </html>
        `);
      }

      console.log(`Proxying template request to: ${url}`);
      
      // Set timeout to 10 seconds
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch(url, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        clearTimeout(timeout);
        
        const contentType = response.headers.get('content-type');
        
        if (contentType) {
          res.setHeader('Content-Type', contentType);
        }
        
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Stream the response
        if (response.body) {
          response.body.pipe(res);
        } else {
          res.status(404).json({ error: 'Content not available' });
        }
      } catch (fetchError) {
        clearTimeout(timeout);
        throw fetchError;
      }
    } catch (error) {
      console.error('Template proxy error:', error);
      
      // Provide a fallback HTML response for any error
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Template Preview Unavailable</title>
            <style>
              body { font-family: system-ui, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
              .container { max-width: 600px; margin: 0 auto; padding: 2rem; background-color: white; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); text-align: center; }
              .icon { color: #F59E0B; margin-bottom: 1rem; }
              h1 { color: #111827; font-size: 1.5rem; margin-bottom: 1rem; }
              p { color: #374151; line-height: 1.6; }
              .button { display: inline-block; background-color: #3B82F6; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; text-decoration: none; margin-top: 1rem; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <h1>Preview Temporarily Unavailable</h1>
              <p>We're unable to load this template preview due to cross-origin restrictions. We're working on a solution to allow seamless template previewing within our platform.</p>
              <p>Please check the template details for more information about this template's features and capabilities.</p>
            </div>
          </body>
        </html>
      `);
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
