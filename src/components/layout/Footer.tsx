import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { sponsors } from '@/lib/mockData';

const Footer = () => {
  const { language, t } = useLanguage();
  
  const footerLinks = {
    en: {
      about: [
        { title: 'About MAIO', href: '/about' },
        { title: 'Team', href: '/team' },
        { title: 'Contact', href: '/contact' },
      ],
      resources: [
        { title: 'Rules & Guidelines', href: '/rules' },
        { title: 'FAQs', href: '/faqs' },
        { title: 'Past Competitions', href: '/past-competitions' },
      ],
      legal: [
        { title: 'Terms of Service', href: '/terms' },
        { title: 'Privacy Policy', href: '/privacy' },
      ]
    },
    mn: {
      about: [
        { title: 'MAIO-ийн тухай', href: '/about' },
        { title: 'Баг', href: '/team' },
        { title: 'Холбоо барих', href: '/contact' },
      ],
      resources: [
        { title: 'Дүрэм & Удирдамж', href: '/rules' },
        { title: 'Түгээмэл асуултууд', href: '/faqs' },
        { title: 'Өмнөх тэмцээнүүд', href: '/past-competitions' },
      ],
      legal: [
        { title: 'Үйлчилгээний нөхцөл', href: '/terms' },
        { title: 'Нууцлалын бодлого', href: '/privacy' },
      ]
    }
  };
  
  return (
    <footer className="bg-background border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">MAIO</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              {language === 'en' 
                ? 'The Mongolian AI Olympiad is the premier artificial intelligence competition in Mongolia.'
                : 'Монголын AI Олимпиад бол Монгол Улсын хиймэл оюун ухааны тэргүүлэх тэмцээн юм.'}
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-primary">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">
              {language === 'en' ? 'About' : 'Тухай'}
            </h3>
            <ul className="space-y-2">
              {footerLinks[language].about.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">
              {language === 'en' ? 'Resources' : 'Материалууд'}
            </h3>
            <ul className="space-y-2">
              {footerLinks[language].resources.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">
              {language === 'en' ? 'Legal' : 'Хууль эрхзүй'}
            </h3>
            <ul className="space-y-2">
              {footerLinks[language].legal.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sponsors */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-center font-medium text-lg mb-6">
            {language === 'en' ? 'Our Sponsors' : 'Ивээн тэтгэгчид'}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {sponsors.map((sponsor) => (
              <a 
                key={sponsor.id} 
                href={sponsor.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="grayscale hover:grayscale-0 transition-all"
              >
                <div className="h-8 w-24 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded">
                  {sponsor.name}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {language === 'en' ? 'Mongolian AI Olympiad. All rights reserved.' : 'Монголын AI Олимпиад. Бүх эрх хуулиар хамгаалагдсан.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;