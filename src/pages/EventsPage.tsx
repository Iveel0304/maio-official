import Layout from '@/components/layout/Layout';
import EventSchedule from '@/components/events/EventSchedule';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/lib/mockData';

export default function EventsPage() {
  const { language } = useLanguage();
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Events Schedule' : 'Арга хэмжээний хуваарь'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'en' 
              ? 'Find all upcoming and past events related to the Mongolian AI Olympiad.'
              : 'Монголын AI Олимпиадтай холбоотой ирээдүй болон өнгөрсөн бүх арга хэмжээг олно уу.'}
          </p>
        </div>
        
        <EventSchedule events={events} />
      </div>
    </Layout>
  );
}