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

    // Initialize templates with actual images from the StarterTemplates.com repository
    const templateData: InsertTemplate[] = [
      {
        title: "Business Consulting",
        imageUrl: "/images/business-consulting-02-home.jpg",
        category: "Business",
        tags: ["Business", "Corporate", "Consulting"],
        pageBuilder: "Elementor",
        isPro: false,
        demoUrl: "https://websitedemos.net/business-consulting-02"
      },
      {
        title: "Cafe",
        imageUrl: "/images/cafe-04.jpg",
        category: "Food & Drink",
        tags: ["Cafe", "Restaurant", "Food"],
        pageBuilder: "Gutenberg",
        isPro: true,
        demoUrl: "https://websitedemos.net/cafe-04"
      },
      {
        title: "Car Repair",
        imageUrl: "/attached_assets/images/car-repair-02-homepage.jpg",
        category: "Automotive",
        tags: ["Automotive", "Service", "Repair"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Digital Marketing",
        imageUrl: "/attached_assets/images/digital-marketing-04-home.jpg",
        category: "Marketing",
        tags: ["Digital", "Marketing", "SEO"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "E-Learning",
        imageUrl: "/attached_assets/images/e-learning-04-landing-page.jpg",
        category: "Education",
        tags: ["Education", "Learning", "Online"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Fashion Store",
        imageUrl: "/attached_assets/images/fashion-store-04-home.jpg",
        category: "E-Commerce",
        tags: ["Fashion", "Store", "E-commerce"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Fitness",
        imageUrl: "/attached_assets/images/fitness-04-homepage.jpg",
        category: "Health & Fitness",
        tags: ["Fitness", "Gym", "Health"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Health Coach",
        imageUrl: "/attached_assets/images/health-coach-04-home.jpg",
        category: "Health & Fitness",
        tags: ["Health", "Coaching", "Wellness"],
        pageBuilder: "Brizy",
        isPro: true
      },
      {
        title: "Interior Designer",
        imageUrl: "/attached_assets/images/interior-designer-04-homepage.jpg",
        category: "Design",
        tags: ["Interior", "Design", "Decoration"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Pet Adoption Agency",
        imageUrl: "/attached_assets/images/pet-adoption-agency-04-home.jpg",
        category: "Pets & Animals",
        tags: ["Pet", "Adoption", "Animals"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Photographer Portfolio",
        imageUrl: "/attached_assets/images/photographer-portfolio-04-home.jpg",
        category: "Portfolio",
        tags: ["Photography", "Portfolio", "Creative"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Restaurant",
        imageUrl: "/attached_assets/images/restaurant-04-home.jpg",
        category: "Food & Drink",
        tags: ["Restaurant", "Food", "Dining"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Wedding Organizer",
        imageUrl: "/attached_assets/images/wedding-organizer-homepage.jpg",
        category: "Events",
        tags: ["Wedding", "Event", "Planning"],
        pageBuilder: "Brizy",
        isPro: false
      },
      {
        title: "Yoga Studio",
        imageUrl: "/attached_assets/images/yoga-studio-04-home.jpg",
        category: "Health & Fitness",
        tags: ["Yoga", "Wellness", "Fitness"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Spa & Wellness",
        imageUrl: "/attached_assets/images/spa-04-1.jpg",
        category: "Health & Fitness",
        tags: ["Spa", "Wellness", "Beauty"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      // Additional templates to have more than 30 in total for pagination
      {
        title: "Accountant",
        imageUrl: "/attached_assets/images/accountant-02.jpg",
        category: "Business",
        tags: ["Accounting", "Finance", "Tax"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "AC Technician",
        imageUrl: "/attached_assets/images/ac-technician-elementor-homepage-sceenshot.jpg",
        category: "Services",
        tags: ["AC", "Technician", "Repair"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Animal Welfare",
        imageUrl: "/attached_assets/images/animal-welfare-home-page.jpg",
        category: "Nonprofit",
        tags: ["Animal", "Welfare", "Charity"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "App Landing Page",
        imageUrl: "/attached_assets/images/appplus-landing-page-04-600x3298.jpg",
        category: "Technology",
        tags: ["App", "Mobile", "Landing"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Aquarium",
        imageUrl: "/attached_assets/images/aquarium-04-home.jpg",
        category: "Pets & Animals",
        tags: ["Aquarium", "Fish", "Marine"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Architects",
        imageUrl: "/attached_assets/images/architects-home-page.jpg",
        category: "Architecture",
        tags: ["Architecture", "Design", "Building"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Arch Masters",
        imageUrl: "/attached_assets/images/archmasters-architecture-02-600x2302.jpg",
        category: "Architecture",
        tags: ["Architecture", "Design", "Construction"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Artist Christine",
        imageUrl: "/attached_assets/images/artist-christine-home-page.jpg",
        category: "Art & Creative",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Brizy",
        isPro: false
      },
      {
        title: "Artist Feb 20",
        imageUrl: "/attached_assets/images/artist-feb-20-home.jpg",
        category: "Art & Creative",
        tags: ["Artist", "Creative", "Gallery"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Artist Multipurpose",
        imageUrl: "/attached_assets/images/artist-multipurpose-02-1-600x1546.jpg",
        category: "Art & Creative",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Author",
        imageUrl: "/attached_assets/images/author-home.jpg",
        category: "Blog & Writing",
        tags: ["Author", "Writer", "Books"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Ayurveda",
        imageUrl: "/attached_assets/images/ayurveda-04-home-1.jpg",
        category: "Health & Wellness",
        tags: ["Ayurveda", "Wellness", "Holistic"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Baby Store",
        imageUrl: "/attached_assets/images/baby-stores-04-600x2813.jpg",
        category: "E-Commerce",
        tags: ["Baby", "Store", "Kids"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Barber Shop",
        imageUrl: "/attached_assets/images/barber-shop-02-home-2.jpg",
        category: "Beauty & Care",
        tags: ["Barber", "Haircut", "Grooming"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "BBQ Food Truck",
        imageUrl: "/attached_assets/images/bbq-food-truck-04.jpg",
        category: "Food & Drink",
        tags: ["BBQ", "Food Truck", "Restaurant"],
        pageBuilder: "Elementor",
        isPro: true
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
    // Ensure all required fields have values to fix LSP error
    const template: Template = { 
      ...insertTemplate, 
      id,
      tags: insertTemplate.tags || [],
      isPro: insertTemplate.isPro === undefined ? false : insertTemplate.isPro,
      demoUrl: insertTemplate.demoUrl || null
    };
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
