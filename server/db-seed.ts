import { db } from './db';
import { users, templates, pageBuilders, tasks } from '@shared/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { fullTemplateData } from '@shared/data/template-data';

async function seedDatabase() {
  console.log('Starting database seeding...');

  // Check if we have users already
  const existingUsers = await db.select().from(users);
  
  if (existingUsers.length > 0) {
    console.log('Database already has data. Skipping seeding.');
    return;
  }

  console.log('Seeding users...');
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.insert(users).values({
    username: 'admin',
    password: hashedPassword,
    role: 'admin',
  });

  // Seed page builders
  console.log('Seeding page builders...');
  const pageBuilderData = [
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
  
  await db.insert(pageBuilders).values(pageBuilderData);

  // Seed all templates (approx. 280+ items)
  console.log(`Seeding ${fullTemplateData.length} templates...`);
  
  // Insert templates in batches to avoid overwhelming the database
  const BATCH_SIZE = 50;
  for (let i = 0; i < fullTemplateData.length; i += BATCH_SIZE) {
    const batch = fullTemplateData.slice(i, i + BATCH_SIZE);
    await db.insert(templates).values(batch);
    console.log(`Seeded templates batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(fullTemplateData.length / BATCH_SIZE)}`);
  }
  
  console.log(`Successfully seeded ${fullTemplateData.length} templates`);

  // Seed CMS roadmap tasks
  console.log('Seeding roadmap tasks...');
  
  // Phase 1: Foundation (Q2 2025)
  const phase1AuthTasks = [
    {
      title: "Role-based access control",
      description: "Implement role-based access control (Admin, Editor, Contributor)",
      status: "in-progress",
      priority: "high",
      phase: "Phase 1",
      category: "Authentication & User Management",
      createdBy: 1,
      dueDate: new Date(2025, 3, 30) // April 30, 2025
    },
    {
      title: "Secure authentication system",
      description: "Set up a secure authentication system with JWT",
      status: "completed",
      priority: "high",
      phase: "Phase 1",
      category: "Authentication & User Management",
      createdBy: 1,
      dueDate: new Date(2025, 3, 15) // April 15, 2025
    },
    {
      title: "User profile management",
      description: "Create user profile management functionality",
      status: "todo",
      priority: "medium",
      phase: "Phase 1",
      category: "Authentication & User Management",
      createdBy: 1,
      dueDate: new Date(2025, 4, 15) // May 15, 2025
    },
    {
      title: "Password reset functionality",
      description: "Implement password reset functionality with email verification",
      status: "todo",
      priority: "medium",
      phase: "Phase 1",
      category: "Authentication & User Management",
      createdBy: 1,
      dueDate: new Date(2025, 4, 30) // May 30, 2025
    }
  ];

  const phase1ContentTasks = [
    {
      title: "Template CRUD operations",
      description: "Implement Create, Read, Update, Delete operations for templates",
      status: "in-progress",
      priority: "high",
      phase: "Phase 1",
      category: "Basic Content Management",
      createdBy: 1,
      dueDate: new Date(2025, 4, 1) // May 1, 2025
    },
    {
      title: "Category management",
      description: "Create category management system for templates",
      status: "todo",
      priority: "medium",
      phase: "Phase 1",
      category: "Basic Content Management",
      createdBy: 1,
      dueDate: new Date(2025, 5, 15) // June 15, 2025
    },
    {
      title: "Tag management",
      description: "Implement tag management system for templates",
      status: "todo",
      priority: "medium",
      phase: "Phase 1",
      category: "Basic Content Management",
      createdBy: 1,
      dueDate: new Date(2025, 5, 30) // June 30, 2025
    },
    {
      title: "Basic media library",
      description: "Create a basic media library for storing and managing images",
      status: "todo",
      priority: "high",
      phase: "Phase 1",
      category: "Basic Content Management",
      createdBy: 1,
      dueDate: new Date(2025, 6, 15) // July 15, 2025
    }
  ];

  // Phase 2: Enhanced Features (Q3 2025)
  const phase2TemplateTasks = [
    {
      title: "Template versioning",
      description: "Implement template versioning to track changes",
      status: "todo",
      priority: "high",
      phase: "Phase 2",
      category: "Advanced Template Management",
      createdBy: 1,
      dueDate: new Date(2025, 6, 30) // July 30, 2025
    },
    {
      title: "Template previews",
      description: "Add template preview functionality",
      status: "todo",
      priority: "medium",
      phase: "Phase 2",
      category: "Advanced Template Management",
      createdBy: 1,
      dueDate: new Date(2025, 7, 15) // August 15, 2025
    },
    {
      title: "Batch operations",
      description: "Implement batch operations for templates",
      status: "todo",
      priority: "medium",
      phase: "Phase 2",
      category: "Advanced Template Management",
      createdBy: 1,
      dueDate: new Date(2025, 7, 30) // August 30, 2025
    }
  ];
  
  const phase2MediaTasks = [
    {
      title: "Enhanced media library",
      description: "Create enhanced media library with search functionality",
      status: "todo",
      priority: "high",
      phase: "Phase 2",
      category: "Media Management",
      createdBy: 1,
      dueDate: new Date(2025, 8, 15) // September 15, 2025
    },
    {
      title: "Image optimization",
      description: "Implement automatic image optimization",
      status: "todo",
      priority: "medium",
      phase: "Phase 2",
      category: "Media Management",
      createdBy: 1,
      dueDate: new Date(2025, 8, 30) // September 30, 2025
    }
  ];
  
  // Phase 3: Integration & Scaling (Q4 2025)
  const phase3ApiTasks = [
    {
      title: "RESTful API for templates",
      description: "Develop a comprehensive RESTful API for templates",
      status: "todo",
      priority: "high",
      phase: "Phase 3",
      category: "API Development",
      createdBy: 1,
      dueDate: new Date(2025, 9, 15) // October 15, 2025
    },
    {
      title: "API authentication",
      description: "Implement secure API authentication",
      status: "todo",
      priority: "high",
      phase: "Phase 3",
      category: "API Development",
      createdBy: 1,
      dueDate: new Date(2025, 9, 30) // October 30, 2025
    }
  ];
  
  // Phase 4: Advanced Features (Q1 2026)
  const phase4AnalyticsTasks = [
    {
      title: "Analytics dashboard",
      description: "Create a comprehensive analytics dashboard",
      status: "todo",
      priority: "high",
      phase: "Phase 4",
      category: "Analytics & Reporting",
      createdBy: 1,
      dueDate: new Date(2026, 0, 15) // January 15, 2026
    },
    {
      title: "Custom report generation",
      description: "Build custom report generation functionality",
      status: "todo",
      priority: "medium",
      phase: "Phase 4",
      category: "Analytics & Reporting",
      createdBy: 1,
      dueDate: new Date(2026, 0, 30) // January 30, 2026
    }
  ];
  
  // Combine all tasks
  const allTasks = [
    ...phase1AuthTasks,
    ...phase1ContentTasks,
    ...phase2TemplateTasks,
    ...phase2MediaTasks,
    ...phase3ApiTasks,
    ...phase4AnalyticsTasks
  ];
  
  // Insert all tasks
  for (const task of allTasks) {
    // Ensure required fields are not undefined
    const taskToInsert = {
      title: task.title,
      description: task.description || null,
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      phase: task.phase,
      category: task.category,
      assignedTo: task.assignedTo !== undefined ? task.assignedTo : null,
      createdBy: task.createdBy || 1,
      dueDate: task.dueDate || null
    };
    
    await db.insert(tasks).values(taskToInsert);
  }

  console.log('Database seeding completed!');
}

seedDatabase().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});