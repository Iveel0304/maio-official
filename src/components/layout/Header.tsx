import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navItems = {
    en: [
      { title: 'Home', href: '/' },
      { title: 'News', href: '/news' },
      { title: 'Events', href: '/events' },
      { title: 'Results', href: '/results' },
      { title: 'Gallery', href: '/gallery' },
    ],
    mn: [
      { title: 'Нүүр', href: '/' },
      { title: 'Мэдээ', href: '/news' },
      { title: 'Арга хэмжээ', href: '/events' },
      { title: 'Үр дүн', href: '/results' },
      { title: 'Галерей', href: '/gallery' },
    ]
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              MAIO
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems[language].map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link to={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Search, Theme Toggle, Language Switch */}
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={language === 'en' ? 'Search...' : 'Хайх...'}
                className="w-40 md:w-60 pl-8 rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === 'en' ? 'mn' : 'en')}
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5" />
          </Button>
          
          {user ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                {language === 'en' ? 'Admin Panel' : 'Удирдлагын хэсэг'}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">
                {language === 'en' ? 'Login' : 'Нэвтрэх'}
              </Link>
            </Button>
          )}
          
          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                {navItems[language].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block px-2 py-1 text-lg"
                  >
                    {item.title}
                  </Link>
                ))}
                
                <form onSubmit={handleSearch} className="flex items-center pt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder={language === 'en' ? 'Search...' : 'Хайх...'}
                      className="w-full pl-8 rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="ml-2">
                    {language === 'en' ? 'Search' : 'Хайх'}
                  </Button>
                </form>

                {user && (
                  <Button variant="outline" size="sm" onClick={logout} className="mt-2">
                    {language === 'en' ? 'Logout' : 'Гарах'}
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;