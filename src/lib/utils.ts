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
    // Proper Mongolian date format: Year-Month-Day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

export function formatDateLong(dateString: string, language: Language = 'en'): string {
  const date = new Date(dateString);
  
  if (language === 'en') {
    return format(date, 'MMMM d, yyyy');
  } else {
    // Mongolian long date format
    const mongolianMonths = [
      '1-р сар', '2-р сар', '3-р сар', '4-р сар',
      '5-р сар', '6-р сар', '7-р сар', '8-р сар',
      '9-р сар', '10-р сар', '11-р сар', '12-р сар'
    ];
    
    const year = date.getFullYear();
    const month = mongolianMonths[date.getMonth()];
    const day = date.getDate();
    
    return `${year} оны ${month} ${day}`;
  }
}

// Generate view count for articles (simulated)
export function generateViewCount(): number {
  return Math.floor(Math.random() * 2000) + 500;
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