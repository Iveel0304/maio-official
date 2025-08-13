import { Event } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { language, t } = useLanguage();
  
  // Format date based on language
  const formattedDate = format(new Date(event.date), 'PPP');
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="w-full">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={event.imageUrl || '/assets/images/placeholder-event.jpg'}
            alt={t(event.title)}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold">{t(event.title)}</h3>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-3 mb-4">
          <div className="flex items-start gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p>{event.time}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p>{event.location}</p>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground line-clamp-3">
          {t(event.description)}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full">
          {language === 'en' ? 'View Details' : 'Дэлгэрэнгүй харах'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;