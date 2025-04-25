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

    // Initialize templates with actual images from the locally cloned repository
    const templateData: InsertTemplate[] = [
      {
        title: "Love Nature",
        imageUrl: "/images/love-nature-02-600x1449.jpg",
        category: "Environment",
        tags: ["Nature", "Conservation", "Green"],
        pageBuilder: "Elementor",
        isPro: false,
        demoUrl: "https://websitedemos.net/love-nature-02"
      },
      {
        title: "Outdoor Adventure",
        imageUrl: "/images/outdoor-adventure-02-home.jpg",
        category: "Sports & Recreation",
        tags: ["Outdoor", "Adventure", "Travel"],
        pageBuilder: "Gutenberg",
        isPro: true,
        demoUrl: "https://websitedemos.net/outdoor-adventure-02"
      },
      {
        title: "Brandstore",
        imageUrl: "/images/brandstore-02-1-600x1856.jpg",
        category: "E-Commerce",
        tags: ["Brand", "Store", "Shopping"],
        pageBuilder: "Beaver Builder",
        isPro: false,
        demoUrl: "https://websitedemos.net/brandstore-02"
      },
      {
        title: "Electronic Store",
        imageUrl: "/images/electronic-stores-04-600x4955.jpg",
        category: "E-Commerce",
        tags: ["Electronics", "Gadgets", "Tech"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/electronic-store-04"
      },
      {
        title: "Wellness Coach",
        imageUrl: "/images/wellness-coach-02-1-600x1726.jpg",
        category: "Health & Wellness",
        tags: ["Wellness", "Coaching", "Health"],
        pageBuilder: "Gutenberg",
        isPro: false,
        demoUrl: "https://websitedemos.net/wellness-coach-02"
      },
      {
        title: "Planet Earth",
        imageUrl: "/images/earth-02-600x1189.jpg",
        category: "Environment",
        tags: ["Earth", "Environment", "Conservation"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/earth-02"
      },
      {
        title: "Fashion Photography Portfolio",
        imageUrl: "/images/fashion-photography-04-600x2547.jpg",
        category: "Photography",
        tags: ["Fashion", "Photography", "Portfolio"],
        pageBuilder: "Beaver Builder",
        isPro: false,
        demoUrl: "https://websitedemos.net/fashion-photography-04"
      },
      {
        title: "Hope",
        imageUrl: "/images/hope-design.jpg",
        category: "Non-Profit",
        tags: ["Charity", "Hope", "Donation"],
        pageBuilder: "Brizy",
        isPro: true,
        demoUrl: "https://websitedemos.net/hope"
      },
      {
        title: "Politician",
        imageUrl: "/images/politician-04-600x2550.jpg",
        category: "Politics",
        tags: ["Politician", "Campaign", "Government"],
        pageBuilder: "Elementor",
        isPro: false,
        demoUrl: "https://websitedemos.net/politician-04"
      },
      {
        title: "Alexandrina Kennedy – Designer",
        imageUrl: "/images/alexandrina-designer-600x900.jpg",
        category: "Design",
        tags: ["Designer", "Portfolio", "Creative"],
        pageBuilder: "Gutenberg",
        isPro: true,
        demoUrl: "https://websitedemos.net/alexandrina-designer"
      },
      {
        title: "Lifestyle Blogger",
        imageUrl: "/images/lifestyle-blogger-04-600x2304.jpg",
        category: "Blog",
        tags: ["Lifestyle", "Blogger", "Writing"],
        pageBuilder: "Beaver Builder",
        isPro: false,
        demoUrl: "https://websitedemos.net/lifestyle-blogger-04"
      },
      {
        title: "Planet Earth Store",
        imageUrl: "/images/earth-store-02-600x1210.jpg",
        category: "E-Commerce",
        tags: ["Eco", "Store", "Sustainable"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/earth-store-02"
      },
      {
        title: "Nexus News",
        imageUrl: "/images/news-blog-04-600x2428.jpg",
        category: "News",
        tags: ["News", "Blog", "Media"],
        pageBuilder: "Brizy",
        isPro: false,
        demoUrl: "https://websitedemos.net/news-blog-04"
      },
      {
        title: "Black Friday",
        imageUrl: "/images/black-friday-bonanza-04-600x2062.jpg",
        category: "E-Commerce",
        tags: ["Sale", "Shopping", "Black Friday"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/black-friday-bonanza-04"
      },
      {
        title: "Earthly Elegance",
        imageUrl: "/images/gardening-and-landscape-02-600x2964.jpg",
        category: "Gardening",
        tags: ["Gardening", "Landscape", "Nature"],
        pageBuilder: "Gutenberg",
        isPro: false,
        demoUrl: "https://websitedemos.net/gardening-and-landscape-02"
      },
      // Additional templates to have more than 30 in total for pagination
      {
        title: "Accountant",
        imageUrl: "/images/accountant-02.jpg",
        category: "Business",
        tags: ["Accounting", "Finance", "Tax"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "AC Technician",
        imageUrl: "/images/ac-technician-elementor-homepage-sceenshot.jpg",
        category: "Services",
        tags: ["AC", "Technician", "Repair"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Animal Welfare",
        imageUrl: "/images/animal-welfare-home-page.jpg",
        category: "Nonprofit",
        tags: ["Animal", "Welfare", "Charity"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "App Landing Page",
        imageUrl: "/images/appplus-landing-page-04-600x3298.jpg",
        category: "Technology",
        tags: ["App", "Mobile", "Landing"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Aquarium",
        imageUrl: "/images/aquarium-04-home.jpg",
        category: "Pets & Animals",
        tags: ["Aquarium", "Fish", "Marine"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Architects",
        imageUrl: "/images/architects-home-page.jpg",
        category: "Architecture",
        tags: ["Architecture", "Design", "Building"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Arch Masters",
        imageUrl: "/images/archmasters-architecture-02-600x2302.jpg",
        category: "Architecture",
        tags: ["Architecture", "Design", "Construction"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Artist Christine",
        imageUrl: "/images/artist-christine-home-page.jpg",
        category: "Art & Creative",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Brizy",
        isPro: false
      },
      {
        title: "Artist Feb 20",
        imageUrl: "/images/artist-feb-20-home.jpg",
        category: "Art & Creative",
        tags: ["Artist", "Creative", "Gallery"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Artist Multipurpose",
        imageUrl: "/images/artist-multipurpose-02-1-600x1546.jpg",
        category: "Art & Creative",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Author",
        imageUrl: "/images/author-home.jpg",
        category: "Blog & Writing",
        tags: ["Author", "Writer", "Books"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Ayurveda",
        imageUrl: "/images/ayurveda-04-home-1.jpg",
        category: "Health & Wellness",
        tags: ["Ayurveda", "Wellness", "Holistic"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Baby Store",
        imageUrl: "/images/baby-stores-04-600x2813.jpg",
        category: "E-Commerce",
        tags: ["Baby", "Store", "Kids"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Barber Shop",
        imageUrl: "/images/barber-shop-02-home-2.jpg",
        category: "Beauty & Care",
        tags: ["Barber", "Haircut", "Grooming"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "BBQ Food Truck",
        imageUrl: "/images/bbq-food-truck-04.jpg",
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
