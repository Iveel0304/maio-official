import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Article } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import ArticleCard from './ArticleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 space-y-4 md:space-y-0"
        >
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={language === 'en' ? 'Search articles...' : 'Мэдээлэл хайх...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
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
            </div>
            
            {/* Clear Filters */}
            {(searchQuery || selectedCategory) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                {language === 'en' ? 'Clear' : 'Арилгах'}
              </Button>
            )}
          </div>
          
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {language === 'en' 
              ? `Showing ${filteredArticles.length} of ${articles.length} articles`
              : `${articles.length}-аас ${filteredArticles.length} мэдээлэл харуулж байна`
            }
          </div>
        </motion.div>
      )}
      
      {filteredArticles.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article._id || article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 px-4"
        >
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-xl md:text-2xl font-semibold mb-3">
            {language === 'en' ? 'No articles found' : 'Мэдээлэл олдсонгүй'}
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {language === 'en' 
              ? 'Try changing your search criteria or check back later for new content.'
              : 'Хайлтын шүүлтүүрээ өөрчлөх эсвэл дараа шинэ мэдээлэл шалгана уу.'}
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('');
            }}
          >
            {language === 'en' ? 'Reset Filters' : 'Шүүлтүүр сэргээх'}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ArticleGrid;