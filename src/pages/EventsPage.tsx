import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import EventSchedule from '@/components/events/EventSchedule';
import { useLanguage } from '@/contexts/LanguageContext';
import { eventsApi } from '@/lib/api';
import PageTransition from '@/components/ui/PageTransition';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { toast } from 'sonner';

export default function EventsPage() {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      
      const result = await eventsApi.getEvents({ limit: 20 });
      
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setEvents(result.data || []);
      }
      
      setLoading(false);
    };
    
    fetchEvents();
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
                  {language === 'en' ? 'Events Schedule' : 'Арга хэмжээний хуваарь'}
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {language === 'en' 
                    ? 'Find all upcoming and past events related to the Mongolian AI Olympiad.'
                    : 'Монголын AI Олимпиадтай холбоотой ирээдүй болон өнгөрсөн бүх арга хэмжээг олно уу.'}
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
              <EventSchedule events={events} />
            </motion.div>
          </div>
        </div>
      </Layout>
    </PageTransition>
  );
}
