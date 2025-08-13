export type Language = 'en' | 'mn';

export interface Article {
  _id: string;
  id?: string; // For backwards compatibility
  title: {
    en: string;
    mn: string;
  };
  content: {
    en: string;
    mn: string;
  };
  summary: {
    en: string;
    mn: string;
  };
  category: string;
  author: string;
  publishDate: string;
  updatedDate?: string;
  imageUrl: string;
  tags: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
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
  logoUrl?: string;
  logo?: string;
  websiteUrl?: string;
  website?: string;
  tier: 'organizer' | 'main' | 'sponsor' | 'supporter' | 'gold' | 'silver' | 'bronze' | 'platinum';
  featured?: boolean;
  active?: boolean;
  order?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  name?: string;
}