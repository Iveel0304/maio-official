import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Layout from "@/components/layout/Layout";
import ArticleCard from "@/components/articles/ArticleCard";
import FeaturedArticle from "@/components/articles/FeaturedArticle";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsApi, healthCheck } from "@/lib/api";
import { articles as mockArticles, sampleArticle } from "@/lib/mockData";
import PageTransition from "@/components/ui/PageTransition";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar, Flame, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function NewsPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const [featuredRef, featuredInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categoryLabels = {
    en: {
      announcement: "Announcement",
      news: "News",
      results: "Results",
      interview: "Interview",
      workshop: "Workshop",
      partnership: "Partnership",
    },
    mn: {
      announcement: "Зарлал",
      news: "Мэдээ",
      results: "Үр дүн",
      interview: "Ярилцлага",
      workshop: "Семинар",
      partnership: "Хамтын ажиллагаа",
    },
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    setLoading(true);
    setError(null);

    // Set a timeout to ensure loading doesn't hang forever
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn("Loading timeout reached, showing fallback data");
        setFeaturedArticle(sampleArticle.featured ? sampleArticle : null);
        setArticles([sampleArticle]);
        setCategories([sampleArticle.category]);
        setLoading(false);
        toast.info(
          language === "en"
            ? "Connection timeout. Showing demo content."
            : "Холболт хугацаа дууссан. Жишээ мэдээлэл харуулж байна."
        );
      }
    }, 5000); // 5 second timeout

    const fetchData = async () => {
      try {
        // Quick health check with timeout
        const healthCheckPromise = Promise.race([
          healthCheck(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Health check timeout")), 3000)
          ),
        ]);

        const apiAvailable = await healthCheckPromise.catch(() => false);

        if (!mounted) return;

        if (apiAvailable) {
          console.log("API is available, fetching data...");
          try {
            // Also add timeout to API calls
            const apiCallsPromise = Promise.race([
              Promise.all([
                newsApi.getNews({ featured: true, limit: 1 }),
                newsApi.getNews({ limit: 50 }),
              ]),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("API calls timeout")), 4000)
              ),
            ]);

            const [featuredResult, articlesResult] = await apiCallsPromise;

            if (!mounted) return;

            if (featuredResult.data?.length > 0) {
              setFeaturedArticle(featuredResult.data[0]);
            }

            if (articlesResult.data?.length > 0) {
              setArticles(articlesResult.data);
              const uniqueCategories = [
                ...new Set(
                  articlesResult.data.map((article) => article.category)
                ),
              ];
              setCategories(uniqueCategories);
            } else {
              // No data from API, use fallback
              throw new Error("No data received from API");
            }
          } catch (apiError) {
            console.warn("API Error, using fallback:", apiError);
            throw apiError;
          }
        } else {
          console.log("API not available, using sample data");
          // Use fallback data immediately
          setFeaturedArticle(sampleArticle.featured ? sampleArticle : null);
          setArticles([sampleArticle]);
          setCategories([sampleArticle.category]);

          toast.info(
            language === "en"
              ? "Demo mode: Showing sample content."
              : "Жишээ горим: Жишээ мэдээлэл харуулж байна."
          );
        }
      } catch (error) {
        console.warn("Fetch error, using fallback data:", error);
        if (mounted) {
          // Always show fallback data on error
          setFeaturedArticle(sampleArticle.featured ? sampleArticle : null);
          setArticles([sampleArticle]);
          setCategories([sampleArticle.category]);
        }
      } finally {
        if (mounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [language]);

  // Filter and sort articles
  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title[language]
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        article.content[language]
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return (
          new Date(b.publish_date || b.publishDate).getTime() - new Date(a.publish_date || a.publishDate).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.publish_date || a.publishDate).getTime() - new Date(b.publish_date || b.publishDate).getTime()
        );
      } else if (sortBy === "popular") {
        // Sort by a combination of featured status and date for popularity
        return (
          (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
          new Date(b.publish_date || b.publishDate).getTime() - new Date(a.publish_date || a.publishDate).getTime()
        );
      }
      return 0;
    });

  // Show loading screen while fetching data
  if (loading) {
    return (
      <Layout>
        <LoadingScreen
          message={
            language === "en" ? "Loading news..." : "Мэдээлэл ачаалж байна..."
          }
        />
      </Layout>
    );
  }

  return (
    <PageTransition>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                  {language === "en"
                    ? "News & Announcements"
                    : "Мэдээ & Зарлал"}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {language === "en"
                    ? "Stay updated with the latest news, announcements, and stories about the Mongolian AI Olympiad."
                    : "Монголын AI Олимпиадын талаарх сүүлийн үеийн мэдээ, зарлал, түүхүүдийг хүлээн авна уу."}
                </p>
              </motion.div>
            </div>
          </div>


          {/* News Content Section */}
          <div className="container mx-auto px-4 py-12">
            {/* Filters and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 space-y-4"
            >
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      language === "en"
                        ? "Search articles..."
                        : "Мэдээлэл хайх..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue
                          placeholder={
                            language === "en" ? "All Categories" : "Бүх ангилал"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {language === "en" ? "All Categories" : "Бүх ангилал"}
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {categoryLabels[language][
                              category as keyof typeof categoryLabels.en
                            ] || category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">
                          {language === "en" ? "Latest First" : "Сүүлийн эхэнд"}
                        </SelectItem>
                        <SelectItem value="oldest">
                          {language === "en" ? "Oldest First" : "Хуучин эхэнд"}
                        </SelectItem>
                        <SelectItem value="popular">
                          {language === "en"
                            ? "Most Popular"
                            : "Хамгийн алдартай"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery ||
                    (selectedCategory && selectedCategory !== "all")) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      {language === "en" ? "Clear" : "Арилгах"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Results count */}
              <div className="text-sm text-muted-foreground">
                {language === "en"
                  ? `Showing ${filteredArticles.length} articles`
                  : `${filteredArticles.length} мэдээлэл харуулж байна`}
              </div>
            </motion.div>

            {/* Articles Grid */}
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={contentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredArticles.map((article, index) => (
                    <motion.div
                      key={article._id || article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={contentInView ? { opacity: 1, y: 0 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 * index,
                        type: "spring",
                        stiffness: 100,
                      }}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <ArticleCard article={article} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={contentInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16 px-4"
                >
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-3">
                    {language === "en"
                      ? "No articles found"
                      : "Мэдээлэл олдсонгүй"}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {language === "en"
                      ? "Try changing your search criteria or check back later for new content."
                      : "Хайлтын шүүлтүүрээ өөрчлөх эсвэл дараа шинэ мэдээлэл шалгана уу."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    {language === "en" ? "Reset Filters" : "Шүүлтүүр сэргээх"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}
