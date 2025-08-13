import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Trophy, Users, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
    en: "Mongolian AI Olympiad",
    mn: "Монголын AI Олимпиад",
  },
  subtitle = {
    en: "Mongolia's premier artificial intelligence competition",
    mn: "Монгол Улсын тэргүүлэх хиймэл оюун ухааны тэмцээн",
  },
}: HeroBannerProps) => {
  const { language, t } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-primary/10">
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: [
            "linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)",
            "linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
            "linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.1), transparent)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [-20, window.innerHeight + 20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Registration badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block"
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 transition-colors"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mr-2"
                >
                  🔥
                </motion.span>
                {language === "en"
                  ? "MAIO 2025 Registration Coming Soon"
                  : "MAIO 2025 Бүртгэл Тун Удахгүй"}
              </Badge>
            </motion.div>

            {/* Main title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {language === "en" ? title.en : title.mn}
                </span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {language === "en" ? subtitle.en : subtitle.mn}
            </motion.p>

            {/* Key highlights */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {[
                {
                  icon: Users,
                  label: { en: "100+ Participants", mn: "100+ Оролцогч" },
                },
                {
                  icon: Trophy,
                  label: { en: "Not Available", mn: "Тодорхойгүй" },
                },
                {
                  icon: Calendar,
                  label: { en: "Not Available", mn: "Төлөвлөгөө гараагүй" },
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground justify-center lg:justify-start"
                  whileHover={{ scale: 1.05 }}
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>
                    {language === "en" ? item.label.en : item.label.mn}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Button
                size="lg"
                asChild
                className="group bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Link to="/register" className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  {language === "en" ? "Register Now" : "Одоо бүртгүүлэх"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="group border-primary/30 hover:bg-primary/10"
              >
                <Link to="/about" className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {language === "en" ? "Learn More" : "Дэлгэрэнгүй мэдээлэл"}
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right visual content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative max-w-md mx-auto">
              {/* Main event card */}
              <motion.div
                className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 shadow-2xl border border-primary/20"
                whileHover={{ y: -10, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Animated border glow */}
                <motion.div
                  className="absolute -inset-0.5 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-3xl opacity-20"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />

                <div className="relative z-10 text-center">
                  {/* Event logo/icon */}
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center"
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <span className="text-3xl font-bold text-white">AI</span>
                  </motion.div>

                  <h3 className="text-3xl font-bold mb-2">
                    MAIO 2025 - {language === "en" ? "Round 1" : "1-р шат"}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {language === "en"
                          ? "Not Available"
                          : "Хугацаа Тодорхойгүй"}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <span>🇲🇳</span>
                      <span>
                        {language === "en"
                          ? "Throughout Mongolia"
                          : "Монгол улс даяар"}
                      </span>
                    </div>
                  </div>

                  {/* Status indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
                        {language === "en" ? "Registration" : "Бүртгэл"}
                      </div>
                      <div className="text-green-800 dark:text-green-200 font-bold text-xs">
                        {language === "en" ? "COMING SOON" : "ТУН УДАХГҮЙ"}
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {language === "en" ? "Prize Pool" : "Шагнал"}
                      </div>
                      <div className="text-blue-800 dark:text-blue-200 font-bold text-xs">
                        {language === "en" ? "Not Available" : "Тодорхойгүй"}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-lg"
                animate={{
                  rotate: [0, 360],
                  y: [0, -10, 0],
                }}
                transition={{
                  rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
              >
                🏆
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-xl shadow-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🤖
              </motion.div>

              <motion.div
                className="absolute top-1/2 -left-6 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-sm shadow-lg"
                animate={{
                  x: [0, -5, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🧠
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-muted/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="currentColor"
            className="text-muted/20"
            animate={{
              d: [
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
                "M0,0V46.29c47.79,42.2,103.59,52.17,158,48,70.36-5.37,136.33-23.31,206.8-27.5C438.64,52.43,512.34,73.67,583,92.05c69.27,18,138.3,14.88,209.4,3.08,36.15-6,69.85-27.84,104.45-39.34C989.49,35,1113-4.29,1200,62.47V0Z",
                "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default HeroBanner;
