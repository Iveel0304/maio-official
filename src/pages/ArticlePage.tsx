import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { articles, getLatestArticles } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article } from '@/types';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    // Find the article with the matching ID
    const foundArticle = articles.find(a => a.id === id);
    setArticle(foundArticle || null);
    
    // Get related articles (same category, excluding current article)
    if (foundArticle) {
      const related = articles
        .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
        .slice(0, 3);
      setRelatedArticles(related);
    }
  }, [id]);
  
  if (!article) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Article Not Found' : 'Мэдээлэл олдсонгүй'}
          </h1>
          <p className="mb-8">
            {language === 'en' 
              ? 'The article you are looking for does not exist or has been removed.'
              : 'Таны хайж буй мэдээлэл байхгүй эсвэл устгагдсан байна.'}
          </p>
          <Button asChild>
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Back to News' : 'Мэдээ рүү буцах'}
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <article className="container py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Back to News' : 'Мэдээ рүү буцах'}
          </Link>
        </Button>
        
        {/* Article header */}
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-6">
            {t(article.title)}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-8">
            <div className="flex items-center mr-4">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(article.publishDate, language)}
            </div>
            <div className="flex items-center mr-4">
              <User className="h-4 w-4 mr-1" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {article.category}
            </div>
          </div>
          
          {/* Featured image */}
          <div className="aspect-video mb-8 rounded-lg overflow-hidden">
            <img 
              src={article.imageUrl || '/images/placeholder.jpg'} 
              alt={t(article.title)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Article content */}
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <p className="lead text-xl mb-6">
            {t(article.summary)}
          </p>
          
          <div className="whitespace-pre-line">
            {t(article.content)}
          </div>
          
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link 
                    key={tag} 
                    to={`/news?tag=${tag}`}
                    className="bg-muted px-3 py-1 rounded-full text-sm hover:bg-muted/80"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Share buttons */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">
              {language === 'en' ? 'Share this article' : 'Энэ мэдээг хуваалцах'}
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {language === 'en' ? 'Related Articles' : 'Холбоотой мэдээ'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        )}
      </article>
    </Layout>
  );
}