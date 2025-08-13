import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import ArticleGrid from '@/components/articles/ArticleGrid';
import { useLanguage } from '@/contexts/LanguageContext';
import { articles } from '@/lib/mockData';

export default function NewsPage() {
  const { language } = useLanguage();
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'News & Announcements' : 'Мэдээ & Зарлал'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'en' 
              ? 'Stay updated with the latest news, announcements, and stories about the Mongolian AI Olympiad.'
              : 'Монголын AI Олимпиадын талаарх сүүлийн үеийн мэдээ, зарлал, түүхүүдийг хүлээн авна уу.'}
          </p>
        </div>
        
        <ArticleGrid articles={articles} showFilters={true} />
      </div>
    </Layout>
  );
}