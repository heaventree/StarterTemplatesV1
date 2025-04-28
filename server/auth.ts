import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) return false;
    
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    // Make sure both buffers have the same length before comparison
    if (hashedBuf.length !== suppliedBuf.length) return false;
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  let store;
  
  // Use PostgreSQL session store in production, memory store in development
  if (process.env.NODE_ENV === 'production') {
    const PostgresStore = connectPgSimple(session);
    store = new PostgresStore({
      pool,
      tableName: 'session',
      createTableIfMissing: true
    });
  } else {
    const MemoryStore = createMemoryStore(session);
    store = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'template-admin-secret-key',
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Development-only route to create an admin user
  if (process.env.NODE_ENV === 'development') {
    app.get("/api/setup-admin", async (req, res) => {
      try {
        // Check for existing admin user
        const existingUser = await storage.getUserByUsername('admin');
        
        if (existingUser) {
          // If admin exists, update their password
          await storage.updateUser(existingUser.id, {
            password: await hashPassword('admin123')
          });
          
          res.status(200).json({ 
            message: 'Admin user updated successfully', 
            username: 'admin', 
            password: 'admin123' 
          });
        } else {
          // Create a new admin user
          await storage.createUser({
            username: 'admin',
            password: await hashPassword('admin123'),
            role: 'admin'
          });
          
          res.status(201).json({ 
            message: 'Admin user created successfully', 
            username: 'admin', 
            password: 'admin123' 
          });
        }
      } catch (error) {
        console.error('Error managing admin user:', error);
        res.status(500).json({ message: 'Failed to manage admin user' });
      }
    });
  }
}