import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Home, Search, RefreshCw, Zap, Brain, Cpu } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

export default function NotFound() {
  const { language } = useLanguage();
  
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground variant="circuit" interactive className="opacity-20" />
        
        <div className="container py-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Animated Robot Face */}
            <motion.div
              className="relative w-32 h-32 mx-auto mb-8"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Robot Head */}
              <div className="w-32 h-32 bg-gradient-to-br from-slate-600 to-slate-800 rounded-2xl border-4 border-primary/30 relative">
                {/* Eyes */}
                <div className="flex justify-center gap-3 pt-6">
                  <motion.div
                    className="w-4 h-4 bg-red-500 rounded-full"
                    animate={{
                      opacity: [1, 0.3, 1],
                      scale: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="w-4 h-4 bg-red-500 rounded-full"
                    animate={{
                      opacity: [1, 0.3, 1],
                      scale: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.1
                    }}
                  />
                </div>
                
                {/* Mouth - Sad expression */}
                <div className="mt-4 flex justify-center">
                  <div className="w-8 h-2 bg-slate-400 rounded-full transform rotate-180" />
                </div>
                
                {/* Antenna */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-1 h-4 bg-primary"></div>
                  <motion.div
                    className="w-3 h-3 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                {/* Circuit patterns on the head */}
                <div className="absolute inset-2 opacity-30">
                  <svg className="w-full h-full">
                    <path 
                      d="M4 4h20v4h-8v8h8v4h-20z" 
                      stroke="currentColor" 
                      strokeWidth="1" 
                      fill="none"
                      className="text-primary"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
            
            {/* 404 with glitch effect */}
            <motion.div
              className="relative mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
                404
              </h1>
              <motion.div
                className="absolute inset-0 text-8xl md:text-9xl font-bold text-red-500 opacity-20"
                animate={{
                  x: [0, -2, 2, 0],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                404
              </motion.div>
            </motion.div>

            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Brain className="h-8 w-8 text-primary" />
              {language === 'en' ? 'AI System Error' : 'AI Системийн алдаа'}
            </motion.h2>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {language === 'en' 
                ? "Oops! Our AI couldn't find this page. It seems to have wandered off into the digital void."
                : "Өө! Манай хиймэл оюун ухаан энэ хуудсыг олж чадсангүй. Дижитал орон зайд төөрчихсөн бололтой."}
            </motion.p>

            {/* Error details */}
            <motion.div
              className="bg-muted/30 rounded-lg p-4 mb-8 text-left font-mono text-sm border border-muted-foreground/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <Zap className="h-4 w-4" />
                <span>ERROR_404_PAGE_NOT_FOUND</span>
              </div>
              <div className="text-muted-foreground">
                {language === 'en' ? 'Status: Neural pathways disconnected' : 'Төлөв: Мэдрэлийн замууд тасарсан'}<br />
                {language === 'en' ? 'Location: Unknown dimension' : 'Байршил: Үл мэдэгдэх орон зай'}<br />
                {language === 'en' ? 'Suggestion: Return to base reality' : 'Санал: Үндсэн бодит байдал руу буцах'}
              </div>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button size="lg" asChild className="group">
                <Link to="/" className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  {language === 'en' ? 'Return to Base' : 'Үндсэн хуудас руу буцах'}
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link to="/search" className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  {language === 'en' ? 'Search Database' : 'Мэдээллийн сангаас хайх'}
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost" 
                onClick={() => window.location.reload()}
                className="flex items-center"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {language === 'en' ? 'Retry Connection' : 'Дахин холболт хийх'}
              </Button>
            </motion.div>

            {/* Fun AI facts */}
            <motion.div
              className="mt-12 p-4 bg-primary/5 rounded-lg border border-primary/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cpu className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">
                  {language === 'en' ? 'AI Fact' : 'AI-ийн бодит байдал'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {language === 'en' 
                  ? "Did you know? The first AI program was written in 1951. Today, AI helps millions of people find their way back from 404 errors!"
                  : "Та мэдэх үү? Анхны хиймэл оюун ухааны программыг 1951 онд бичжээ. Өнөөдөр хиймэл оюун ухаан сая сая хүмүүст 404 алдаанаас буцах замыг олоход тусалдаг!"}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
