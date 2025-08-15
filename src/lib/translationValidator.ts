import { Language } from '@/types';

// Type guard to check if an object is a translation object
export function isTranslationObject(obj: any): obj is { en: string; mn: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.en === 'string' &&
    typeof obj.mn === 'string'
  );
}

// Safe translation function that ensures we never render objects
export function safeTranslate(
  text: any,
  language: Language,
  fallback: string = ''
): string {
  // Handle null, undefined, or empty values
  if (!text) return fallback;
  
  // If already a string, return it
  if (typeof text === 'string') return text;
  
  // If it's a valid translation object
  if (isTranslationObject(text)) {
    return text[language] || text.en || text.mn || fallback;
  }
  
  // For any other type, log a warning and return fallback
  console.warn('Invalid translation object:', text, 'Expected format: { en: string, mn: string }');
  return fallback;
}

// Validate and sanitize translation objects for components
export function validateTranslationFields<T extends Record<string, any>>(
  data: T,
  fields: Array<keyof T>,
  fallbacks: Record<keyof T, { en: string; mn: string }>
): T {
  const validated = { ...data };
  
  fields.forEach(field => {
    const value = validated[field];
    
    if (!isTranslationObject(value)) {
      console.warn(`Invalid translation field "${String(field)}":`, value, 'Using fallback');
      validated[field] = fallbacks[field];
    }
  });
  
  return validated;
}

// Specific validator for Event objects
export function validateEvent(event: any) {
  if (!event || typeof event !== 'object') {
    throw new Error('Invalid event object');
  }

  const fallbacks = {
    title: { en: 'Event Title', mn: 'Арга хэмжээний нэр' },
    description: { en: 'Event description', mn: 'Арга хэмжээний тайлбар' },
    location: { en: 'Location TBA', mn: 'Байршил тодорхойгүй' }
  };

  return validateTranslationFields(event, ['title', 'description', 'location'], fallbacks);
}
