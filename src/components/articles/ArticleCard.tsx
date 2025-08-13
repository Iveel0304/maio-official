import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const { language, t } = useLanguage();
  
  const publishDate = new Date(article.publishDate);
  const timeAgo = formatDistanceToNow(publishDate, { addSuffix: true });
  
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
        <Link to={`/news/${article.id}`}>
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={article.imageUrl || '/images/placeholder.jpg'}
              alt={t(article.title)}
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
          <Link to={`/news/${article.id}`} className="hover:underline">
            <h3 className={`font-bold ${featured ? 'text-2xl' : 'text-xl'}`}>
              {t(article.title)}
            </h3>
          </Link>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          <p className="text-muted-foreground line-clamp-3">
            {t(article.summary)}
          </p>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between">
          <span className="text-sm text-muted-foreground">{article.author}</span>
          <Link 
            to={`/news/${article.id}`} 
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