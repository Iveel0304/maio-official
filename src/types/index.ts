export type Language = 'en' | 'mn';

export interface Article {
  _id?: string; // MongoDB compatibility
  id?: string; // Supabase primary key
  title: {
    en: string;
    mn: string;
  };
  content: {
    en: string;
    mn: string;
  };
  summary?: {
    en: string;
    mn: string;
  };
  category: string;
  author?: string;
  publishDate?: string; // MongoDB field name
  publish_date?: string; // Supabase field name
  updatedDate?: string; // MongoDB field name
  updated_at?: string; // Supabase field name
  imageUrl?: string; // MongoDB field name
  image_url?: string; // Supabase field name
  tags?: string[];
  featured?: boolean;
  createdAt?: string; // MongoDB field name
  created_at?: string; // Supabase field name
  updatedAt?: string; // MongoDB field name
  updated_at?: string; // Supabase field name
}

export interface Event {
  _id: string;
  id?: string; // For backwards compatibility
  title: {
    en: string;
    mn: string;
  };
  description: {
    en: string;
    mn: string;
  };
  date: string;
  time: string;
  location: {
    en: string;
    mn: string;
  };
  category: string;
  imageUrl?: string;
  participants?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Competition {
  _id: string;
  id?: string; // For backwards compatibility
  title: {
    en: string;
    mn: string;
  };
  description: {
    en: string;
    mn: string;
  };
  year: number;
  date: string;
  category: string;
  rankings: ResultRanking[];
  createdAt: string;
  updatedAt: string;
}

export interface ResultRanking {
  rank: number;
  team: string;
  score: number;
  members: string[];
  school?: string;
}

export interface MediaItem {
  id: string;
  title: {
    en: string;
    mn: string;
  };
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  date: string;
  category?: string;
}

export interface Sponsor {
  id?: string;
  _id?: string;
  name: string;
  logoUrl?: string; // Frontend/MongoDB field
  logo_url?: string; // Supabase field
  logo?: string; // Alternative field
  websiteUrl?: string; // Frontend/MongoDB field
  website_url?: string; // Supabase field
  website?: string; // Alternative field
  tier: 'organizer' | 'main' | 'sponsor' | 'supporter' | 'gold' | 'silver' | 'bronze' | 'platinum';
  featured?: boolean;
  active?: boolean;
  order?: number;
  description?: string;
  createdAt?: string;
  created_at?: string; // Supabase field
  updatedAt?: string;
  updated_at?: string; // Supabase field
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  name?: string;
}