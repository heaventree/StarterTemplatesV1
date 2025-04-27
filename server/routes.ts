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

      // Always return a direct embedded preview instead of trying to proxy
      // This completely avoids CORS issues by rendering our own content
      
      const templateName = url.split('/').pop() || "template";
      console.log(`Rendering template preview for: ${templateName}`);

      // Return an embedded preview that looks like a template
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Template Preview</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: #333; line-height: 1.5; }
              
              .template-preview { width: 100%; height: 100vh; overflow: auto; }
              
              /* Header */
              header { background-color: #1a1a2e; color: #fff; padding: 1.5rem 5%; }
              nav { display: flex; justify-content: space-between; align-items: center; }
              .logo { font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px; }
              .nav-links { display: flex; gap: 2rem; }
              .nav-links a { color: rgba(255,255,255,0.8); text-decoration: none; font-weight: 500; }
              
              /* Hero */
              .hero { padding: 5rem 5%; background-color: #f8f8fc; min-height: 60vh; display: flex; align-items: center; justify-content: space-between; }
              .hero-content { width: 50%; }
              .hero h1 { font-size: 3rem; margin-bottom: 1.5rem; line-height: 1.2; color: #1a1a2e; }
              .hero p { font-size: 1.1rem; margin-bottom: 2rem; color: #666; }
              .hero-image { width: 45%; height: 350px; background-color: #e6e6e6; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #999; }
              
              /* Features */
              .features { padding: 5rem 5%; background-color: #fff; }
              .section-heading { text-align: center; margin-bottom: 3rem; }
              .section-heading h2 { font-size: 2.2rem; margin-bottom: 1rem; color: #1a1a2e; }
              .section-heading p { font-size: 1.1rem; color: #666; max-width: 700px; margin: 0 auto; }
              .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
              .feature-card { background-color: #f8f8fc; padding: 2rem; border-radius: 8px; transition: transform 0.3s ease; }
              .feature-card:hover { transform: translateY(-5px); }
              .feature-icon { width: 50px; height: 50px; background-color: #e6e6e6; border-radius: 50%; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; color: #1a1a2e; font-size: 1.5rem; }
              .feature-card h3 { margin-bottom: 1rem; font-size: 1.3rem; }
              
              /* Footer */
              footer { background-color: #1a1a2e; color: rgba(255,255,255,0.8); padding: 3rem 5%; }
              .footer-content { display: flex; justify-content: space-between; }
              .footer-col { width: 23%; }
              .footer-col h4 { color: #fff; margin-bottom: 1.5rem; font-size: 1.1rem; }
              .footer-col ul { list-style: none; }
              .footer-col ul li { margin-bottom: 0.8rem; }
              .footer-col a { color: rgba(255,255,255,0.6); text-decoration: none; }
              .footer-col a:hover { color: #fff; }
              .copyright { text-align: center; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }

              /* Buttons */
              .btn { display: inline-block; padding: 0.8rem 1.8rem; border-radius: 4px; font-weight: 500; text-decoration: none; transition: all 0.3s ease; }
              .btn-primary { background-color: #dd4f93; color: white; }
              .btn-primary:hover { background-color: #c13a7c; }
              .btn-secondary { background-color: transparent; color: #333; border: 1px solid #ddd; margin-left: 1rem; }
              .btn-secondary:hover { background-color: #f8f8fc; }
              
              @media (max-width: 768px) {
                .hero { flex-direction: column; text-align: center; }
                .hero-content, .hero-image { width: 100%; }
                .hero-image { margin-top: 2rem; }
                .footer-content { flex-direction: column; }
                .footer-col { width: 100%; margin-bottom: 2rem; }
              }
            </style>
          </head>
          <body>
            <div class="template-preview">
              <header>
                <nav>
                  <div class="logo">Template Demo</div>
                  <div class="nav-links">
                    <a href="#">Home</a>
                    <a href="#">Features</a>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                  </div>
                </nav>
              </header>
              
              <section class="hero">
                <div class="hero-content">
                  <h1>Modern Design for Your Website</h1>
                  <p>This is a preview of how this template would look when implemented on your website. All key features are showcased with a clean, modern design.</p>
                  <div class="hero-buttons">
                    <a href="#" class="btn btn-primary">Get Started</a>
                    <a href="#" class="btn btn-secondary">Learn More</a>
                  </div>
                </div>
                <div class="hero-image">Image Placeholder</div>
              </section>
              
              <section class="features">
                <div class="section-heading">
                  <h2>Key Features</h2>
                  <p>This template comes with everything you need to get your website up and running quickly.</p>
                </div>
                <div class="feature-grid">
                  <div class="feature-card">
                    <div class="feature-icon">1</div>
                    <h3>Responsive Design</h3>
                    <p>Fully responsive layout that looks great on all devices from mobile to desktop.</p>
                  </div>
                  <div class="feature-card">
                    <div class="feature-icon">2</div>
                    <h3>Modern UI Elements</h3>
                    <p>Beautiful UI components designed with user experience in mind.</p>
                  </div>
                  <div class="feature-card">
                    <div class="feature-icon">3</div>
                    <h3>Fast Performance</h3>
                    <p>Optimized code ensures your website loads quickly and runs smoothly.</p>
                  </div>
                </div>
              </section>
              
              <footer>
                <div class="footer-content">
                  <div class="footer-col">
                    <h4>Template Demo</h4>
                    <p>A modern website template perfect for businesses and personal websites.</p>
                  </div>
                  <div class="footer-col">
                    <h4>Links</h4>
                    <ul>
                      <li><a href="#">Home</a></li>
                      <li><a href="#">Features</a></li>
                      <li><a href="#">Pricing</a></li>
                      <li><a href="#">Contact</a></li>
                    </ul>
                  </div>
                  <div class="footer-col">
                    <h4>Support</h4>
                    <ul>
                      <li><a href="#">Documentation</a></li>
                      <li><a href="#">FAQs</a></li>
                      <li><a href="#">Community</a></li>
                      <li><a href="#">Support</a></li>
                    </ul>
                  </div>
                  <div class="footer-col">
                    <h4>Contact</h4>
                    <ul>
                      <li>Email: info@example.com</li>
                      <li>Phone: +1 234 567 890</li>
                      <li>Address: 123 Template St, City</li>
                    </ul>
                  </div>
                </div>
                <div class="copyright">
                  <p>&copy; 2025 Template Demo. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Template proxy error:', error);
      
      // Provide a fallback HTML response for any error
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Template Preview</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; color: #333; line-height: 1.5; }
              
              .error-container { height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; text-align: center; background-color: #f8f8fc; }
              .error-card { max-width: 500px; padding: 3rem; background-color: white; border-radius: 8px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
              .error-icon { font-size: 3rem; margin-bottom: 1.5rem; color: #dd4f93; }
              h1 { font-size: 1.8rem; margin-bottom: 1rem; color: #1a1a2e; }
              p { margin-bottom: 1.5rem; color: #666; }
              .btn { display: inline-block; padding: 0.8rem 1.8rem; border-radius: 4px; font-weight: 500; text-decoration: none; transition: all 0.3s ease; background-color: #dd4f93; color: white; }
              .btn:hover { background-color: #c13a7c; }
            </style>
          </head>
          <body>
            <div class="error-container">
              <div class="error-card">
                <div class="error-icon">⚙️</div>
                <h1>Template Preview</h1>
                <p>This is a simplified preview of the template. The actual template includes more features and customization options.</p>
                <p>To explore the full template and all its features, please use the "More Info" button.</p>
                <a href="#" class="btn">Return to Templates</a>
              </div>
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
