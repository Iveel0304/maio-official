import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Eye, ChevronLeft, ChevronRight, Share2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Layout from '@/components/layout/Layout';
import { AnimatedPage } from '@/components/ui/PageTransition';
import SocialShare from '@/components/ui/SocialShare';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article } from '@/types';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SafeHtmlRenderer from '@/components/ui/SafeHtmlRenderer';
import { toast } from 'sonner';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [relatedRef, relatedInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Calculate reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateReadingProgress);
    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      const result = await newsApi.getArticle(id);
      
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result.data) {
        setArticle(result.data);
        
        // Get related articles (same category, excluding current article)
        const relatedResult = await newsApi.getNews({
          category: result.data.category,
          limit: 4
        });
        
        if (relatedResult.data) {
          const related = relatedResult.data
            .filter(a => (a._id || a.id) !== (result.data._id || result.data.id))
            .slice(0, 3);
          setRelatedArticles(related);
        }
      }
      
      setLoading(false);
    };
    
    fetchArticle();
  }, [id]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !article) {
    return (
      <Layout>
        <AnimatedPage>
          <div className="container py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="text-6xl mb-4">📰</div>
              <h1 className="text-3xl font-bold">
                {language === 'en' ? 'Article Not Found' : 'Мэдээлэл олдсонгүй'}
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                {language === 'en' 
                  ? 'The article you\'re looking for doesn\'t exist or has been moved.'
                  : 'Таны хайж буй мэдээлэл байхгүй эсвэл зөөгдсөн байна.'}
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link to="/news">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'Back to News' : 'Мэдээ рүү буцах'}
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  {language === 'en' ? 'Go Back' : 'Буцах'}
                </Button>
              </div>
            </motion.div>
          </div>
        </AnimatedPage>
      </Layout>
    );
  }

  // Generate extended content from existing article data
  const generateExtendedContent = (content: string, summary: string) => {
    const paragraphs = [
      summary,
      content,
      // Add more contextual content based on the article category
      ...(article.category === 'Competition' ? [
        language === 'en' ?
          'The competition featured multiple rounds of challenges designed to test participants\' problem-solving abilities and technical skills. Each round progressively increased in difficulty, culminating in a final showcase where teams presented their innovative solutions.' :
          'Тэмцээн нь оролцогчдын бодлого шийдвэрлэх чадвар, техникийн ур чадварыг шалгах зориулалттай олон шатлалтай сорилтоор бүрдэж байв. Шат бүр аажмаар хүндрэх бөгөөд эцсийн үзүүлэнгээр багууд шинэлэг шийдлээ танилцуулав.',
        language === 'en' ?
          'Industry experts and academic leaders served as judges, evaluating projects based on innovation, technical implementation, and potential real-world impact. The diversity of solutions presented highlighted the growing AI expertise within Mongolia.' :
          'Салбарын мэргэжилтэн, эрдэм шинжилгээний удирдагчид шүүгчээр ажиллаж, төслүүдийг инноваци, техникийн хэрэгжилт, бодит амьдралд үзүүлэх нөлөөний үүднээс үнэлэв. Танилцуулсан шийдлүүдийн олон янз байдал нь Монгол дахь AI мэргэжлийн өсөн нэмэгдэж буй байдлыг харууллаа.'
      ] : []),
      ...(article.category === 'Innovation' ? [
        language === 'en' ?
          'This breakthrough represents a significant milestone in Mongolia\'s journey toward technological advancement. The innovation demonstrates how local talent can contribute meaningfully to global AI development while addressing specific regional challenges.' :
          'Энэ нээлт нь Монгол улсын технологийн дэвшлийн замд чухал түүхэн үе болж байна. Инноваци нь орон нутгийн авъяаслаг хүмүүс дэлхийн AI хөгжлийд утга учиртай хувь нэмэр оруулахын зэрэгцээ бүс нутгийн тусгай сорилтуудыг шийдвэрлэж чадахыг харуулж байна.'
      ] : []),
      language === 'en' ?
        'Looking forward, initiatives like these continue to strengthen Mongolia\'s position in the global AI landscape, fostering innovation and inspiring the next generation of AI practitioners and researchers.' :
        'Урагшаа харвал ийм санаачилгууд Монгол улсын дэлхийн AI-н байр суурийг бэхжүүлж, инновацийг дэмжиж, дараагийн үеийн AI практикч, судлаачдыг урамшуулсаар байх болно.'
    ];

    return paragraphs;
  };

  const extendedContent = generateExtendedContent(t(article.content), t(article.summary));

  return (
    <Layout>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      <AnimatedPage variant="fade">
        <article className="container py-8 max-w-4xl mx-auto">
          {/* Navigation */}
          <motion.div 
            className="mb-8 flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Button variant="ghost" asChild className="group">
              <Link to="/news" className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                {language === 'en' ? 'Back to News' : 'Мэдээ рүү буцах'}
              </Link>
            </Button>
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Previous' : 'Өмнөх'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.history.forward()}>
                {language === 'en' ? 'Next' : 'Дараах'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Article Header */}
          <motion.header 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="default" className="px-3 py-1">
                  {article.category}
                </Badge>
              </motion.div>
              
              {article.tags?.map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t(article.title)}
            </h1>
            
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time>{formatDate(article.publishDate, language)}</time>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 {language === 'en' ? 'min read' : 'минут'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 1000) + 500} {language === 'en' ? 'views' : 'үзэлт'}</span>
              </div>
            </div>
          </motion.header>

          {/* Featured Image */}
          <motion.div 
            className="mb-12 relative overflow-hidden rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.img
              src={article.imageUrl || '/images/placeholder.jpg'}
              alt={t(article.title)}
              className="w-full h-[300px] md:h-[500px] object-cover"
              onLoad={() => setIsImageLoaded(true)}
              initial={{ scale: 1.1 }}
              animate={{ scale: isImageLoaded ? 1 : 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </motion.div>

          {/* Article Content */}
          <motion.div 
            ref={contentRef}
            className="prose prose-lg dark:prose-invert max-w-none mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            {/* Lead paragraph */}
            <motion.p 
              className="text-xl md:text-2xl leading-relaxed text-muted-foreground mb-8 font-medium"
              initial={{ opacity: 0 }}
              animate={contentInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.6 }}
            >
              {t(article.summary)}
            </motion.p>
            
            {/* Extended content */}
            <div className="space-y-6">
              {/* Render main content with HTML support */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 }}
              >
                <SafeHtmlRenderer content={t(article.content)} />
              </motion.div>
              
              {/* Add additional contextual content */}
              {extendedContent.slice(2).map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="leading-relaxed text-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={contentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Tags section */}
            {article.tags && article.tags.length > 0 && (
              <motion.div
                className="mt-12 pt-8 border-t border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="h-5 w-5 text-primary" />
                  <span className="font-medium text-primary">
                    {language === 'en' ? 'Tags' : 'Шошго'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      className="bg-muted hover:bg-primary hover:text-primary-foreground px-3 py-1 rounded-full text-sm transition-colors cursor-pointer"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={contentInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Share Section */}
          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12 p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">
                {language === 'en' ? 'Share this article' : 'Энэ мэдээг хуваалцах'}
              </span>
            </div>
            <SocialShare 
              url={window.location.href}
              title={t(article.title)}
              description={t(article.summary)}
            />
          </motion.div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.section 
              ref={relatedRef}
              initial={{ opacity: 0, y: 20 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <div className="border-t pt-12">
                <h2 className="text-3xl font-bold mb-8 text-center">
                  {language === 'en' ? 'Related Articles' : 'Холбоотой мэдээ'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle, index) => (
                    <motion.div
                      key={relatedArticle._id || relatedArticle.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <ArticleCard article={relatedArticle} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </article>
      </AnimatedPage>
    </Layout>
  );
}
