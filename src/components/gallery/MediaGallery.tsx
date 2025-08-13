import { useState } from 'react';
import { MediaItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaGalleryProps {
  mediaItems: MediaItem[];
}

const MediaGallery = ({ mediaItems }: MediaGalleryProps) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get unique categories
  const categories = ['all', ...new Set(mediaItems.map(item => item.category || 'other'))];
  
  // Filter media items based on active tab
  const filteredItems = activeTab === 'all'
    ? mediaItems
    : mediaItems.filter(item => item.category === activeTab);
  
  // Filter by media type
  const images = filteredItems.filter(item => item.type === 'image');
  const videos = filteredItems.filter(item => item.type === 'video');
  
  const openMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setIsDialogOpen(true);
  };
  
  // Function to navigate between media items
  const navigateMedia = (direction: 'next' | 'prev') => {
    if (!selectedMedia) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === selectedMedia.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredItems.length;
    } else {
      newIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    }
    
    setSelectedMedia(filteredItems[newIndex]);
  };
  
  const categoryLabels = {
    en: {
      all: 'All',
      event: 'Events',
      workshop: 'Workshops',
      interview: 'Interviews',
      competition: 'Competitions',
      other: 'Other'
    },
    mn: {
      all: 'Бүгд',
      event: 'Арга хэмжээ',
      workshop: 'Семинар',
      interview: 'Ярилцлага',
      competition: 'Тэмцээн',
      other: 'Бусад'
    }
  };
  
  return (
    <div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-6 overflow-x-auto">
          <TabsList>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {categoryLabels[language][category as keyof typeof categoryLabels.en] || category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-4">
          {filteredItems.length > 0 ? (
            <>
              {images.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">
                    {language === 'en' ? 'Photos' : 'Зургууд'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map(image => (
                      <Dialog 
                        key={image.id} 
                        open={isDialogOpen && selectedMedia?.id === image.id}
                        onOpenChange={(open) => {
                          if (!open) setIsDialogOpen(false);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Card 
                            className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openMedia(image)}
                          >
                            <div className="aspect-square relative overflow-hidden">
                              <img 
                                src={image.url} 
                                alt={t(image.title)}
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
                          <div className="relative">
                            <div className="flex justify-between items-center absolute top-2 left-2 right-2 z-10">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full"
                                onClick={() => navigateMedia('prev')}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              <Button 
                                size="icon"
                                variant="secondary"
                                className="rounded-full"
                                onClick={() => setIsDialogOpen(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full"
                                onClick={() => navigateMedia('next')}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <img 
                              src={selectedMedia?.url} 
                              alt={selectedMedia ? t(selectedMedia.title) : ''}
                              className="max-h-[80vh] mx-auto" 
                            />
                            
                            <div className="bg-background/80 backdrop-blur-sm p-4 absolute bottom-0 left-0 right-0">
                              <h3 className="font-medium text-lg">
                                {selectedMedia ? t(selectedMedia.title) : ''}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedMedia?.date}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              )}
              
              {videos.length > 0 && (
                <div>
                  <h3 className="text-xl font-medium mb-4">
                    {language === 'en' ? 'Videos' : 'Бичлэгүүд'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(video => (
                      <Card key={video.id} className="overflow-hidden">
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={video.url}
                            title={t(video.title)}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium">{t(video.title)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {video.date}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                {language === 'en' ? 'No media items found' : 'Медиа элемент олдсонгүй'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'en' 
                  ? 'There are no media items in this category.'
                  : 'Энэ ангилалд медиа элемент байхгүй байна.'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaGallery;