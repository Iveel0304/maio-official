import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  title?: {
    en: string;
    mn: string;
  };
  subtitle?: {
    en: string;
    mn: string;
  };
}

const HeroBanner = ({ 
  title = {
    en: 'Mongolian AI Olympiad',
    mn: 'Монголын AI Олимпиад'
  },
  subtitle = {
    en: 'Mongolia\'s premier artificial intelligence competition',
    mn: 'Монгол Улсын тэргүүлэх хиймэл оюун ухааны тэмцээн'
  }
}: HeroBannerProps) => {
  const { language, t } = useLanguage();
  
  return (
    <div className="relative overflow-hidden bg-primary-foreground">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ 
          backgroundImage: 'url("/images/background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="animate-pulse mr-1">•</span> 
                {language === 'en' ? 'MAIO 2025 Registration Open' : 'MAIO 2025 Бүртгэл нээлттэй'}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {t(title)}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              {t(subtitle)}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/register">
                  {language === 'en' ? 'Register Now' : 'Одоо бүртгүүлэх'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  {language === 'en' ? 'Learn More' : 'Дэлгэрэнгүй мэдээлэл'}
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative h-[400px] w-full">
              <div className="absolute top-0 right-0 h-[350px] w-[350px] rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-xl transform rotate-6">
                <div className="absolute inset-1 bg-white dark:bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center p-6">
                    <h3 className="text-2xl font-bold mb-2">MAIO 2025</h3>
                    <p className="mb-4 text-muted-foreground">
                      {language === 'en' ? 'Sept 10-15, 2025' : '2025 оны 9-р сарын 10-15'}
                    </p>
                    <p className="font-medium">
                      {language === 'en' ? 'Ulaanbaatar, Mongolia' : 'Улаанбаатар, Монгол'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;