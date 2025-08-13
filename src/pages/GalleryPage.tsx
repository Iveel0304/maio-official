import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import MediaGallery from '@/components/gallery/MediaGallery';
import { useLanguage } from '@/contexts/LanguageContext';
import { mediaApi } from '@/lib/api';
import PageTransition from '@/components/ui/PageTransition';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { toast } from 'sonner';

export default function GalleryPage() {
  const { language } = useLanguage();
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMediaItems = async () => {
      setLoading(true);
      setError(null);
      
      const result = await mediaApi.getMedia({ limit: 50 });
      
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setMediaItems(result.data || []);
      }
      
      setLoading(false);
    };
    
    fetchMediaItems();
  }, []);
  
  if (loading) {
    return <LoadingScreen message={null} />;
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
                  {language === 'en' ? 'Media Gallery' : 'Медиа галерей'}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {language === 'en' 
                    ? 'Browse photos and videos from Mongolian AI Olympiad events and activities.'
                    : 'Монголын AI Олимпиадын арга хэмжээ, үйл ажиллагааны зураг, видеог үзнэ үү.'}
                </p>
              </motion.div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MediaGallery mediaItems={mediaItems} />
            </motion.div>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}
