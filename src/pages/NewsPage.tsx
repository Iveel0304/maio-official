import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Layout from '@/components/layout/Layout';
import ArticleCard from '@/components/articles/ArticleCard';
import FeaturedArticle from '@/components/articles/FeaturedArticle';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsApi, healthCheck } from '@/lib/api';
import { articles as mockArticles, sampleArticle } from '@/lib/mockData';
import PageTransition from '@/components/ui/PageTransition';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Flame, Star } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function NewsPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  
  const [featuredRef, featuredInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
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
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Check API availability
        const apiAvailable = await healthCheck();
        
        if (apiAvailable) {
          console.log('API available, fetching from server...');
          
          // Fetch featured article
          const featuredResult = await newsApi.getNews({ featured: true, limit: 1 });
          if (featuredResult.data && featuredResult.data.length > 0) {
            setFeaturedArticle(featuredResult.data[0]);
          }
          
          // Fetch all articles
          const articlesResult = await newsApi.getNews({ limit: 50 });
          if (articlesResult.data && articlesResult.data.length > 0) {
            setArticles(articlesResult.data);
            // Extract unique categories
            const uniqueCategories = [...new Set(articlesResult.data.map(article => article.category))];
            setCategories(uniqueCategories);
          } else {
            // No articles from API - show empty state
            setArticles([]);
            setCategories([]);
          }
        } else {
          console.log('API not available, using sample data...');
          // API not available, use sample data for demonstration
          setFeaturedArticle(sampleArticle.featured ? sampleArticle : null);
          setArticles([sampleArticle]);
          setCategories([sampleArticle.category]);
          
          toast.info(
            language === 'en' 
              ? 'Demo mode: Showing sample content. Add news through admin panel.'
              : 'Жишээ горим: Жишээ мэдээлэл харуулж байна. Админ самбараар мэдээ нэмнэ үү.'
          );
        }
        
      } catch (error) {
        console.error('Error fetching news:', error);
        // Fallback to sample data on error
        setFeaturedArticle(sampleArticle.featured ? sampleArticle : null);
        setArticles([sampleArticle]);
        setCategories([sampleArticle.category]);
        
        toast.warning(
          language === 'en'
            ? 'Connection error: Showing demo content.'
            : 'Холболтын алдаа: Жишээ мэдээлэл харуулж байна.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [language]);
  
  // Filter and sort articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content[language].toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === '' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory && article._id !== featuredArticle?._id;
  }).sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
    } else if (sortBy === 'popular') {
      // Sort by a combination of featured status and date for popularity
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
    return 0;
  });
  
  if (loading) {
    return <LoadingScreen message={null} />;
  }
  
  return (
    <PageTransition>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                  {language === 'en' ? 'News & Announcements' : 'Мэдээ & Зарлал'}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {language === 'en' 
                    ? 'Stay updated with the latest news, announcements, and stories about the Mongolian AI Olympiad.'
                    : 'Монголын AI Олимпиадын талаарх сүүлийн үеийн мэдээ, зарлал, түүхүүдийг хүлээн авна уу.'}
                </p>
              </motion.div>
            </div>
          </div>
          
          {/* Featured Article Section */}
          {featuredArticle && (
            <section className="bg-gradient-to-br from-muted/50 to-muted/30 py-16 relative" ref={featuredRef}>
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-2 mb-8 justify-center">
                    <Star className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold text-center">
                      {language === 'en' ? 'Featured Story' : 'Онцлох мэдээ'}
                    </h2>
                    <Badge variant="secondary" className="ml-2">
                      <Flame className="w-3 h-3 mr-1" />
                      {language === 'en' ? 'Hot' : 'Халуун'}
                    </Badge>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={featuredInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    whileHover={{ y: -5 }}
                  >
                    <FeaturedArticle article={featuredArticle} />
                  </motion.div>
                </motion.div>
              </div>
            </section>
          )}
          
          {/* News Content Section */}
          <div className="container mx-auto px-4 py-12">
            {/* Filters and Search */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
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
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
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
                  
                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">
                          {language === 'en' ? 'Latest First' : 'Сүүлийн эхэнд'}
                        </SelectItem>
                        <SelectItem value="oldest">
                          {language === 'en' ? 'Oldest First' : 'Хуучин эхэнд'}
                        </SelectItem>
                        <SelectItem value="popular">
                          {language === 'en' ? 'Most Popular' : 'Хамгийн алдартай'}
                        </SelectItem>
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
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      {language === 'en' ? 'Clear' : 'Арилгах'}
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Results count */}
              <div className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? `Showing ${filteredArticles.length} articles`
                  : `${filteredArticles.length} мэдээлэл харуулж байна`
                }
              </div>
            </motion.div>
            
            {/* Articles Grid */}
            <motion.div 
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article._id || article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={contentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.1 * index,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={contentInView ? { opacity: 1, scale: 1 } : {}}
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
            </motion.div>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}
