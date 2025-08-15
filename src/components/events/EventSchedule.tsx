import { useState } from 'react';
import { Event } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, isSameDay, isAfter, parseISO } from 'date-fns';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventScheduleProps {
  events: Event[];
}

const EventSchedule = ({ events }: EventScheduleProps) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('upcoming');
  
  // Debug events data
  console.log('EventSchedule received events:', events);

  // Get current date without time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Group events by date for upcoming events
  const upcomingEvents = events
    .filter(event => isAfter(parseISO(event.date), today) || isSameDay(parseISO(event.date), today))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Past events
  const pastEvents = events
    .filter(event => !isAfter(parseISO(event.date), today) && !isSameDay(parseISO(event.date), today))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group upcoming events by date
  const upcomingEventsByDate = upcomingEvents.reduce((acc: Record<string, Event[]>, event) => {
    const dateKey = event.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});
  
  const formatEventDate = (dateStr: string) => {
    return format(new Date(dateStr), 'EEEE, MMMM d, yyyy');
  };
  
  return (
    <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
      <div className="flex justify-center mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            {language === 'en' ? 'Upcoming Events' : 'Ирэх арга хэмжээнүүд'}
          </TabsTrigger>
          <TabsTrigger value="past">
            {language === 'en' ? 'Past Events' : 'Өнгөрсөн арга хэмжээнүүд'}
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="upcoming">
        {Object.keys(upcomingEventsByDate).length > 0 ? (
          Object.keys(upcomingEventsByDate).sort().map((dateKey) => (
            <div key={dateKey} className="mb-8">
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                {formatEventDate(dateKey)}
                {isSameDay(parseISO(dateKey), today) && (
                  <Badge variant="secondary" className="ml-2">
                    {language === 'en' ? 'Today' : 'Өнөөдөр'}
                  </Badge>
                )}
              </h3>
              
              <div className="space-y-4">
                {upcomingEventsByDate[dateKey].map((event) => (
                  <Card key={event._id || event.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {event.imageUrl && (
                          <div className="md:w-1/4 h-auto">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title ? t(event.title) : 'Event image'}
                              className="w-full h-full object-cover aspect-video md:aspect-square" 
                            />
                          </div>
                        )}
                        
                        <div className={`p-6 ${event.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                          <h4 className="text-lg font-bold mb-2">
                            {event.title ? t(event.title) : 'Untitled Event'}
                          </h4>
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {event.location ? 
                                  (typeof event.location === 'string' ? event.location : t(event.location)) 
                                  : 'TBD'
                                }
                              </span>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {event.description ? t(event.description) : 'No description available'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No upcoming events' : 'Ирэх арга хэмжээ алга байна'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Check back later for upcoming events.'
                : 'Ирэх арга хэмжээний талаар дараа шалгана уу.'}
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="past">
        {pastEvents.length > 0 ? (
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <Card key={event._id || event.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {event.imageUrl && (
                      <div className="md:w-1/4 h-auto">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title ? t(event.title) : 'Event image'}
                          className="w-full h-full object-cover aspect-video md:aspect-square" 
                        />
                      </div>
                    )}
                    
                    <div className={`p-6 ${event.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {formatEventDate(event.date)}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">
                        {event.title ? t(event.title) : 'Untitled Event'}
                      </h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {event.location ? 
                              (typeof event.location === 'string' ? event.location : t(event.location)) 
                              : 'TBD'
                            }
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        {event.description ? t(event.description) : 'No description available'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'No past events' : 'Өнгөрсөн арга хэмжээ алга байна'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'There are no past events to display.'
                : 'Харуулах өнгөрсөн арга хэмжээ алга байна.'}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default EventSchedule;