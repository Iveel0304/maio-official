import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface FeaturedArticleProps {
  article: Article;
}

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const { language, t } = useLanguage();
  
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
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="relative h-[60vh] max-h-[600px] w-full">
        <div className="absolute inset-0">
          <img
            src={article.imageUrl || '/images/placeholder.jpg'}
            alt={t(article.title)}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {categoryLabels[language][article.category as keyof typeof categoryLabels.en] || article.category}
            </Badge>
            <span className="text-muted-foreground text-sm">
              {formatDate(article.publishDate, language)}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            {t(article.title)}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mb-6 text-white/80">
            {t(article.summary)}
          </p>
          
          <Button size="lg" asChild>
            <Link to={`/news/${article._id || article.id}`}>
              {language === 'en' ? 'Read Article' : 'Мэдээлэл унших'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedArticle;