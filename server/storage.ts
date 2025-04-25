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

    // Initialize templates with images from the original StarterTemplates.com site
    const templateData: InsertTemplate[] = [
      {
        title: "Business Pro",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/06/business-template-768x576.jpg",
        category: "Business",
        tags: ["Business", "Corporate"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Shop Elegance",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/05/ecommerce-template-768x576.jpg",
        category: "E-Commerce",
        tags: ["E-commerce", "Retail"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Creative Blog",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/04/blog-template-768x576.jpg",
        category: "Blog",
        tags: ["Blog", "Magazine"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Portfolio Pro",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/03/portfolio-template-768x576.jpg",
        category: "Portfolio",
        tags: ["Portfolio", "Creative"],
        pageBuilder: "Brizy",
        isPro: true
      },
      {
        title: "Real Estate",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/02/real-estate-template-768x576.jpg",
        category: "Business",
        tags: ["Real Estate", "Property"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Restaurant",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/01/restaurant-template-768x576.jpg",
        category: "Business",
        tags: ["Restaurant", "Food"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Agency Pro",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/12/agency-template-768x576.jpg",
        category: "Business",
        tags: ["Agency", "Marketing"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Travel Blog",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/11/travel-template-768x576.jpg",
        category: "Blog",
        tags: ["Travel", "Tourism"],
        pageBuilder: "Brizy",
        isPro: false
      },
      {
        title: "Fitness Studio",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/10/fitness-template-768x576.jpg",
        category: "Business",
        tags: ["Fitness", "Health"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Beauty Salon",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/09/beauty-template-768x576.jpg",
        category: "Business",
        tags: ["Beauty", "Salon"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Wedding Pro",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/08/wedding-template-768x576.jpg",
        category: "Portfolio",
        tags: ["Wedding", "Event"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Charity Foundation",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/07/charity-template-768x576.jpg",
        category: "Nonprofit",
        tags: ["Charity", "Nonprofit"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Education Academy",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/05/education-template-768x576.jpg",
        category: "Education",
        tags: ["Education", "School"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Medical Clinic",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/04/medical-template-768x576.jpg",
        category: "Business",
        tags: ["Medical", "Healthcare"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Law Firm",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/03/law-template-768x576.jpg",
        category: "Business",
        tags: ["Law", "Legal"],
        pageBuilder: "Brizy",
        isPro: true
      },
      {
        title: "Digital Marketing",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/02/marketing-template-768x576.jpg",
        category: "Business",
        tags: ["Marketing", "Digital"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Coffee Shop",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/01/coffee-template-768x576.jpg",
        category: "Business",
        tags: ["Cafe", "Coffee"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Fashion Store",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/12/fashion-template-768x576.jpg",
        category: "E-Commerce",
        tags: ["Fashion", "Store"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Photography",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/11/photography-template-768x576.jpg",
        category: "Portfolio",
        tags: ["Photography", "Art"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Tech Startup",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/10/startup-template-768x576.jpg",
        category: "Business",
        tags: ["Startup", "Technology"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Music Studio",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/09/music-template-768x576.jpg",
        category: "Entertainment",
        tags: ["Music", "Arts"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Hotel & Resort",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/08/hotel-template-768x576.jpg",
        category: "Business",
        tags: ["Hotel", "Resort"],
        pageBuilder: "Brizy",
        isPro: true
      },
      {
        title: "Pet Care",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/07/pet-template-768x576.jpg",
        category: "Business",
        tags: ["Pet", "Animal"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Food Blog",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/06/food-blog-template-768x576.jpg",
        category: "Blog",
        tags: ["Food", "Recipe"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Art Gallery",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/05/art-gallery-template-768x576.jpg",
        category: "Portfolio",
        tags: ["Art", "Gallery"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Yoga Studio",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/04/yoga-template-768x576.jpg",
        category: "Business",
        tags: ["Yoga", "Wellness"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Construction",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/03/construction-template-768x576.jpg",
        category: "Business",
        tags: ["Construction", "Building"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Interior Design",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/02/interior-template-768x576.jpg",
        category: "Portfolio",
        tags: ["Interior", "Design"],
        pageBuilder: "Brizy",
        isPro: true
      },
      {
        title: "Landscaping",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2023/01/landscaping-template-768x576.jpg",
        category: "Business",
        tags: ["Garden", "Landscaping"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Sports Club",
        imageUrl: "https://startertemplates.com/wp-content/uploads/2022/12/sports-template-768x576.jpg",
        category: "Business",
        tags: ["Sports", "Club"],
        pageBuilder: "Elementor",
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
