import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Language } from "@/types";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, language: Language = 'en'): string {
  const date = new Date(dateString);
  
  if (language === 'en') {
    return format(date, 'MMMM d, yyyy');
  } else {
    // Mongolian date format
    const day = date.getDate();
    const month = date.toLocaleString('mn-MN', { month: 'long' });
    const year = date.getFullYear();
    return `${year} оны ${month} сарын ${day}`;
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getYouTubeEmbedUrl(url: string): string {
  // Extract YouTube video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return url; // Return original if not a valid YouTube URL
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}