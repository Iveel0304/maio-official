import { Article } from '@/types';

/**
 * Normalize article data to handle both MongoDB and Supabase field naming conventions
 * This ensures components work regardless of the data source
 */
export function normalizeArticle(article: any): Article {
  return {
    // Handle IDs - prefer Supabase format but fallback to MongoDB
    id: article.id || article._id,
    _id: article._id || article.id,
    
    // Title and content with safe fallbacks
    title: article.title || { en: 'Untitled Article', mn: 'Гарчиггүй нийтлэл' },
    content: article.content || { en: 'No content available', mn: 'Агуулга байхгүй' },
    summary: article.summary || { en: 'No summary available', mn: 'Товч агуулга байхгүй' },
    
    // Basic fields
    category: article.category || '',
    author: article.author || '',
    tags: article.tags || [],
    featured: article.featured || false,
    
    // Handle date fields - normalize to both formats for compatibility
    publishDate: article.publishDate || article.publish_date || new Date().toISOString().split('T')[0],
    publish_date: article.publish_date || article.publishDate || new Date().toISOString().split('T')[0],
    
    updatedDate: article.updatedDate || article.updated_at,
    updated_at: article.updated_at || article.updatedDate,
    
    createdAt: article.createdAt || article.created_at,
    created_at: article.created_at || article.createdAt,
    
    updatedAt: article.updatedAt || article.updated_at,
    
    // Handle image URL fields
    imageUrl: article.imageUrl || article.image_url,
    image_url: article.image_url || article.imageUrl,
  };
}

/**
 * Get the publish date from an article regardless of field naming
 */
export function getArticleDate(article: Article): string {
  return article.publishDate || article.publish_date || new Date().toISOString().split('T')[0];
}

/**
 * Get the image URL from an article regardless of field naming
 */
export function getArticleImage(article: Article): string {
  return article.imageUrl || article.image_url || '/images/placeholder.jpg';
}

/**
 * Get the article ID regardless of field naming
 */
export function getArticleId(article: Article): string {
  return article.id || article._id || '';
}

/**
 * Transform article data for Supabase API calls
 */
export function transformArticleForSupabase(article: Partial<Article>): any {
  const transformed: any = {
    title: article.title,
    content: article.content,
    summary: article.summary,
    category: article.category,
    author: article.author,
    tags: article.tags,
    featured: article.featured,
  };

  // Use Supabase field names
  if (article.publishDate || article.publish_date) {
    transformed.publish_date = article.publish_date || article.publishDate;
  }
  
  if (article.imageUrl || article.image_url) {
    transformed.image_url = article.image_url || article.imageUrl;
  }

  if (article.id) {
    transformed.id = article.id;
  }

  return transformed;
}
