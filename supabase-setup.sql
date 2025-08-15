-- Supabase Setup SQL
-- Run this in your Supabase SQL Editor to create tables

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'cyI+bAhSW+u2FlcY85ArWZMxD69xF+MEGvWk3G/0r/FsE1tbMV9PggvfRJJG69E7qbDQcb3iWsPSzTjUfYjLFA==';

-- Create a simple todos table for testing
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for anonymous users (for development only)
CREATE POLICY "Allow all operations for todos" ON todos
  FOR ALL 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create articles table (matching your existing MongoDB structure)
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title JSONB NOT NULL, -- {"en": "English title", "mn": "Mongolian title"}
  content JSONB NOT NULL, -- {"en": "English content", "mn": "Mongolian content"}
  category TEXT,
  tags TEXT[],
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  publish_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create policy for articles
CREATE POLICY "Allow all operations for articles" ON articles
  FOR ALL 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create events table (matching your existing MongoDB structure)
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title JSONB NOT NULL, -- {"en": "English title", "mn": "Mongolian title"}
  description JSONB, -- {"en": "English description", "mn": "Mongolian description"}
  category TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for events
CREATE POLICY "Allow all operations for events" ON events
  FOR ALL 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create media table (matching your existing MongoDB structure)
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  tags TEXT[],
  category TEXT DEFAULT 'uncategorized',
  type TEXT NOT NULL, -- 'image', 'video', 'other'
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size BIGINT,
  mimetype TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create policy for media
CREATE POLICY "Allow all operations for media" ON media
  FOR ALL 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create results table (matching your existing MongoDB structure)
CREATE TABLE IF NOT EXISTS results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title JSONB NOT NULL, -- {"en": "English title", "mn": "Mongolian title"}
  description JSONB, -- {"en": "English description", "mn": "Mongolian description"}
  category TEXT,
  year INTEGER,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- Create policy for results
CREATE POLICY "Allow all operations for results" ON results
  FOR ALL 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create sponsors table (matching your existing MongoDB structure)
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Create policy for sponsors
CREATE POLICY "Allow all operations for sponsors" ON sponsors
  FOR ALL 
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);

CREATE INDEX IF NOT EXISTS idx_results_year ON results(year);
CREATE INDEX IF NOT EXISTS idx_results_category ON results(category);

CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(active);
CREATE INDEX IF NOT EXISTS idx_sponsors_order ON sponsors("order");

-- Insert some sample data for testing
INSERT INTO todos (text, completed) VALUES 
  ('Test Supabase connection', false),
  ('Create a todo app', false),
  ('Deploy to production', false)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Supabase setup completed successfully!' AS message;
