export type Language = 'en' | 'mn';

export interface Article {
  id: string;
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
}

export interface Event {
  id: string;
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
  location: string;
  imageUrl?: string;
}

export interface Competition {
  id: string;
  name: {
    en: string;
    mn: string;
  };
  year: string;
  winners: Winner[];
}

export interface Winner {
  place: number;
  name: string;
  project?: string;
  score?: number;
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
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze' | 'partner';
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  name?: string;
}