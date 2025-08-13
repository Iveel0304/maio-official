import { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlRendererProps {
  content: string;
  className?: string;
}

const SafeHtmlRenderer = ({ content, className = '' }: SafeHtmlRendererProps) => {
  const sanitizedContent = useMemo(() => {
    // Clean the HTML content
    let cleanedContent = content;
    
    // Remove empty paragraph tags
    cleanedContent = cleanedContent.replace(/<p>\s*<\/p>/gi, '');
    cleanedContent = cleanedContent.replace(/<p><\/p>/gi, '');
    
    // Remove unnecessary whitespace
    cleanedContent = cleanedContent.replace(/\s+/g, ' ').trim();
    
    // Sanitize the HTML to prevent XSS
    const sanitized = DOMPurify.sanitize(cleanedContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'table', 'thead',
        'tbody', 'tr', 'th', 'td', 'code', 'pre'
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'style', 'target', 'rel'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
    });
    
    return sanitized;
  }, [content]);

  return (
    <div 
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SafeHtmlRenderer;
