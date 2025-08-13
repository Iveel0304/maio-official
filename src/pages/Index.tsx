import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import ArticleCard from '@/components/articles/ArticleCard';
import EventCard from '@/components/events/EventCard';
import SponsorShowcase from '@/components/home/SponsorShowcase';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { getFeaturedArticles, getLatestArticles, getUpcomingEvents, sponsors } from '@/lib/mockData';

export default function HomePage() {
  const { language } = useLanguage();
  const [featuredArticle, setFeaturedArticle] = useState(getFeaturedArticles()[0]);
  const [latestArticles, setLatestArticles] = useState(getLatestArticles(3));
  const [upcomingEvents, setUpcomingEvents] = useState(getUpcomingEvents().slice(0, 3));
  
  // Hero content for Mongolian AI Olympiad
  const heroContent = {
    title: {
      en: 'Mongolian AI Olympiad',
      mn: 'Монголын AI Олимпиад'
    },
    subtitle: {
      en: "Mongolia's premier artificial intelligence competition, fostering innovation and excellence in AI research and application.",
      mn: "Монгол улсын тэргүүлэх хиймэл оюун ухааны тэмцээн, AI судалгаа, хэрэглээнд инноваци, шилдэг байдлыг дэмжинэ."
    }
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <HeroBanner title={heroContent.title} subtitle={heroContent.subtitle} />
      
      {/* Featured Article */}
      <section className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            {language === 'en' ? 'Featured News' : 'Онцлох мэдээ'}
          </h2>
        </div>
        
        {featuredArticle && (
          <div className="mb-8">
            <ArticleCard article={featuredArticle} featured />
          </div>
        )}
        
        {/* Latest Articles */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {language === 'en' ? 'Latest News' : 'Сүүлийн мэдээ'}
            </h2>
            <Button variant="ghost" asChild>
              <Link to="/news" className="flex items-center">
                {language === 'en' ? 'View all' : 'Бүгдийг үзэх'} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Upcoming Events */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {language === 'en' ? 'Upcoming Events' : 'Ирэх арга хэмжээ'}
            </h2>
            <Button variant="ghost" asChild>
              <Link to="/events" className="flex items-center">
                {language === 'en' ? 'View all' : 'Бүгдийг үзэх'} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? 'No upcoming events' : 'Ирэх арга хэмжээ алга байна'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en' 
                    ? 'Check back later for upcoming events.'
                    : 'Ирэх арга хэмжээний талаар дараа шалгана уу.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Sponsors */}
      <section className="container py-12">
        <SponsorShowcase sponsors={sponsors} />
      </section>
      
      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === 'en' ? 'Ready to participate in MAIO?' : 'MAIO-д оролцохоор бэлэн үү?'}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Join the most prestigious AI competition in Mongolia and showcase your skills.'
              : 'Монгол улсын хамгийн нэр хүндтэй AI тэмцээнд оролцож, өөрийн ур чадвараа харуулаарай.'}
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              {language === 'en' ? 'Register Now' : 'Одоо бүртгүүлэх'}
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}