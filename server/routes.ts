import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { insertTaskSchema, insertTaskCommentSchema } from "@shared/schema";
import { z } from "zod";
import { templateProxy } from "./template-proxy";

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
  
  // New streamlined template proxy
  app.get('/api/template-proxy', templateProxy);
  
  // Legacy template proxy endpoint using fetch to proxy content
  app.get('/template-proxy', async (req, res) => {
    try {
      const url = req.query.url as string;
      
      if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
      }

      // Import the necessary modules
      const fetch = await import('node-fetch');
      const { JSDOM } = await import('jsdom');
      const { HttpsProxyAgent } = await import('https-proxy-agent');
      
      console.log(`Attempting to proxy content from: ${url}`);
      
      // Fetch the content from the external site
      const response = await fetch.default(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://startertemplates.com/',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`);
      }
      
      // Get the content as text
      const content = await response.text();
      
      // Parse the HTML to fix relative URLs
      const dom = new JSDOM(content, { url });
      const document = dom.window.document;
      
      // Process all links to make them absolute
      document.querySelectorAll('a').forEach(link => {
        if (link.href && !link.href.startsWith('http')) {
          link.href = new URL(link.href, url).href;
        }
      });
      
      // Process all images to make URLs absolute
      document.querySelectorAll('img').forEach(img => {
        if (img.src && !img.src.startsWith('http')) {
          img.src = new URL(img.src, url).href;
        }
      });
      
      // Process all stylesheets to make URLs absolute
      document.querySelectorAll('link[rel="stylesheet"]').forEach(stylesheet => {
        if (stylesheet.href && !stylesheet.href.startsWith('http')) {
          stylesheet.href = new URL(stylesheet.href, url).href;
        }
      });
      
      // Process all scripts to make URLs absolute
      document.querySelectorAll('script').forEach(script => {
        if (script.src && !script.src.startsWith('http')) {
          script.src = new URL(script.src, url).href;
        }
      });
      
      // Add <base> tag to help with other relative URLs
      const baseElement = document.createElement('base');
      baseElement.href = url;
      document.head.insertBefore(baseElement, document.head.firstChild);
      
      // Add custom styles to ensure the template displays well inside our iframe
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        body {
          height: 100vh;
          overflow: auto;
        }
        
        /* Hide any potential cookie banners, popups etc. */
        [class*="cookie-banner"],
        [id*="cookie-banner"],
        [class*="popup"],
        [id*="popup"],
        [class*="overlay"],
        [id*="overlay"] {
          display: none !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      // Set headers to avoid security issues
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Return the processed HTML
      return res.send(dom.serialize());
      
    } catch (error) {
      console.error('Template proxy error:', error);
      
      // Return a fallback view if the proxy fails
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
                margin-bottom: 1rem;
              }
              .browser-frame {
                border: 1px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                max-width: 800px;
                margin: 2rem auto;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .browser-header {
                background: #f1f1f1;
                padding: 10px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #ddd;
              }
              .browser-buttons {
                display: flex;
                margin-right: 10px;
              }
              .browser-button {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 6px;
              }
              .browser-button.red { background-color: #ff5f57; }
              .browser-button.yellow { background-color: #ffbd2e; }
              .browser-button.green { background-color: #28c941; }
              .browser-address {
                flex-grow: 1;
                background: white;
                border-radius: 4px;
                padding: 4px 10px;
                font-size: 12px;
                color: #666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .browser-content {
                padding: 20px;
                background: white;
                min-height: 400px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              .info-box {
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                padding: 16px;
                margin-top: 20px;
                max-width: 90%;
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
                margin-top: 1rem;
              }
              .button:hover {
                background-color: #c13a7c;
              }
            </style>
          </head>
          <body>
            <div class="preview-container">
              <h1>Template Preview</h1>
              
              <div class="browser-frame">
                <div class="browser-header">
                  <div class="browser-buttons">
                    <div class="browser-button red"></div>
                    <div class="browser-button yellow"></div>
                    <div class="browser-button green"></div>
                  </div>
                  <div class="browser-address">${url}</div>
                </div>
                <div class="browser-content">
                  <img src="/offline-template.png" alt="Template Preview" style="max-width: 100%; max-height: 300px; object-fit: contain;" onerror="this.style.display='none'"/>
                  <div class="info-box">
                    <p>The external template content cannot be displayed in the preview due to the website's security settings.</p>
                    <p>You can view the full template by clicking the "Open in new tab" button or by visiting the template's website directly.</p>
                  </div>
                </div>
              </div>
              
              <a href="${url}" target="_blank" class="button">Open Template in New Tab</a>
            </div>
          </body>
        </html>
      `);
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
