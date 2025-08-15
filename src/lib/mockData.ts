import { Article, Event, Competition, MediaItem, Sponsor } from "@/types";

// Mock Articles - Starting with empty for clean slate
export const articles: Article[] = [];

// Sample article for demonstration - Can be used to test the system
export const sampleArticle: Article = {
  id: "1",
  _id: "1",
  title: {
    en: "Welcome to MAIO 2025",
    mn: "MAIO 2025-д тавтай морилно уу",
  },
  content: {
    en: "<p>Welcome to the <strong>Mongolian AI Olympiad 2025</strong>!</p><p>This year we are excited to bring you new features and improvements. <em>Join us</em> for the most innovative AI competition in Mongolia.</p><ul><li>New categories</li><li>Enhanced tools</li><li>Better user experience</li></ul>",
    mn: "<p><strong>Монголын AI Олимпиад 2025</strong>-д тавтай морилно уу!</p><p>Энэ жил бид танд шинэ боломжууд, сайжруулалтыг авчрахад баяртай байна. Монгол дахь хамгийн шинэлэг AI тэмцээнд <em>оролцоорой</em>.</p><ul><li>Шинэ төрлүүд</li><li>Сайжруулсан хэрэгслүүд</li><li>Илүү сайн хэрэглэгчийн туршлага</li></ul>",
  },
  summary: {
    en: "Welcome to the most innovative AI competition in Mongolia with new features and improvements.",
    mn: "Шинэ боломжууд, сайжруулалттай Монгол дахь хамгийн шинэлэг AI тэмцээнд тавтай морилно уу.",
  },
  category: "announcement",
  author: "MAIO Team",
  publishDate: "2025-01-01",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
  imageUrl: "/images/welcome.jpg",
  tags: ["welcome", "announcement", "2025"],
  featured: true,
};

// Mock Events
export const events: Event[] = [
  {
    _id: "1",
    id: "1",
    title: {
      en: "MAIO 2025 Opening Ceremony",
      mn: "MAIO 2025 Нээлтийн ёслол",
    },
    description: {
      en: "Join us for the grand opening ceremony of the Mongolian AI Olympiad 2025. This exciting event will mark the beginning of our journey into the future of artificial intelligence.",
      mn: "Монголын AI Олимпиад 2025-ын их нээлтийн ёслолд оролцоорой. Энэхүү сонирхолтой арга хэмжээ нь хиймэл оюун ухааны ирээдүй рүү чиглэсэн бидний аяллын эхлэлийг тэмдэглэх болно.",
    },
    date: "2025-03-15",
    time: "10:00",
    location: {
      en: "National University of Mongolia",
      mn: "Монгол Улсын Их Сургууль",
    },
    category: "ceremony",
    imageUrl: "/assets/images/opening-ceremony.jpg",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

// Mock Competitions
export const competitions: Competition[] = [];

// Mock Media Items
export const mediaItems: MediaItem[] = [];

// Mock Sponsors
export const sponsors: Sponsor[] = [];

// Helper function to get featured articles
export const getFeaturedArticles = (): Article[] => {
  return articles.filter((article) => article.featured);
};

// Helper function to get latest articles
export const getLatestArticles = (count: number = 5): Article[] => {
  return [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    )
    .slice(0, count);
};

// Helper function to get articles by category
export const getArticlesByCategory = (category: string): Article[] => {
  return articles.filter((article) => article.category === category);
};

// Helper function to search articles
export const searchArticles = (query: string): Article[] => {
  const lowercaseQuery = query.toLowerCase();
  return articles.filter(
    (article) =>
      article.title.en.toLowerCase().includes(lowercaseQuery) ||
      article.title.mn.toLowerCase().includes(lowercaseQuery) ||
      article.content.en.toLowerCase().includes(lowercaseQuery) ||
      article.content.mn.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};

// Helper function to get upcoming events
export const getUpcomingEvents = (): Event[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...events]
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
