import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";
import path from "path";
import fs from "fs";

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://fmufhefglrljwmrnzrwh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtdWZoZWZnbHJsandtcm56cndoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE0ODU1MiwiZXhwIjoyMDcwNzI0NTUyfQ.yrqZ2MTsU1yYSUun_i4Le-LS3in1Fpajt9bOxpCTp50';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://localhost:4173",
    process.env.CORS_ORIGIN,
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// Helper function to handle Supabase errors
const handleSupabaseError = (error, res, operation) => {
  console.error(`${operation} error:`, error);
  res.status(500).json({ error: `Failed to ${operation.toLowerCase()}` });
};

// News Routes

// Get all news articles with pagination and filters
app.get("/api/news", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, featured } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .order('publish_date', { ascending: false })
      .range(from, to);

    if (category && category !== "all") {
      query = query.eq('category', category);
    }

    if (featured === "true") {
      query = query.eq('featured', true);
    }

    if (search) {
      query = query.or(`title->>en.ilike.%${search}%,title->>mn.ilike.%${search}%,content->>en.ilike.%${search}%,content->>mn.ilike.%${search}%`);
    }

    const { data: articles, error, count } = await query;

    if (error) {
      return handleSupabaseError(error, res, "fetch news");
    }

    res.json({
      articles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

// Get news categories
app.get("/api/news/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('category')
      .not('category', 'is', null);

    if (error) {
      console.error("Error fetching categories:", error);
      return res.status(500).json({ error: "Failed to fetch categories" });
    }

    const categories = [...new Set(data.map(item => item.category))];
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get single news article by ID
app.get("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Article not found" });
      }
      return handleSupabaseError(error, res, "fetch article");
    }

    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// Create new news article
app.post("/api/news", upload.single("image"), async (req, res) => {
  try {
    const articleData = JSON.parse(req.body.data);

    const newArticle = {
      ...articleData,
      publish_date: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (req.file) {
      newArticle.image_url = `/uploads/${req.file.filename}`;
    }

    const { data: article, error } = await supabase
      .from('articles')
      .insert(newArticle)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, res, "create article");
    }

    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

// Update news article
app.put("/api/news/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const articleData = JSON.parse(req.body.data);

    const updateData = {
      ...articleData,
      updated_at: new Date().toISOString(),
    };

    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    const { data: article, error } = await supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Article not found" });
      }
      return handleSupabaseError(error, res, "update article");
    }

    res.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
});

// Delete news article
app.delete("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      return handleSupabaseError(error, res, "delete article");
    }

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

// Events Routes

// Get all events
app.get("/api/events", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, upcoming } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .order('date', { ascending: true })
      .range(from, to);

    if (category && category !== "all") {
      query = query.eq('category', category);
    }

    if (upcoming === "true") {
      query = query.gte('date', new Date().toISOString().split("T")[0]);
    }

    if (search) {
      query = query.or(`title->>en.ilike.%${search}%,title->>mn.ilike.%${search}%,description->>en.ilike.%${search}%,description->>mn.ilike.%${search}%`);
    }

    const { data: events, error, count } = await query;

    if (error) {
      return handleSupabaseError(error, res, "fetch events");
    }

    res.json({
      events,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get single event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Event not found" });
      }
      return handleSupabaseError(error, res, "fetch event");
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

// Create new event
app.post("/api/events", upload.single("image"), async (req, res) => {
  try {
    const eventData = JSON.parse(req.body.data);

    const newEvent = {
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (req.file) {
      newEvent.image_url = `/uploads/${req.file.filename}`;
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert(newEvent)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, res, "create event");
    }

    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

// Update event
app.put("/api/events/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = JSON.parse(req.body.data);

    const updateData = {
      ...eventData,
      updated_at: new Date().toISOString(),
    };

    if (req.file) {
      updateData.image_url = `/uploads/${req.file.filename}`;
    }

    const { data: event, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Event not found" });
      }
      return handleSupabaseError(error, res, "update event");
    }

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      return handleSupabaseError(error, res, "delete event");
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Media/Gallery Routes

// Get all media items
app.get("/api/media", async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('media')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (type && type !== "all") {
      query = query.eq('type', type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data: mediaItems, error, count } = await query;

    if (error) {
      return handleSupabaseError(error, res, "fetch media");
    }

    res.json({
      mediaItems,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ error: "Failed to fetch media" });
  }
});

// Upload media
app.post("/api/media", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, description, tags, category } = req.body;

    const newMedia = {
      title,
      description,
      tags: tags ? JSON.parse(tags) : [],
      category: category || "uncategorized",
      type: req.file.mimetype.startsWith("image/")
        ? "image"
        : req.file.mimetype.startsWith("video/")
        ? "video"
        : "other",
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      original_name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: media, error } = await supabase
      .from('media')
      .insert(newMedia)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, res, "upload media");
    }

    res.status(201).json(media);
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ error: "Failed to upload media" });
  }
});

// Delete media
app.delete("/api/media/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Get media info first
    const { data: media, error: fetchError } = await supabase
      .from('media')
      .select('filename')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: "Media not found" });
      }
      return handleSupabaseError(fetchError, res, "fetch media");
    }

    // Delete file from uploads directory
    try {
      if (fs.existsSync(`uploads/${media.filename}`)) {
        fs.unlinkSync(`uploads/${media.filename}`);
      }
    } catch (fileError) {
      console.error("Error deleting file:", fileError);
    }

    // Delete from database
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', id);

    if (error) {
      return handleSupabaseError(error, res, "delete media");
    }

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ error: "Failed to delete media" });
  }
});

// Results Routes

