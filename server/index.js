import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME || 'maio-news';

let db;
let client;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
async function connectToDatabase() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Connected to MongoDB: ${DB_NAME}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// News Routes

// Get all news articles with pagination and filters
app.get('/api/news', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, featured } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.mn': { $regex: search, $options: 'i' } },
        { 'content.en': { $regex: search, $options: 'i' } },
        { 'content.mn': { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (featured === 'true') {
      filter.featured = true;
    }

    const total = await db.collection('articles').countDocuments(filter);
    const articles = await db.collection('articles')
      .find(filter)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.json({
      articles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news articles' });
  }
});

// Get single news article by ID
app.get('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }
    
    const article = await db.collection('articles').findOne({ _id: new ObjectId(id) });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// Create new news article
app.post('/api/news', upload.single('image'), async (req, res) => {
  try {
    const articleData = JSON.parse(req.body.data);
    
    const newArticle = {
      ...articleData,
      _id: new ObjectId(),
      publishDate: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (req.file) {
      newArticle.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    await db.collection('articles').insertOne(newArticle);
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Update news article
app.put('/api/news/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }
    
    const articleData = JSON.parse(req.body.data);
    
    const updateData = {
      ...articleData,
      updatedAt: new Date(),
      updatedDate: new Date().toISOString().split('T')[0]
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const result = await db.collection('articles').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const updatedArticle = await db.collection('articles').findOne({ _id: new ObjectId(id) });
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// Delete news article
app.delete('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }
    
    const result = await db.collection('articles').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Get news categories
app.get('/api/news/categories', async (req, res) => {
  try {
    const categories = await db.collection('articles').distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Events Routes

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search, upcoming } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.mn': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.mn': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (upcoming === 'true') {
      filter.date = { $gte: new Date().toISOString().split('T')[0] };
    }

    const total = await db.collection('events').countDocuments(filter);
    const events = await db.collection('events')
      .find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.json({
      events,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }
    
    const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create new event
app.post('/api/events', upload.single('image'), async (req, res) => {
  try {
    const eventData = JSON.parse(req.body.data);
    
    const newEvent = {
      ...eventData,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (req.file) {
      newEvent.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    await db.collection('events').insertOne(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Update event
app.put('/api/events/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }
    
    const eventData = JSON.parse(req.body.data);
    
    const updateData = {
      ...eventData,
      updatedAt: new Date()
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const updatedEvent = await db.collection('events').findOne({ _id: new ObjectId(id) });
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }
    
    const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// Media/Gallery Routes

// Get all media items
app.get('/api/media', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let filter = {};
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const total = await db.collection('media').countDocuments(filter);
    const mediaItems = await db.collection('media')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.json({
      mediaItems,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

// Upload media
app.post('/api/media', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, tags, category } = req.body;
    
    const newMedia = {
      _id: new ObjectId(),
      title,
      description,
      tags: tags ? JSON.parse(tags) : [],
      category: category || 'uncategorized',
      type: req.file.mimetype.startsWith('image/') ? 'image' : req.file.mimetype.startsWith('video/') ? 'video' : 'other',
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('media').insertOne(newMedia);
    res.status(201).json(newMedia);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Delete media
app.delete('/api/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid media ID' });
    }
    
    const media = await db.collection('media').findOne({ _id: new ObjectId(id) });
    
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Delete file from uploads directory
    try {
      if (fs.existsSync(`uploads/${media.filename}`)) {
        fs.unlinkSync(`uploads/${media.filename}`);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
    }
    
    const result = await db.collection('media').deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// Results Routes

// Get all results
app.get('/api/results', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, year, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (year) {
      filter.year = parseInt(year);
    }
    
    if (search) {
      filter.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.mn': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.mn': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await db.collection('results').countDocuments(filter);
    const results = await db.collection('results')
      .find(filter)
      .sort({ year: -1, date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();

    res.json({
      results,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Create new result
app.post('/api/results', async (req, res) => {
  try {
    const newResult = {
      ...req.body,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('results').insertOne(newResult);
    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error creating result:', error);
    res.status(500).json({ error: 'Failed to create result' });
  }
});

// Update result
app.put('/api/results/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid result ID' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('results').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    const updatedResult = await db.collection('results').findOne({ _id: new ObjectId(id) });
    res.json(updatedResult);
  } catch (error) {
    console.error('Error updating result:', error);
    res.status(500).json({ error: 'Failed to update result' });
  }
});

// Delete result
app.delete('/api/results/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid result ID' });
    }
    
    const result = await db.collection('results').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    res.json({ message: 'Result deleted successfully' });
  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Failed to delete result' });
  }
});

// Sponsors Routes

// Get all sponsors
app.get('/api/sponsors', async (req, res) => {
  try {
    const { active } = req.query;
    
    let filter = {};
    if (active === 'true') {
      filter.active = true;
    }

    const sponsors = await db.collection('sponsors')
      .find(filter)
      .sort({ order: 1, name: 1 })
      .toArray();

    res.json(sponsors);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
});

// Create new sponsor
app.post('/api/sponsors', upload.single('logo'), async (req, res) => {
  try {
    const sponsorData = JSON.parse(req.body.data);
    
    const newSponsor = {
      ...sponsorData,
      _id: new ObjectId(),
      active: sponsorData.active !== undefined ? sponsorData.active : true,
      order: sponsorData.order || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (req.file) {
      newSponsor.logoUrl = `/uploads/${req.file.filename}`;
    }
    
    await db.collection('sponsors').insertOne(newSponsor);
    res.status(201).json(newSponsor);
  } catch (error) {
    console.error('Error creating sponsor:', error);
    res.status(500).json({ error: 'Failed to create sponsor' });
  }
});

// Update sponsor
app.put('/api/sponsors/:id', upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid sponsor ID' });
    }
    
    const sponsorData = JSON.parse(req.body.data);
    
    const updateData = {
      ...sponsorData,
      updatedAt: new Date()
    };
    
    if (req.file) {
      updateData.logoUrl = `/uploads/${req.file.filename}`;
    }
    
    const result = await db.collection('sponsors').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    
    const updatedSponsor = await db.collection('sponsors').findOne({ _id: new ObjectId(id) });
    res.json(updatedSponsor);
  } catch (error) {
    console.error('Error updating sponsor:', error);
    res.status(500).json({ error: 'Failed to update sponsor' });
  }
});

// Delete sponsor
app.delete('/api/sponsors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid sponsor ID' });
    }
    
    const result = await db.collection('sponsors').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Sponsor not found' });
    }
    
    res.json({ message: 'Sponsor deleted successfully' });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    res.status(500).json({ error: 'Failed to delete sponsor' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Function to find available port
async function findAvailablePort(startPort) {
  const net = await import('net');
  return new Promise((resolve) => {
    const server = net.default.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Initialize database and start server
async function startServer() {
  await connectToDatabase();
  
  // Initialize collections with sample data if they don't exist
  const collections = {
    articles: await db.collection('articles').countDocuments(),
    events: await db.collection('events').countDocuments(),
    media: await db.collection('media').countDocuments(),
    results: await db.collection('results').countDocuments(),
    sponsors: await db.collection('sponsors').countDocuments()
  };

  // Initialize Articles
  if (collections.articles === 0) {
    console.log('Initializing articles collection...');
    const sampleArticles = [
      {
        title: {
          en: 'MAIO 2025 Registration Now Open',
          mn: 'MAIO 2025 бүртгэл нээлттэй боллоо'
        },
        content: {
          en: 'Registration for the Mongolian AI Olympiad 2025 is now open. Join us for the most exciting AI competition in Mongolia. This year features new categories including Natural Language Processing, Computer Vision, and Reinforcement Learning.',
          mn: 'Монголын AI Олимпиад 2025-д бүртгүүлэх боломжтой боллоо. Монгол улсын хамгийн сонирхолтой AI тэмцээнд оролцоорой. Энэ жил Байгалийн хэлний боловсруулалт, Компьютер харааны технологи, Reinforcement Learning зэрэг шинэ төрлүүд нэмэгдлээ.'
        },
        summary: {
          en: 'Join the most exciting AI competition in Mongolia with new categories.',
          mn: 'Монгол улсын хамгийн сонирхолтой AI тэмцээнд шинэ төрлүүдтэйгээр оролцоорой.'
        },
        category: 'announcement',
        author: 'MAIO Team',
        publishDate: '2025-01-15',
        imageUrl: '/images/Registration.jpg',
        tags: ['registration', 'competition', '2025'],
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: {
          en: 'Results of MAIO 2024 Announced',
          mn: 'MAIO 2024 үр дүн зарлагдлаа'
        },
        content: {
          en: 'We are pleased to announce the results of the Mongolian AI Olympiad 2024. After a fierce competition, Team AlphaQuest has won the grand prize with their innovative solution for urban traffic optimization using reinforcement learning.',
          mn: 'Бид Монголын AI Олимпиад 2024-ийн үр дүнг танилцуулахад таатай байна. Хүчтэй өрсөлдөөний дараа AlphaQuest баг reinforcement learning ашиглан хотын замын хөдөлгөөнийг оновчлох шинэлэг шийдлээрээ тэргүүн байр эзэлжээ.'
        },
        summary: {
          en: 'Team AlphaQuest wins MAIO 2024 with their urban traffic optimization solution.',
          mn: 'AlphaQuest баг хотын замын хөдөлгөөн оновчлох шийдлээрээ MAIO 2024-т түрүүллээ.'
        },
        category: 'results',
        author: 'Judging Committee',
        publishDate: '2024-12-15',
        imageUrl: '/images/ArtificialIntelligence.jpg',
        tags: ['results', '2024', 'winners'],
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('articles').insertMany(sampleArticles);
  }

  // Initialize Events
  if (collections.events === 0) {
    console.log('Initializing events collection...');
    const sampleEvents = [
      {
        title: {
          en: 'MAIO 2025 Final Competition',
          mn: 'MAIO 2025 эцсийн тэмцээн'
        },
        description: {
          en: 'The final round of Mongolian AI Olympiad 2025 where teams will present their AI solutions.',
          mn: 'Монголын AI Олимпиад 2025-ийн эцсийн шат, багууд өөрсдийн AI шийдлийг танилцуулна.'
        },
        date: '2025-06-15',
        time: '09:00',
        location: {
          en: 'NUM, Main Campus',
          mn: 'МУИС, Төв байр'
        },
        category: 'competition',
        imageUrl: '/images/background.jpg',
        participants: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: {
          en: 'AI Workshop for Beginners',
          mn: 'Анхан шатны AI сургалт'
        },
        description: {
          en: 'Learn the basics of Artificial Intelligence and Machine Learning in this comprehensive workshop.',
          mn: 'Хиймэл оюун ухаан болон Машин сургалтын үндсийг энэхүү иж бүрэн сургалтаар суралцаарай.'
        },
        date: '2025-03-20',
        time: '14:00',
        location: {
          en: 'Online via Zoom',
          mn: 'Zoom-ээр онлайнаар'
        },
        category: 'workshop',
        imageUrl: '/images/placeholder.jpg',
        participants: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('events').insertMany(sampleEvents);
  }

  // Initialize Media
  if (collections.media === 0) {
    console.log('Initializing media collection...');
    const sampleMedia = [
      {
        title: 'MAIO 2024 Winners Ceremony',
        description: 'Highlights from the winners ceremony of MAIO 2024',
        category: 'ceremony',
        type: 'image',
        url: '/images/ArtificialIntelligence.jpg',
        filename: 'ArtificialIntelligence.jpg',
        originalName: 'MAIO-2024-ceremony.jpg',
        tags: ['ceremony', '2024', 'winners'],
        size: 1024000,
        mimetype: 'image/jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Registration Process',
        description: 'Step by step registration guide',
        category: 'guide',
        type: 'image',
        url: '/images/Registration.jpg',
        filename: 'Registration.jpg',
        originalName: 'registration-guide.jpg',
        tags: ['guide', 'registration', 'help'],
        size: 856000,
        mimetype: 'image/jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('media').insertMany(sampleMedia);
  }

  // Initialize Results
  if (collections.results === 0) {
    console.log('Initializing results collection...');
    const sampleResults = [
      {
        title: {
          en: 'MAIO 2024 Final Results',
          mn: 'MAIO 2024 эцсийн үр дүн'
        },
        description: {
          en: 'Complete results from the Mongolian AI Olympiad 2024',
          mn: 'Монголын AI Олимпиад 2024-ийн бүрэн үр дүн'
        },
        year: 2024,
        date: '2024-12-15',
        category: 'final',
        rankings: [
          { rank: 1, team: 'AlphaQuest', score: 95, members: ['B.Batbayar', 'T.Temuulen'] },
          { rank: 2, team: 'Neural Knights', score: 89, members: ['S.Saruul', 'G.Ganbat'] },
          { rank: 3, team: 'Data Dragons', score: 84, members: ['D.Dorj', 'M.Munkh'] }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('results').insertMany(sampleResults);
  }

  // Initialize Sponsors
  if (collections.sponsors === 0) {
    console.log('Initializing sponsors collection...');
    const sampleSponsors = [
      {
        name: 'TechCorp Mongolia',
        description: 'Leading technology company in Mongolia',
        website: 'https://techcorp.mn',
        logoUrl: '/images/placeholder.jpg',
        tier: 'gold',
        active: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'AI Solutions Ltd',
        description: 'Artificial Intelligence consulting firm',
        website: 'https://aisolutions.mn',
        logoUrl: '/images/placeholder.jpg',
        tier: 'silver',
        active: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    await db.collection('sponsors').insertMany(sampleSponsors);
  }

  console.log('Database initialization completed');
  console.log(`Collections status:`, {
    articles: await db.collection('articles').countDocuments(),
    events: await db.collection('events').countDocuments(),
    media: await db.collection('media').countDocuments(),
    results: await db.collection('results').countDocuments(),
    sponsors: await db.collection('sponsors').countDocuments()
  });
  
  // Find available port if the default is in use
  const availablePort = await findAvailablePort(PORT);
  
  if (availablePort !== PORT) {
    console.log(`Port ${PORT} is in use, using port ${availablePort} instead`);
  }
  
  app.listen(availablePort, () => {
    console.log(`✅ Server running on port ${availablePort}`);
    console.log(`🌐 API Base URL: http://localhost:${availablePort}`);
    console.log(`🏥 Health Check: http://localhost:${availablePort}/api/health`);
    
    if (availablePort !== PORT) {
      console.log(`\n⚠️  Note: Update VITE_API_URL in .env to http://localhost:${availablePort}`);
    }
  });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (client) {
    await client.close();
  }
  process.exit(0);
});

startServer().catch(console.error);
