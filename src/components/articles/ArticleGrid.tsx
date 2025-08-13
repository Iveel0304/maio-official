import { useState } from 'react';
import { Article } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import ArticleCard from './ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ArticleGridProps {
  articles: Article[];
  showFilters?: boolean;
}

const ArticleGrid = ({ articles, showFilters = false }: ArticleGridProps) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content[language].toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = [...new Set(articles.map(article => article.category))];
  
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
    <div>
      {showFilters && (
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              placeholder={language === 'en' ? 'Search articles...' : 'Мэдээлэл хайх...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'en' ? 'All Categories' : 'Бүх ангилал'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {language === 'en' ? 'All Categories' : 'Бүх ангилал'}
                </SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {categoryLabels[language][category as keyof typeof categoryLabels.en] || category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {(searchQuery || selectedCategory) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
              >
                {language === 'en' ? 'Clear Filters' : 'Шүүлтүүр арилгах'}
              </Button>
            )}
          </div>
        </div>
      )}
      
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">
            {language === 'en' ? 'No articles found' : 'Мэдээлэл олдсонгүй'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Try changing your search criteria or check back later for new content.'
              : 'Хайлтын шүүлтүүрээ өөрчлөх эсвэл дараа шинэ мэдээлэл шалгана уу.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;