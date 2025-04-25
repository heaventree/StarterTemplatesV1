import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/templates", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const pageBuilder = req.query.pageBuilder as string | undefined;
      
      let templates;
      if (category) {
        templates = await storage.getTemplatesByCategory(category);
      } else if (pageBuilder) {
        templates = await storage.getTemplatesByPageBuilder(pageBuilder);
      } else {
        templates = await storage.getAllTemplates();
      }
      
      res.json(templates);
    } catch (error) {
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

  const httpServer = createServer(app);
  return httpServer;
}
