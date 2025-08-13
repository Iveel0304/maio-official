import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, Search, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navItems = {
    en: [
      { title: "Home", href: "/" },
      { title: "News", href: "/news" },
      { title: "Events", href: "/events" },
      { title: "Results", href: "/results" },
      { title: "Gallery", href: "/gallery" },
    ],
    mn: [
      { title: "Нүүр", href: "/" },
      { title: "Мэдээ", href: "/news" },
      { title: "Арга хэмжээ", href: "/events" },
      { title: "Үр дүн", href: "/results" },
      { title: "Галерей", href: "/gallery" },
    ],
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">
              {language === "en" ? "MAIO" : "УХОО"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems[language].map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link to={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
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
                placeholder={language === "en" ? "Search..." : "Хайх..."}
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
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "mn" : "en")}
            aria-label="Toggle language"
          >
            <Globe className="h-5 w-5" />
          </Button>

          {user ? (
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                {language === "en" ? "Admin Panel" : "Удирдлагын хэсэг"}
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/login">{language === "en" ? "Login" : "Нэвтрэх"}</Link>
            </Button>
          )}

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden relative"
              >
                <Menu className="h-5 w-5 transition-all duration-300" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between py-4 border-b">
                  <span className="font-bold text-xl">MAIO</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      aria-label="Toggle theme"
                    >
                      {theme === "light" ? (
                        <Moon className="h-4 w-4" />
                      ) : (
                        <Sun className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setLanguage(language === "en" ? "mn" : "en")
                      }
                      aria-label="Toggle language"
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2 py-4 flex-1">
                  {navItems[language].map((item, index) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
                    >
                      <span className="transition-transform group-hover:translate-x-1">
                        {item.title}
                      </span>
                    </Link>
                  ))}

                  {/* Search in Mobile */}
                  <div className="px-4 py-4">
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder={
                            language === "en"
                              ? "Search articles..."
                              : "Нийтлэл хайх..."
                          }
                          className="w-full pl-10 py-2 rounded-lg border-2 focus:border-primary"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full" size="sm">
                        <Search className="mr-2 h-4 w-4" />
                        {language === "en" ? "Search" : "Хайх"}
                      </Button>
                    </form>
                  </div>
                </nav>

                {/* Footer */}
                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full"
                      >
                        <Link to="/admin">
                          {language === "en"
                            ? "Admin Panel"
                            : "Удирдлагын хэсэг"}
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="w-full"
                      >
                        {language === "en" ? "Logout" : "Гарах"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <Link to="/login">
                        {language === "en" ? "Login" : "Нэвтрэх"}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
