import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

export default function NotFound() {
  const { language } = useLanguage();
  
  return (
    <Layout>
      <div className="container py-16 text-center">
        <h1 className="text-7xl font-bold mb-6">404</h1>
        <h2 className="text-3xl font-bold mb-6">
          {language === 'en' ? 'Page Not Found' : 'Хуудас олдсонгүй'}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
          {language === 'en' 
            ? "The page you are looking for doesn't exist or has been moved."
            : "Таны хайж буй хуудас байхгүй эсвэл зөөгдсөн байна."}
        </p>
        <Button size="lg" asChild>
          <Link to="/">
            {language === 'en' ? 'Return Home' : 'Нүүр хуудас руу буцах'}
          </Link>
        </Button>
      </div>
    </Layout>
  );
}