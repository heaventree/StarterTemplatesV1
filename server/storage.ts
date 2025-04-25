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
        category: "Personal",
        tags: ["Nature", "Conservation", "Green"],
        pageBuilder: "Elementor",
        isPro: false,
        demoUrl: "https://websitedemos.net/love-nature-02"
      },
      {
        title: "Outdoor Adventure",
        imageUrl: "/images/outdoor-adventure-02-home.jpg",
        category: "Personal",
        tags: ["Outdoor", "Adventure", "Travel"],
        pageBuilder: "Gutenberg",
        isPro: true,
        demoUrl: "https://websitedemos.net/outdoor-adventure-02"
      },
      {
        title: "Brandstore",
        imageUrl: "/images/brandstore-02-1-600x1856.jpg",
        category: "eCommerce",
        tags: ["Brand", "Store", "Shopping"],
        pageBuilder: "Beaver Builder",
        isPro: false,
        demoUrl: "https://websitedemos.net/brandstore-02"
      },
      {
        title: "Electronic Store",
        imageUrl: "/images/electronic-stores-04-600x4955.jpg",
        category: "eCommerce",
        tags: ["Electronics", "Gadgets", "Tech"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/electronic-store-04"
      },
      {
        title: "Wellness Coach",
        imageUrl: "/images/wellness-coach-02-1-600x1726.jpg",
        category: "Professional",
        tags: ["Wellness", "Coaching", "Health"],
        pageBuilder: "Gutenberg",
        isPro: false,
        demoUrl: "https://websitedemos.net/wellness-coach-02"
      },
      {
        title: "Planet Earth",
        imageUrl: "/images/earth-02-600x1189.jpg",
        category: "Non Profit",
        tags: ["Earth", "Environment", "Conservation"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/earth-02"
      },
      {
        title: "Fashion Photography Portfolio",
        imageUrl: "/images/fashion-photography-04-600x2547.jpg",
        category: "Personal",
        tags: ["Fashion", "Photography", "Portfolio"],
        pageBuilder: "Beaver Builder",
        isPro: false,
        demoUrl: "https://websitedemos.net/fashion-photography-04"
      },
      {
        title: "Hope",
        imageUrl: "/images/hope-design.jpg",
        category: "Non Profit",
        tags: ["Charity", "Hope", "Donation"],
        pageBuilder: "Brizy",
        isPro: true,
        demoUrl: "https://websitedemos.net/hope"
      },
      {
        title: "Politician",
        imageUrl: "/images/politician-04-600x2550.jpg",
        category: "Professional",
        tags: ["Politician", "Campaign", "Government"],
        pageBuilder: "Elementor",
        isPro: false,
        demoUrl: "https://websitedemos.net/politician-04"
      },
      {
        title: "Alexandrina Kennedy – Designer",
        imageUrl: "/images/alexandrina-designer-600x900.jpg",
        category: "Professional",
        tags: ["Designer", "Portfolio", "Creative"],
        pageBuilder: "Gutenberg",
        isPro: true,
        demoUrl: "https://websitedemos.net/alexandrina-designer"
      },
      {
        title: "Lifestyle Blogger",
        imageUrl: "/images/lifestyle-blogger-04-600x2304.jpg",
        category: "Personal",
        tags: ["Lifestyle", "Blogger", "Writing"],
        pageBuilder: "Beaver Builder",
        isPro: false,
        demoUrl: "https://websitedemos.net/lifestyle-blogger-04"
      },
      {
        title: "Planet Earth Store",
        imageUrl: "/images/earth-store-02-600x1210.jpg",
        category: "eCommerce",
        tags: ["Eco", "Store", "Sustainable"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/earth-store-02"
      },
      {
        title: "Nexus News",
        imageUrl: "/images/news-blog-04-600x2428.jpg",
        category: "Professional",
        tags: ["News", "Blog", "Media"],
        pageBuilder: "Brizy",
        isPro: false,
        demoUrl: "https://websitedemos.net/news-blog-04"
      },
      {
        title: "Black Friday",
        imageUrl: "/images/black-friday-bonanza-04-600x2062.jpg",
        category: "eCommerce",
        tags: ["Sale", "Shopping", "Black Friday"],
        pageBuilder: "Elementor",
        isPro: true,
        demoUrl: "https://websitedemos.net/black-friday-bonanza-04"
      },
      {
        title: "Earthly Elegance",
        imageUrl: "/images/gardening-and-landscape-02-600x2964.jpg",
        category: "Professional",
        tags: ["Gardening", "Landscape", "Nature"],
        pageBuilder: "Gutenberg",
        isPro: false,
        demoUrl: "https://websitedemos.net/gardening-and-landscape-02"
      },
      // Additional templates to have more than 30 in total for pagination
      {
        title: "Accountant",
        imageUrl: "/images/accountant-02.jpg",
        category: "Professional",
        tags: ["Accounting", "Finance", "Tax"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "AC Technician",
        imageUrl: "/images/ac-technician-elementor-homepage-sceenshot.jpg",
        category: "Local Business",
        tags: ["AC", "Technician", "Repair"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Animal Welfare",
        imageUrl: "/images/animal-welfare-home-page.jpg",
        category: "Non Profit",
        tags: ["Animal", "Welfare", "Charity"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "App Landing Page",
        imageUrl: "/images/appplus-landing-page-04-600x3298.jpg",
        category: "Professional",
        tags: ["App", "Mobile", "Landing"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Aquarium",
        imageUrl: "/images/aquarium-04-home.jpg",
        category: "Local Business",
        tags: ["Aquarium", "Fish", "Marine"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Architects",
        imageUrl: "/images/architects-home-page.jpg",
        category: "Professional",
        tags: ["Architecture", "Design", "Building"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Arch Masters",
        imageUrl: "/images/archmasters-architecture-02-600x2302.jpg",
        category: "Professional",
        tags: ["Architecture", "Design", "Construction"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Artist Christine",
        imageUrl: "/images/artist-christine-home-page.jpg",
        category: "Personal",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Brizy",
        isPro: false
      },
      {
        title: "Artist Feb 20",
        imageUrl: "/images/artist-feb-20-home.jpg",
        category: "Personal",
        tags: ["Artist", "Creative", "Gallery"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Artist Multipurpose",
        imageUrl: "/images/artist-multipurpose-02-1-600x1546.jpg",
        category: "Personal",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Author",
        imageUrl: "/images/author-home.jpg",
        category: "Personal",
        tags: ["Author", "Writer", "Books"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Ayurveda",
        imageUrl: "/images/ayurveda-04-home-1.jpg",
        category: "Professional",
        tags: ["Ayurveda", "Wellness", "Holistic"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Baby Store",
        imageUrl: "/images/baby-stores-04-600x2813.jpg",
        category: "eCommerce",
        tags: ["Baby", "Store", "Kids"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Barber Shop",
        imageUrl: "/images/barber-shop-02-home-2.jpg",
        category: "Local Business",
        tags: ["Barber", "Haircut", "Grooming"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "BBQ Food Truck",
        imageUrl: "/images/bbq-food-truck-04.jpg",
        category: "Restaurant",
        tags: ["BBQ", "Food Truck", "Restaurant"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Adham Hoffman Designer",
        imageUrl: "/images/adham-hoffman-designer-600x900.jpg",
        category: "Professional",
        tags: ["Design", "Portfolio", "Creative"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Alexandrina Designer",
        imageUrl: "/images/alexandrina-designer-600x900.jpg",
        category: "Professional",
        tags: ["Design", "Portfolio", "Creative"],
        pageBuilder: "Brizy",
        isPro: true
      },
      {
        title: "Animal Welfare",
        imageUrl: "/images/animal-welfare-home-page.jpg",
        category: "Non Profit",
        tags: ["Animal", "NGO", "Charity"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "App Plus Landing Page",
        imageUrl: "/images/appplus-landing-page-04-600x3298.jpg",
        category: "Professional",
        tags: ["App", "Technology", "SaaS"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Aquarium",
        imageUrl: "/images/aquarium-04-home.jpg",
        category: "Local Business",
        tags: ["Aquarium", "Pets", "Marine"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Architects",
        imageUrl: "/images/architects-home-page.jpg",
        category: "Professional",
        tags: ["Architecture", "Design", "Construction"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Archmasters Architecture",
        imageUrl: "/images/archmasters-architecture-02-600x2302.jpg",
        category: "Professional",
        tags: ["Architecture", "Building", "Design"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Artist Christine",
        imageUrl: "/images/artist-christine-home-page.jpg",
        category: "Personal",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Artist Feb",
        imageUrl: "/images/artist-feb-20-home.jpg",
        category: "Personal",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Artist Multipurpose",
        imageUrl: "/images/artist-multipurpose-02-1-600x1546.jpg",
        category: "Personal",
        tags: ["Artist", "Creative", "Portfolio"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Author Home",
        imageUrl: "/images/author-home.jpg",
        category: "Personal",
        tags: ["Author", "Writer", "Books"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Ayurveda",
        imageUrl: "/images/ayurveda-04-home-1.jpg",
        category: "Professional",
        tags: ["Health", "Wellness", "Medicine"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Baby Stores",
        imageUrl: "/images/baby-stores-04-600x2813.jpg",
        category: "eCommerce",
        tags: ["Baby", "Kids", "Store"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Barber Shop",
        imageUrl: "/images/barber-shop-02-home-2.jpg",
        category: "Local Business",
        tags: ["Barber", "Haircut", "Grooming"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Beauty Products Store",
        imageUrl: "/images/beauty-products-store-02-home.jpg",
        category: "eCommerce",
        tags: ["Beauty", "Cosmetics", "Store"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Be Bold Beauty Store",
        imageUrl: "/images/be-bold-beauty-store-04-600x2255.jpg",
        category: "eCommerce",
        tags: ["Beauty", "Cosmetics", "Store"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Beer Launch",
        imageUrl: "/images/beer-launch-02.jpg",
        category: "Restaurant",
        tags: ["Beer", "Brewery", "Drinks"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Bestselling Author",
        imageUrl: "/images/bestselling-author-02-home.jpg",
        category: "Personal",
        tags: ["Author", "Books", "Writer"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Bike Modification",
        imageUrl: "/images/bike-modification-04.jpg",
        category: "Local Business",
        tags: ["Bikes", "Motorcycle", "Custom"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Bizpulse",
        imageUrl: "/images/bizpulse-04-600x3156.jpg",
        category: "Professional",
        tags: ["Business", "Corporate", "Consulting"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Black Friday",
        imageUrl: "/images/black-friday-04-600x2701.jpg",
        category: "eCommerce",
        tags: ["Sale", "Promotion", "Shopping"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Black Friday Bonanza",
        imageUrl: "/images/black-friday-bonanza-04-600x2062.jpg",
        category: "eCommerce",
        tags: ["Sale", "Promotion", "Shopping"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Black Friday Sale",
        imageUrl: "/images/black-friday-sale-04-600x2927.jpg",
        category: "eCommerce",
        tags: ["Sale", "Promotion", "Shopping"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Blingg Jewellery",
        imageUrl: "/images/blingg-jewellery-04-600x2006.jpg",
        category: "eCommerce",
        tags: ["Jewelry", "Accessories", "Store"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Blockchain Technology",
        imageUrl: "/images/blockchain-technology-04-600x2398.jpg",
        category: "Professional",
        tags: ["Blockchain", "Technology", "Crypto"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Blog",
        imageUrl: "/images/blog-02-1.jpg",
        category: "Personal",
        tags: ["Blog", "Writing", "Content"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Book Store",
        imageUrl: "/images/book-store-02-home.jpg",
        category: "eCommerce",
        tags: ["Books", "Store", "Reading"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Budget Hotel",
        imageUrl: "/images/budget-hotel-04-home-page.jpg",
        category: "Local Business",
        tags: ["Hotel", "Accommodation", "Hospitality"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Business Blog",
        imageUrl: "/images/business-blog-04-home.jpg",
        category: "Professional",
        tags: ["Business", "Blog", "Corporate"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Business Consultancy",
        imageUrl: "/images/business-consultancy-firm-04-home.jpg",
        category: "Professional",
        tags: ["Business", "Consulting", "Corporate"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Business Consulting",
        imageUrl: "/images/business-consulting-02-home.jpg",
        category: "Professional",
        tags: ["Business", "Consulting", "Corporate"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Business Magazine",
        imageUrl: "/images/business-magazine-04-home.jpg",
        category: "Professional",
        tags: ["Magazine", "News", "Business"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Cafe",
        imageUrl: "/images/cafe-04.jpg",
        category: "Restaurant",
        tags: ["Cafe", "Coffee", "Food"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Cafe Library",
        imageUrl: "/images/cafe-library-02-home.jpg",
        category: "Restaurant",
        tags: ["Cafe", "Library", "Books"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Cake Shop",
        imageUrl: "/images/cake-shop-04.jpg",
        category: "eCommerce",
        tags: ["Cake", "Bakery", "Food"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Calligraphy Artist",
        imageUrl: "/images/calligraphy-artist-02-home.jpg",
        category: "Personal",
        tags: ["Calligraphy", "Art", "Portfolio"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Car Repair",
        imageUrl: "/images/car-repair-02-homepage.jpg",
        category: "Local Business",
        tags: ["Car", "Repair", "Automotive"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Car Wash",
        imageUrl: "/images/car-wash-02-homepage.jpg",
        category: "Local Business",
        tags: ["Car", "Wash", "Service"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Catering Services",
        imageUrl: "/images/catering-services-04-home.jpg",
        category: "Restaurant",
        tags: ["Catering", "Food", "Events"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Ceramic Products Store",
        imageUrl: "/images/ceramic-products-store-04-600x3357.jpg",
        category: "eCommerce",
        tags: ["Ceramic", "Pottery", "Crafts"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Certified Life Coach",
        imageUrl: "/images/certified-life-coach-04.jpg",
        category: "Professional",
        tags: ["Coach", "Life", "Motivation"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Charity",
        imageUrl: "/images/charity-02.jpg",
        category: "Non Profit",
        tags: ["Charity", "Donation", "NGO"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Charity Home",
        imageUrl: "/images/charity-04-home.jpg",
        category: "Non Profit",
        tags: ["Charity", "Donation", "NGO"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Chartered Accountant",
        imageUrl: "/images/chartered-accountant-02-homepage.jpg",
        category: "Professional",
        tags: ["Accountant", "Finance", "Tax"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Childcare Blog",
        imageUrl: "/images/childcare-blog-02-home.jpg",
        category: "Professional",
        tags: ["Childcare", "Parenting", "Blog"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Christmas Shop",
        imageUrl: "/images/christmas-shop-04-600x2803.jpg",
        category: "eCommerce",
        tags: ["Christmas", "Holiday", "Seasonal"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Christmas Party",
        imageUrl: "/images/christmass-part-04-600x2430.jpg",
        category: "Professional",
        tags: ["Christmas", "Party", "Event"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Christmas Store",
        imageUrl: "/images/christmas-store-04-600x1880.jpg",
        category: "eCommerce",
        tags: ["Christmas", "Holiday", "Seasonal"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Church",
        imageUrl: "/images/church-04-home.jpg",
        category: "Non Profit",
        tags: ["Church", "Religion", "Faith"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Cleaning Agency",
        imageUrl: "/images/cleaning-agency-04-homepage.jpg",
        category: "Local Business",
        tags: ["Cleaning", "Service", "Home"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Cleaning Services",
        imageUrl: "/images/cleaning-services-04-homepage.jpg",
        category: "Local Business",
        tags: ["Cleaning", "Service", "Home"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Cleaning Services Home",
        imageUrl: "/images/cleaning-services-home-page.jpg",
        category: "Local Business",
        tags: ["Cleaning", "Service", "Home"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Clothing Store",
        imageUrl: "/images/clothing-store-02-600x3249.jpg",
        category: "eCommerce",
        tags: ["Clothing", "Fashion", "Store"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Coach",
        imageUrl: "/images/coach-02.jpg",
        category: "Professional",
        tags: ["Coach", "Mentor", "Training"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Coffee House",
        imageUrl: "/images/coffee-house-02-home-1.jpg",
        category: "Restaurant",
        tags: ["Coffee", "Cafe", "Food"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Coffee Shop",
        imageUrl: "/images/coffee-shop-02.jpg",
        category: "Restaurant",
        tags: ["Coffee", "Cafe", "Food"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Coffee Shop Modern",
        imageUrl: "/images/coffee-shop-04.jpg",
        category: "Restaurant",
        tags: ["Coffee", "Cafe", "Food"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Gift Shop",
        imageUrl: "/images/gift-shop-04-home-1.jpg",
        category: "eCommerce",
        tags: ["Gifts", "Shop", "Presents"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Guitarist",
        imageUrl: "/images/guitarist-02-home.jpg",
        category: "Personal",
        tags: ["Music", "Guitar", "Artist"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Gym Pro",
        imageUrl: "/images/gym-pro-04-600x3496.jpg",
        category: "Professional",
        tags: ["Fitness", "Gym", "Health"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Hair Salon",
        imageUrl: "/images/hair-salon-04-home.jpg",
        category: "Local Business",
        tags: ["Salon", "Hair", "Beauty"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Halloween Event",
        imageUrl: "/images/halloween-event-04-600x3358.jpg",
        category: "Professional",
        tags: ["Halloween", "Event", "Holiday"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Halloween Party",
        imageUrl: "/images/halloween-party-04-600x2209.jpg",
        category: "Professional",
        tags: ["Halloween", "Party", "Event"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Halloween Shop",
        imageUrl: "/images/halloween-shop-04-600x2926.jpg",
        category: "eCommerce",
        tags: ["Halloween", "Shop", "Holiday"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Health & Wellness",
        imageUrl: "/images/health-wellness-02-home.jpg",
        category: "Professional",
        tags: ["Health", "Wellness", "Fitness"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Heating & AC Technician",
        imageUrl: "/images/heating-and-ac-technician-02-home.jpg",
        category: "Local Business",
        tags: ["HVAC", "AC", "Technician"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Heritage Hotel",
        imageUrl: "/images/heritage-hotel-04-home-01.jpg",
        category: "Local Business",
        tags: ["Hotel", "Heritage", "Accommodation"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Home Decor",
        imageUrl: "/images/home-decor-04.jpg",
        category: "eCommerce",
        tags: ["Decor", "Home", "Interior"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Home Garden Decor",
        imageUrl: "/images/home-garden-decor-02-600x2687.jpg",
        category: "eCommerce",
        tags: ["Garden", "Decor", "Home"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Home Painting",
        imageUrl: "/images/home-painting-04-600x2893.jpg",
        category: "Local Business",
        tags: ["Painting", "Home", "Service"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Home Remodeling",
        imageUrl: "/images/home-remodeling-04-homepage.jpg",
        category: "Local Business",
        tags: ["Remodeling", "Home", "Construction"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Home Stay",
        imageUrl: "/images/home-stay-02-home.jpg",
        category: "Local Business",
        tags: ["Stay", "Accommodation", "Lodging"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Homestays",
        imageUrl: "/images/homestays-04-600x1992.jpg",
        category: "Local Business",
        tags: ["Homestay", "Accommodation", "Travel"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Hope",
        imageUrl: "/images/hope-design.jpg",
        category: "Non Profit",
        tags: ["Hope", "Charity", "Organization"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Horticulture",
        imageUrl: "/images/horticulture-02.jpg",
        category: "Professional",
        tags: ["Horticulture", "Plants", "Gardening"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Mountain Hotel",
        imageUrl: "/images/hotel-mountain-homepage.jpg",
        category: "Local Business",
        tags: ["Hotel", "Mountain", "Resort"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Wanderlust Travel Diary",
        imageUrl: "/images/id-18124-wanderlust-travel-diary-resize.jpg",
        category: "Personal",
        tags: ["Travel", "Diary", "Blog"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Travel Agency",
        imageUrl: "/images/id-22058-travel-agency-resize.jpg",
        category: "Professional",
        tags: ["Travel", "Agency", "Tourism"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Illustrator Portfolio",
        imageUrl: "/images/illustrator-portfolio-04-600x2438.jpg",
        category: "Personal",
        tags: ["Illustrator", "Portfolio", "Art"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Inessa Perfumes",
        imageUrl: "/images/inessa-perfumes-04-600x2287.jpg",
        category: "eCommerce",
        tags: ["Perfume", "Fragrance", "Beauty"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Injury & Accident Lawyer",
        imageUrl: "/images/injury-accident-lawyer-02-home.jpg",
        category: "Professional",
        tags: ["Lawyer", "Legal", "Injury"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Inspirational Speaker",
        imageUrl: "/images/inspirational-speaker-03-home.jpg",
        category: "Professional",
        tags: ["Speaker", "Motivation", "Inspiration"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Interior Designer",
        imageUrl: "/images/interior-designer-02-homepage.jpg",
        category: "Professional",
        tags: ["Designer", "Interior", "Home"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Interior Firm",
        imageUrl: "/images/interior-firm-02-home.jpg",
        category: "Professional",
        tags: ["Interior", "Design", "Firm"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Italian Restaurant",
        imageUrl: "/images/italian-restaurant-02-home-1.jpg",
        category: "Restaurant",
        tags: ["Italian", "Restaurant", "Food"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Jewellery",
        imageUrl: "/images/jewellery-04.jpg",
        category: "eCommerce",
        tags: ["Jewellery", "Accessories", "Fashion"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Jewellery Store",
        imageUrl: "/images/jewellery-store-02-home.jpg",
        category: "eCommerce",
        tags: ["Jewellery", "Store", "Accessories"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Joan Thomas - Travel Blogger",
        imageUrl: "/images/joanthomas-traveller-bio-600x900.jpg",
        category: "Personal",
        tags: ["Travel", "Blogger", "Bio"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Kate Stone Designer",
        imageUrl: "/images/kate-stone-designer-600x900.jpg",
        category: "Professional",
        tags: ["Designer", "Portfolio", "Creative"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Kathryn eBook Author",
        imageUrl: "/images/kathryn-ebook-author-02-600x2456.jpg",
        category: "Personal",
        tags: ["Author", "eBook", "Writer"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Kindergarten",
        imageUrl: "/images/kindergarten-04-home.jpg",
        category: "eLearning",
        tags: ["Education", "Kids", "School"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Language Tutors",
        imageUrl: "/images/language-tutors-02-600x2574.jpg",
        category: "eLearning",
        tags: ["Language", "Tutors", "Education"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Law Firm",
        imageUrl: "/images/law-firm-home-page.jpg",
        category: "Professional",
        tags: ["Law", "Legal", "Firm"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Law Firm Homepage",
        imageUrl: "/images/law-firm-homepage.jpg",
        category: "Professional",
        tags: ["Law", "Legal", "Firm"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Learn Baking",
        imageUrl: "/images/learn-baking-02-homepage.jpg",
        category: "eLearning",
        tags: ["Baking", "Cooking", "Course"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "LearnDash Academy",
        imageUrl: "/images/learndash-academy-02-home.jpg",
        category: "eLearning",
        tags: ["LearnDash", "Academy", "Education"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Learn Digital Marketing",
        imageUrl: "/images/learn-digital-marketing-02-homepage.jpg",
        category: "eLearning",
        tags: ["Marketing", "Digital", "Course"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Learn Meditations",
        imageUrl: "/images/learn-meditations-02-600x2852.jpg",
        category: "eLearning",
        tags: ["Meditation", "Wellness", "Course"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Learn Oil Painting",
        imageUrl: "/images/learn-oil-painting-02-homepage.jpg",
        category: "eLearning",
        tags: ["Painting", "Art", "Course"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Life Coach",
        imageUrl: "/images/life-coach-homepage.jpg",
        category: "Professional",
        tags: ["Coach", "Life", "Mentor"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Life Coach Sara John",
        imageUrl: "/images/life-coach-sara-john-1.jpg",
        category: "Professional",
        tags: ["Coach", "Life", "Personal"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Lifestyle Blogger",
        imageUrl: "/images/lifestyle-blogger-04-600x2304.jpg",
        category: "Personal",
        tags: ["Lifestyle", "Blogger", "Writing"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Local Bakery",
        imageUrl: "/images/local-bakery-600x900.jpg",
        category: "Local Business",
        tags: ["Bakery", "Food", "Local"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Local Business",
        imageUrl: "/images/local-business-02.jpg",
        category: "Local Business",
        tags: ["Business", "Local", "Service"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Locksmith",
        imageUrl: "/images/locksmith-02-600x3651.jpg",
        category: "Local Business",
        tags: ["Locksmith", "Security", "Service"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Lotus Spa",
        imageUrl: "/images/lotus-spa-02home-600x2915.jpg",
        category: "Local Business",
        tags: ["Spa", "Wellness", "Relaxation"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Luxury Hotel",
        imageUrl: "/images/luxury-hotel-02-600x989.jpg",
        category: "Local Business",
        tags: ["Hotel", "Luxury", "Accommodation"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Luxury Watches",
        imageUrl: "/images/luxury-watches-02-home.jpg",
        category: "eCommerce",
        tags: ["Watches", "Luxury", "Accessories"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Mark Thompson Portfolio",
        imageUrl: "/images/mark-thompson-02-home.jpg",
        category: "Personal",
        tags: ["Portfolio", "Designer", "Creative"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Marketing Agency",
        imageUrl: "/images/marketing-agency-02-home-1.jpg",
        category: "Professional",
        tags: ["Marketing", "Agency", "Business"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Marketing Freelancer",
        imageUrl: "/images/marketing-freelancer-04-home.jpg",
        category: "Professional",
        tags: ["Marketing", "Freelancer", "Services"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Medical",
        imageUrl: "/images/medical-04-home.jpg",
        category: "Professional",
        tags: ["Medical", "Healthcare", "Doctor"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Meal Plan",
        imageUrl: "/images/meal-plan-02-home.jpg",
        category: "eCommerce",
        tags: ["Meal", "Plan", "Food"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Mobile App",
        imageUrl: "/images/mobile-app-02-home.jpg",
        category: "Professional",
        tags: ["App", "Mobile", "Technology"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Mobile App Development",
        imageUrl: "/images/mobile-app-development-02-home-page-600x3111.jpg",
        category: "Professional",
        tags: ["App", "Development", "Technology"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Modern Cafe",
        imageUrl: "/images/modern-cafe-04-home-600x2782.jpg",
        category: "Restaurant",
        tags: ["Cafe", "Coffee", "Modern"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Modern Home Decor",
        imageUrl: "/images/modern-home-decor-02-home.jpg",
        category: "eCommerce",
        tags: ["Decor", "Home", "Interior"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Music Band",
        imageUrl: "/images/music-band-04-600x2475.jpg",
        category: "Personal",
        tags: ["Music", "Band", "Entertainment"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Music Producer",
        imageUrl: "/images/music-producer-02-600x2475.jpg",
        category: "Personal",
        tags: ["Music", "Producer", "Entertainment"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Nature Conservation",
        imageUrl: "/images/nature-conservation-02-home.jpg",
        category: "Non Profit",
        tags: ["Nature", "Conservation", "Environment"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "NGO",
        imageUrl: "/images/ngo-04-home.jpg",
        category: "Non Profit",
        tags: ["NGO", "Charity", "Organization"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Non Profit",
        imageUrl: "/images/non-profit-02-home.jpg",
        category: "Non Profit",
        tags: ["Charity", "Organization", "Donation"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Nutritionist",
        imageUrl: "/images/nutritionist-02-home.jpg",
        category: "Professional",
        tags: ["Nutrition", "Health", "Wellness"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Online Course",
        imageUrl: "/images/online-course-04-home.jpg",
        category: "eLearning",
        tags: ["Course", "Online", "Education"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Online Training",
        imageUrl: "/images/online-training-04-home.jpg",
        category: "eLearning",
        tags: ["Training", "Online", "Education"],
        pageBuilder: "Beaver Builder",
        isPro: false
      },
      {
        title: "Communities",
        imageUrl: "/images/communities-02-home.jpg",
        category: "Non Profit",
        tags: ["Community", "Social", "Neighborhood"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Conference Event",
        imageUrl: "/images/conference-event-02-1.jpg",
        category: "Professional",
        tags: ["Conference", "Event", "Business"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Construction",
        imageUrl: "/images/construction-04-600x2626.jpg",
        category: "Professional",
        tags: ["Construction", "Building", "Contractor"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Construction Homepage",
        imageUrl: "/images/construction-04-homepage.jpg",
        category: "Professional",
        tags: ["Construction", "Building", "Contractor"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Construction Co",
        imageUrl: "/images/construction-co-homepage.jpg",
        category: "Professional",
        tags: ["Construction", "Building", "Contractor"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Construction Company",
        imageUrl: "/images/construction-company-02-600x3410.jpg",
        category: "Professional",
        tags: ["Construction", "Building", "Contractor"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Construction Equipment",
        imageUrl: "/images/construction-equipments-04-600x1646.jpg",
        category: "eCommerce",
        tags: ["Construction", "Equipment", "Machinery"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Consultant",
        imageUrl: "/images/consultant-04-home.jpg",
        category: "Professional",
        tags: ["Consultant", "Business", "Advisor"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Consultant Firm",
        imageUrl: "/images/consultant-firm-04.jpg",
        category: "Professional",
        tags: ["Consultant", "Firm", "Business"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Cosmetic Store",
        imageUrl: "/images/cosmetic-store-homepage.jpg",
        category: "eCommerce",
        tags: ["Cosmetic", "Beauty", "Store"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Courier",
        imageUrl: "/images/courier-04-home.jpg",
        category: "Local Business",
        tags: ["Courier", "Delivery", "Shipping"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Covid Prevention",
        imageUrl: "/images/covid-prevention-02-home1.jpg",
        category: "Professional",
        tags: ["Covid", "Health", "Medical"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Co-Working Space",
        imageUrl: "/images/co-working-space-02-home.jpg",
        category: "Local Business",
        tags: ["Co-Working", "Office", "Space"],
        pageBuilder: "Gutenberg",
        isPro: true
      },
      {
        title: "Co-Working Space Modern",
        imageUrl: "/images/co-working-space-04.jpg",
        category: "Local Business",
        tags: ["Co-Working", "Office", "Space"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Creative Agency",
        imageUrl: "/images/creative-agency-04-1.jpg",
        category: "Professional",
        tags: ["Creative", "Agency", "Design"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Creative Blog",
        imageUrl: "/images/creative-blog-02-600x1468.jpg",
        category: "Personal",
        tags: ["Creative", "Blog", "Writing"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Creative Podcaster",
        imageUrl: "/images/creative-podcaster-02-home.jpg",
        category: "Personal",
        tags: ["Podcast", "Audio", "Media"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Criminal Lawyer",
        imageUrl: "/images/criminal-lawyer-04-home.jpg",
        category: "Professional",
        tags: ["Lawyer", "Legal", "Criminal"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Custom Printing",
        imageUrl: "/images/custom-printing-02-homepage.jpg",
        category: "eCommerce",
        tags: ["Printing", "Custom", "Service"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Custom Printing Modern",
        imageUrl: "/images/custom-printing-04.jpg",
        category: "eCommerce",
        tags: ["Printing", "Custom", "Service"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Cycle Shop",
        imageUrl: "/images/cycle-shop-02-home.jpg",
        category: "eCommerce",
        tags: ["Cycle", "Bike", "Sports"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Daycare",
        imageUrl: "/images/daycare-600x4393.jpg",
        category: "Local Business",
        tags: ["Daycare", "Children", "Childcare"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Dental Clinic",
        imageUrl: "/images/dental-clinic-home-page.jpg",
        category: "Professional",
        tags: ["Dental", "Clinic", "Healthcare"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Dental Clinic Homepage",
        imageUrl: "/images/dental-clinic-homepage.jpg",
        category: "Professional",
        tags: ["Dental", "Clinic", "Healthcare"],
        pageBuilder: "Elementor",
        isPro: false
      },
      {
        title: "Dentalist",
        imageUrl: "/images/dentalist-04-600x2683.jpg",
        category: "Professional",
        tags: ["Dental", "Dentist", "Healthcare"],
        pageBuilder: "Elementor",
        isPro: true
      },
      {
        title: "Design Resource",
        imageUrl: "/images/design-resource-02-600x2475.jpg",
        category: "eCommerce",
        tags: ["Design", "Resource", "Creative"],
        pageBuilder: "Gutenberg",
        isPro: false
      },
      {
        title: "Diagnostics Lab",
        imageUrl: "/images/diagnostics-lab-04.jpg",
        category: "Professional",
        tags: ["Diagnostics", "Lab", "Medical"],
        pageBuilder: "Beaver Builder",
        isPro: true
      },
      {
        title: "Digital Agency",
        imageUrl: "/images/digital-agency-02-home.jpg",
        category: "Professional",
        tags: ["Digital", "Agency", "Marketing"],
        pageBuilder: "Elementor",
        isPro: false
      }
    ];

    console.log(`Initializing ${templateData.length} templates...`);
    templateData.forEach((template, index) => {
      this.createTemplate(template);
      if (index === templateData.length - 1) {
        console.log(`Finished initializing templates. Total templates: ${this.templates.size}`);
      }
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
    return Array.from(this.templates.values()).filter(template => {
      // Case-insensitive matching with normalization of spaces to hyphens for comparison
      const normalizedTemplateCategory = template.category.toLowerCase().replace(/\s+/g, '-');
      const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
      return normalizedTemplateCategory === normalizedCategory;
    });
  }

  async getTemplatesByPageBuilder(pageBuilder: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => {
      // Case-insensitive matching for page builders
      return template.pageBuilder.toLowerCase() === pageBuilder.toLowerCase();
    });
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
