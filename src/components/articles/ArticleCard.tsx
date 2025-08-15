import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const { language, t } = useLanguage();
  
  // Safely get title and summary with fallbacks
  const safeTitle = article.title || { en: 'Untitled Article', mn: 'Гарчиггүй нийтлэл' };
  const safeSummary = article.summary || { en: 'No summary available', mn: 'Товч агуулга байхгүй' };
  
  // Handle both MongoDB (publishDate) and Supabase (publish_date) field names
  const dateString = article.publishDate || article.publish_date;
  let timeAgo = 'Unknown';
  
  if (dateString) {
    try {
      const publishDate = new Date(dateString);
      if (!isNaN(publishDate.getTime())) {
        timeAgo = formatDistanceToNow(publishDate, { addSuffix: true });
      }
    } catch (error) {
      console.warn('Invalid date format:', dateString, error);
    }
  }
  
  const categoryLabels = {
    en: {
      announcement: 'Announcement',
      news: 'News',
      results: 'Results',
      interview: 'Interview',
      workshop: 'Workshop',
      partnership: 'Partnership'
    },
    mn: {
      announcement: 'Зарлал',
      news: 'Мэдээ',
      results: 'Үр дүн',
      interview: 'Ярилцлага',
      workshop: 'Семинар',
      partnership: 'Хамтын ажиллагаа'
    }
  };
  
  return (
    <Card className={`overflow-hidden h-full flex flex-col ${featured ? 'lg:flex-row' : ''}`}>
      <div className={`${featured ? 'lg:w-1/2' : 'w-full'}`}>
        <Link to={`/news/${article._id || article.id}`}>
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={article.imageUrl || article.image_url || '/images/placeholder.jpg'}
              alt={t(safeTitle)}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
      </div>
      
      <div className={`flex flex-col ${featured ? 'lg:w-1/2' : 'w-full'}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              {categoryLabels[language][article.category as keyof typeof categoryLabels.en] || article.category}
            </Badge>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <Clock size={14} /> {timeAgo}
            </span>
          </div>
          <Link to={`/news/${article._id || article.id}`} className="hover:underline">
            <h3 className={`font-bold ${featured ? 'text-2xl' : 'text-xl'}`}>
              {t(safeTitle)}
            </h3>
          </Link>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          <p className="text-muted-foreground line-clamp-3">
            {t(safeSummary)}
          </p>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between">
          <span className="text-sm text-muted-foreground">{article.author}</span>
          <Link 
            to={`/news/${article._id || article.id}`} 
            className="text-primary hover:underline text-sm font-medium"
          >
            {language === 'en' ? 'Read more' : 'Дэлгэрэнгүй'}
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ArticleCard;