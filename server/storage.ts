import { 
  users, type User, type InsertUser,
  templates, type Template, type InsertTemplate,
  pageBuilders, type PageBuilder, type InsertPageBuilder
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private templates: Map<number, Template>;
  private pageBuilders: Map<number, PageBuilder>;
  private userId: number;
  private templateId: number;
  private pageBuilderId: number;

  constructor() {
    this.users = new Map();
    this.templates = new Map();
    this.pageBuilders = new Map();
    this.userId = 1;
    this.templateId = 1;
    this.pageBuilderId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Initialize page builders
    const pageBuilderData: InsertPageBuilder[] = [
      {
        name: "Elementor",
        logoUrl: "https://i0.wp.com/elementor.com/marketing/wp-content/uploads/2021/10/Elementor-Logo-Symbol-Pink.png?w=144&ssl=1",
        description: "The most popular WordPress page builder with drag & drop editing.",
        templateCount: 250,
        feature: "One-click Import"
      },
      {
        name: "Gutenberg",
        logoUrl: "https://cdn.freebiesupply.com/logos/large/2x/gutenberg-logo-png-transparent.png",
        description: "The default WordPress editor with blocks for flexible layouts.",
        templateCount: 150,
        feature: "Native WordPress"
      },
      {
        name: "Beaver Builder",
        logoUrl: "https://wordpress.org/files/2023/02/bb-icon-256.png",
        description: "A simple, intuitive drag & drop page builder for WordPress.",
        templateCount: 100,
        feature: "Fast & Reliable"
      },
      {
        name: "Brizy",
        logoUrl: "https://i0.wp.com/brizy.io/wp-content/uploads/2018/11/favicon.png?w=202&ssl=1",
        description: "A modern, intuitive page builder for WordPress and cloud platform.",
        templateCount: 100,
        feature: "Cloud Option"
      }
    ];

    pageBuilderData.forEach(builder => {
      this.createPageBuilder(builder);
    });

    // Initialize templates
    const templateData: InsertTemplate[] = [
      {
        title: "Business Pro",
        imageUrl: "https://images.unsplash.com/photo-1556155092-490a1ba16284",
        category: "Business",
        tags: ["Business", "Corporate"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Shop Elegance",
        imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc",
        category: "E-Commerce",
        tags: ["E-commerce", "Retail"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Blogger's Delight",
        imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
        category: "Blog",
        tags: ["Blog", "Magazine"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Creative Portfolio",
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
        category: "Portfolio",
        tags: ["Portfolio", "Creative"],
        pageBuilder: "Brizy",
        isPro: true
      },
      {
        title: "Real Estate Pro",
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
        category: "Business",
        tags: ["Real Estate", "Business"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Restaurant Elite",
        imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8",
        category: "Business",
        tags: ["Restaurant", "Food"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Agency Master",
        imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692",
        category: "Business",
        tags: ["Agency", "Business"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Travel Explorer",
        imageUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
        category: "Blog",
        tags: ["Travel", "Tourism"],
        pageBuilder: "Brizy",
        isPro: false
      }
    ];

    templateData.forEach(template => {
      this.createTemplate(template);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Template methods
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.category === category,
    );
  }

  async getTemplatesByPageBuilder(pageBuilder: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.pageBuilder === pageBuilder,
    );
  }

  async getTemplateById(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateId++;
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }

  // Page Builder methods
  async getAllPageBuilders(): Promise<PageBuilder[]> {
    return Array.from(this.pageBuilders.values());
  }

  async getPageBuilderById(id: number): Promise<PageBuilder | undefined> {
    return this.pageBuilders.get(id);
  }

  async createPageBuilder(insertPageBuilder: InsertPageBuilder): Promise<PageBuilder> {
    const id = this.pageBuilderId++;
    const pageBuilder: PageBuilder = { ...insertPageBuilder, id };
    this.pageBuilders.set(id, pageBuilder);
    return pageBuilder;
  }
}

export const storage = new MemStorage();
