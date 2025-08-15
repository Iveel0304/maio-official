import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import ArticleCard from "@/components/articles/ArticleCard";
import EventCard from "@/components/events/EventCard";
import SponsorShowcase from "@/components/home/SponsorShowcase";
import LoadingScreen from "@/components/ui/LoadingScreen";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Bell,
  Trophy,
  Calendar,
  Users,
  Zap,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsApi, eventsApi, sponsorsApi, healthCheck } from "@/lib/api";
import {
  articles,
  events,
  sponsors,
  getFeaturedArticles,
  getLatestArticles,
  getUpcomingEvents,
} from "@/lib/mockData";
import { toast } from "sonner";

export default function HomePage() {
  const { language } = useLanguage();
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [sponsorsList, setSponsorsList] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [newsRef, newsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [eventsRef, eventsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Fetch data from API or use fallback mock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);

        // Check if API is available
        const apiAvailable = await healthCheck();

        if (apiAvailable) {
          console.log("API is available, fetching from server...");

          // Fetch featured articles
          const featuredResponse = await newsApi.getNews({
            featured: true,
            limit: 1,
          });
          if (featuredResponse.data && featuredResponse.data.length > 0) {
            setFeaturedArticle(featuredResponse.data[0]);
          } else {
            // Fallback to mock data
            const mockFeatured = getFeaturedArticles();
            if (mockFeatured.length > 0) {
              setFeaturedArticle(mockFeatured[0]);
            }
          }

          // Fetch latest articles
          const latestResponse = await newsApi.getNews({ limit: 6 });
          if (latestResponse.data) {
            setLatestArticles(latestResponse.data);
          } else {
            setLatestArticles(getLatestArticles(6));
          }

          // Fetch upcoming events
          const eventsResponse = await eventsApi.getEvents({
            upcoming: true,
            limit: 3,
          });
          if (eventsResponse.data) {
            setUpcomingEvents(eventsResponse.data);
          } else {
            setUpcomingEvents(getUpcomingEvents().slice(0, 3));
          }

          // Fetch active sponsors
          const sponsorsResponse = await sponsorsApi.getSponsors(true);
          if (sponsorsResponse.data) {
            setSponsorsList(sponsorsResponse.data);
          } else {
            setSponsorsList(sponsors);
          }
        } else {
          console.log("API not available, using mock data...");
          // Use fallback mock data
          const mockFeatured = getFeaturedArticles();
          if (mockFeatured.length > 0) {
            setFeaturedArticle(mockFeatured[0]);
          }

          setLatestArticles(getLatestArticles(6));
          setUpcomingEvents(getUpcomingEvents().slice(0, 3));
          setSponsorsList(sponsors);

          toast.info(
            language === "en"
              ? "Using demo content. Connect to see live data."
              : "Жишээ мэдээлэл ашиглаж байна. Шууд мэдээлэл авахыг хүвэл холболтоо шалгана уу."
          );
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);

        // Fallback to mock data on error
        const mockFeatured = getFeaturedArticles();
        if (mockFeatured.length > 0) {
          setFeaturedArticle(mockFeatured[0]);
        }

        setLatestArticles(getLatestArticles(6));
        setUpcomingEvents(getUpcomingEvents().slice(0, 3));
        setSponsorsList(sponsors);

        toast.warning(
          language === "en"
            ? "Using demo content due to connection issues."
            : "Холболтын асуудлаас болж жишээ мэдээлэл ашиглаж байна."
        );
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [language]);

  if (dataLoading) {
    return <LoadingScreen />;
  }

  // Hero content for Mongolian AI Olympiad
  const heroContent = {
    title: {
      en: "Mongolian AI Olympiad",
      mn: "Монголын AI Олимпиад",
    },
    subtitle: {
      en: "Mongolia's premier artificial intelligence competition, fostering innovation and excellence in AI research and application.",
      mn: "Монгол улсын тэргүүлэх хиймэл оюун ухааны тэмцээн, AI судалгаа, хэрэглээнд инноваци, шилдэг байдлыг дэмжинэ.",
    },
  };

  // Stats data
  const stats = [
    {
      icon: Users,
      number: "100+",
      label: { en: "Participants", mn: "Оролцогчид" },
    },
    {
      icon: Trophy,
      number: "8",
      label: { en: "Awards", mn: "Шагнал" },
    },
    {
      icon: BookOpen,
      number: "5+",
      label: { en: "Projects", mn: "Төслүүд" },
    },
    {
      icon: TrendingUp,
      number: "1",
      label: { en: "Years", mn: "Жил" },
    },
  ];

  // Quick navigation items
  const quickNavItems = [
    {
      icon: BookOpen,
      title: { en: "News", mn: "Мэдээ" },
      description: {
        en: "Latest updates and announcements",
        mn: "Сүүлийн үеийн мэдээ, зарлал",
      },
      href: "/news",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: Trophy,
      title: { en: "Results", mn: "Үр дүн" },
      description: {
        en: "Competition results and rankings",
        mn: "Тэмцээний үр дүн, эрэмбэ",
      },
      href: "/results",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: Calendar,
      title: { en: "Events", mn: "Арга хэмжээ" },
      description: {
        en: "Upcoming competitions and workshops",
        mn: "Ирэх тэмцээн, семинарууд",
      },
      href: "/events",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: Users,
      title: { en: "Gallery", mn: "Галерей" },
      description: {
        en: "Photos and videos from events",
        mn: "Арга хэмжээний зураг, видео",
      },
      href: "/gallery",
      color: "from-pink-500 to-rose-600",
    },
  ];

  return (
    <Layout>
      {/* Hero Banner with animated background */}
      <div className="relative overflow-hidden">
        <AnimatedBackground
          variant="neural"
          interactive
          className="opacity-30"
        />
        <HeroBanner title={heroContent.title} subtitle={heroContent.subtitle} />
      </div>

      {/* Urgent Banner Alert */}
      <motion.section
        className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Bell className="h-4 w-4 animate-pulse" />
            <span>
              {language === "en"
                ? "🔥 MAIO 2026 Registration will start soon. - Don't miss out!"
                : "🔥 MAIO 2026 Бүртгэл эхлэхэд тун удахгүй - Бүү алдаарай!"}
            </span>
          </div>
        </div>
      </motion.section>

      {/* Quick Navigation */}
      <section className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === "en" ? "Explore MAIO" : "MAIO-г судлах"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickNavItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={item.href} className="block">
                  <div
                    className={`relative p-6 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <item.icon className="h-8 w-8 mb-3" />
                      <h3 className="font-semibold text-lg mb-2">
                        {language === "en" ? item.title.en : item.title.mn}
                      </h3>
                      <p className="text-sm opacity-90">
                        {language === "en"
                          ? item.description.en
                          : item.description.mn}
                      </p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                      <item.icon className="h-20 w-20" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/30 py-16 relative overflow-hidden">
        <AnimatedBackground
          variant="particles"
          interactive={false}
          className="opacity-20"
        />
        <div className="container relative z-10">
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">
              {language === "en" ? "MAIO by Numbers" : "MAIO тоогоор"}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === "en"
                ? "Growing stronger every year with passionate AI enthusiasts from across Mongolia"
                : "Монгол даяарх хүсэл эрмэлзэлтэй AI сонирхогчидтой жил ирэх тусам илүү хүчирхэг болж байна"}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.number}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {language === "en" ? stat.label.en : stat.label.mn}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Latest News */}
      <section className="container py-16" ref={newsRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={newsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Featured Article */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">
                {language === "en" ? "Featured News" : "Онцлох мэдээ"}
              </h2>
              <Badge variant="secondary" className="ml-2">
                {language === "en" ? "Most Viewed" : "Их тандалттай"}
              </Badge>
            </div>

            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={newsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="mb-8"
              >
                <ArticleCard article={featuredArticle} featured />
              </motion.div>
            )}
          </div>

          {/* Latest News Section - View All Button Only */}
          <div className="mb-8">
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={newsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {language === "en" ? "Latest News" : "Сүүлийн мэдээ"}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  {language === "en"
                    ? "Stay informed with the latest updates, announcements, and stories from the Mongolian AI Olympiad."
                    : "Монголын AI Олимпиадын сүүлийн үеийн мэдээ, зарлал, түүхүүдтэй танилцаарай."}
                </p>
                <Button size="lg" asChild className="group">
                  <Link
                    to="/news"
                    className="flex items-center text-lg px-8 py-3"
                  >
                    {language === "en" ? "View All News" : "Бүх мэдээ үзэх"}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Upcoming Events */}
      <section
        className="bg-gradient-to-br from-muted/50 to-muted/30 py-16 relative"
        ref={eventsRef}
      >
        <AnimatedBackground
          variant="circuit"
          interactive={false}
          className="opacity-10"
        />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={eventsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {language === "en" ? "Upcoming Events" : "Ирэх арга хэмжээ"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "en"
                    ? "Don't miss these exciting upcoming events and competitions"
                    : "Эдгээр сонирхолтой арга хэмжээ, тэмцээнүүдийг бүү алдаарай"}
                </p>
              </div>
              <Button
                variant="outline"
                asChild
                className="group hidden md:flex"
              >
                <Link to="/events" className="flex items-center">
                  {language === "en" ? "All Events" : "Бүх арга хэмжээ"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event._id || event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={eventsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  className="col-span-3 text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={eventsInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {language === "en"
                      ? "No upcoming events"
                      : "Ирэх арга хэмжээ алга байна"}
                  </h3>
                  <p className="text-muted-foreground">
                    {language === "en"
                      ? "Check back later for upcoming events."
                      : "Ирэх арга хэмжээний талаар дараа шалгана уу."}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SponsorShowcase sponsors={sponsorsList} />
        </motion.div>
      </section>
    </Layout>
  );
}