// Get all results
app.get("/api/results", async (req, res) => {
  try {
    const { page = 1, limit = 10, category, year, search } = req.query;
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('results')
      .select('*', { count: 'exact' })
      .order('year', { ascending: false })
      .order('date', { ascending: false })
      .range(from, to);

    if (category && category !== "all") {
      query = query.eq('category', category);
    }

    if (year) {
      query = query.eq('year', parseInt(year));
    }

    if (search) {
      query = query.or(`title->>en.ilike.%${search}%,title->>mn.ilike.%${search}%,description->>en.ilike.%${search}%,description->>mn.ilike.%${search}%`);
    }

    const { data: results, error, count } = await query;

    if (error) {
      return handleSupabaseError(error, res, "fetch results");
    }

    res.json({
      results,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(count / parseInt(limit)),
        total: count,
      },
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// Create new result
app.post("/api/results", async (req, res) => {
  try {
    const newResult = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from('results')
      .insert(newResult)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, res, "create result");
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ error: "Failed to create result" });
  }
});

// Update result
app.put("/api/results/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from('results')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Result not found" });
      }
      return handleSupabaseError(error, res, "update result");
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ error: "Failed to update result" });
  }
});

// Delete result
app.delete("/api/results/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('results')
      .delete()
      .eq('id', id);

    if (error) {
      return handleSupabaseError(error, res, "delete result");
    }

    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ error: "Failed to delete result" });
  }
});

// Sponsors Routes

// Get all sponsors
app.get("/api/sponsors", async (req, res) => {
  try {
    const { active, tier } = req.query;

    let query = supabase
      .from('sponsors')
      .select('*')
      .order('order', { ascending: true })
      .order('name', { ascending: true });

    if (active === "true") {
      query = query.eq('active', true);
    }

    if (tier && tier !== "all") {
      query = query.eq('tier', tier);
    }

    const { data: sponsors, error } = await query;

    if (error) {
      return handleSupabaseError(error, res, "fetch sponsors");
    }

    // Add display logic for sponsors without logos
    const sponsorsWithDisplayLogic = sponsors.map(sponsor => ({
      ...sponsor,
      show_name_fallback: !sponsor.logo_url || sponsor.logo_url.trim() === ''
    }));

    res.json(sponsorsWithDisplayLogic);
  } catch (error) {
    console.error("Error fetching sponsors:", error);
    res.status(500).json({ error: "Failed to fetch sponsors" });
  }
});

// Create new sponsor
app.post("/api/sponsors", upload.single("logo"), async (req, res) => {
  try {
    const sponsorData = JSON.parse(req.body.data);

    const newSponsor = {
      ...sponsorData,
      active: sponsorData.active !== undefined ? sponsorData.active : true,
      order: sponsorData.order || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (req.file) {
      newSponsor.logo_url = `/uploads/${req.file.filename}`;
    }

    const { data: sponsor, error } = await supabase
      .from('sponsors')
      .insert(newSponsor)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, res, "create sponsor");
    }

    res.status(201).json(sponsor);
  } catch (error) {
    console.error("Error creating sponsor:", error);
    res.status(500).json({ error: "Failed to create sponsor" });
  }
});

// Update sponsor
app.put("/api/sponsors/:id", upload.single("logo"), async (req, res) => {
  try {
    const { id } = req.params;
    const sponsorData = JSON.parse(req.body.data);

    const updateData = {
      ...sponsorData,
      updated_at: new Date().toISOString(),
    };

    if (req.file) {
      updateData.logo_url = `/uploads/${req.file.filename}`;
    }

    const { data: sponsor, error } = await supabase
      .from('sponsors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Sponsor not found" });
      }
      return handleSupabaseError(error, res, "update sponsor");
    }

    res.json(sponsor);
  } catch (error) {
    console.error("Error updating sponsor:", error);
    res.status(500).json({ error: "Failed to update sponsor" });
  }
});

// Delete sponsor
app.delete("/api/sponsors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id);

    if (error) {
      return handleSupabaseError(error, res, "delete sponsor");
    }

    res.json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    console.error("Error deleting sponsor:", error);
    res.status(500).json({ error: "Failed to delete sponsor" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    database: "Supabase"
  });
});

// Data Management Endpoints

// Get collection stats
app.get("/api/stats", async (req, res) => {
  try {
    const tables = ['articles', 'events', 'media', 'results', 'sponsors'];
    const stats = {};

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`Error counting ${table}:`, error);
        stats[table] = 0;
      } else {
        stats[table] = count;
      }
    }

    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch collection stats" });
  }
});

// Function to find available port
async function findAvailablePort(startPort) {
  const net = await import("net");
  return new Promise((resolve) => {
    const server = net.default.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on("error", () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Initialize and start server
async function startServer() {
  try {
    // Test Supabase connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message !== 'Invalid Refresh Token: Already expired') {
      console.error('Supabase connection error:', error);
      process.exit(1);
    }

    console.log('✅ Connected to Supabase successfully!');

    // Find available port if the default is in use
    const availablePort = await findAvailablePort(PORT);

    if (availablePort !== PORT) {
      console.log(`Port ${PORT} is in use, using port ${availablePort} instead`);
    }

    app.listen(availablePort, () => {
      console.log(`✅ Server running on port ${availablePort}`);
      console.log(`🌐 API Base URL: http://localhost:${availablePort}`);
      console.log(`🏥 Health Check: http://localhost:${availablePort}/api/health`);
      console.log(`🗄️ Database: Supabase (PostgreSQL)`);

      if (availablePort !== PORT) {
        console.log(`\n⚠️  Note: Update VITE_API_URL in .env to http://localhost:${availablePort}`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});

startServer().catch(console.error);
