import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileText, Plus, Image, TrendingUp, Eye, Building2, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import NewsManager from '@/components/admin/NewsManager';
import EventsManager from '@/components/admin/EventsManager';
import MediaManager from '@/components/admin/MediaManager';
import ResultsManager from '@/components/admin/ResultsManager';
import SponsorsManager from '@/components/admin/SponsorsManager';
import { newsApi, eventsApi, mediaApi, resultsApi, sponsorsApi } from '@/lib/api';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({
    articles: 0,
    events: 0,
    media: 0,
    results: 0,
    sponsors: 0
  });
  
  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [articlesRes, eventsRes, mediaRes, resultsRes, sponsorsRes] = await Promise.all([
          newsApi.getNews({ limit: 1 }),
          eventsApi.getEvents({ limit: 1 }),
          mediaApi.getMedia({ limit: 1 }),
          resultsApi.getResults({ limit: 1 }),
          sponsorsApi.getSponsors()
        ]);
        
        setStats({
          articles: articlesRes.pagination?.total || 0,
          events: eventsRes.pagination?.total || 0,
          media: mediaRes.pagination?.total || 0,
          results: resultsRes.pagination?.total || 0,
          sponsors: (sponsorsRes.data || []).length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    
    fetchStats();
  }, []);
  
  // Route to different management components
  const isArticlesRoute = location.pathname.includes('/articles');
  const isEventsRoute = location.pathname.includes('/events');
  const isGalleryRoute = location.pathname.includes('/gallery');
  const isResultsRoute = location.pathname.includes('/results');
  const isSponsorsRoute = location.pathname.includes('/sponsors');
  
  if (isArticlesRoute) {
    return (
      <AdminLayout>
        <NewsManager />
      </AdminLayout>
    );
  }
  
  if (isEventsRoute) {
    return (
      <AdminLayout>
        <EventsManager />
      </AdminLayout>
    );
  }
  
  if (isGalleryRoute) {
    return (
      <AdminLayout>
        <MediaManager />
      </AdminLayout>
    );
  }
  
  if (isResultsRoute) {
    return (
      <AdminLayout>
        <ResultsManager />
      </AdminLayout>
    );
  }
  
  if (isSponsorsRoute) {
    return (
      <AdminLayout>
        <SponsorsManager />
      </AdminLayout>
    );
  }
  
  const dashboardStats = [
    {
      title: { en: 'Total Articles', mn: 'Нийт мэдээ' },
      value: stats.articles,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      title: { en: 'Total Events', mn: 'Нийт арга хэмжээ' },
      value: stats.events,
      icon: CalendarDays,
      color: 'text-amber-500',
    },
    {
      title: { en: 'Media Items', mn: 'Медиа' },
      value: stats.media,
      icon: Image,
      color: 'text-purple-500',
    },
    {
      title: { en: 'Results', mn: 'Үр дүн' },
      value: stats.results,
      icon: Trophy,
      color: 'text-green-500',
    },
    {
      title: { en: 'Sponsors', mn: 'Ивээн тэтгэгч' },
      value: stats.sponsors,
      icon: Building2,
      color: 'text-indigo-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {language === 'en' ? 'Dashboard' : 'Удирдлагын самбар'}
          </h1>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link to="/admin/articles/new">
                <Plus className="mr-2 h-4 w-4" />
                {language === 'en' ? 'New Article' : 'Шинэ мэдээ'}
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {dashboardStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === 'en' ? stat.title.en : stat.title.mn}
                </CardTitle>
                <div className={`${stat.color} bg-muted p-2 rounded-md`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Quick Navigation */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'en' ? 'Manage Articles' : 'Мэдээ удирдах'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Create and edit news articles' : 'Мэдээ бичиж засварлах'}
                  </p>
                  <Link to="/admin/articles">
                    <Button size="sm" className="mt-2">
                      {language === 'en' ? 'Go to Articles' : 'Мэдээ рүү очих'}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <CalendarDays className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'en' ? 'Manage Events' : 'Арга хэмжээ удирдах'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Schedule and organize events' : 'Арга хэмжээ зохион байгуулах'}
                  </p>
                  <Link to="/admin/events">
                    <Button size="sm" className="mt-2">
                      {language === 'en' ? 'Go to Events' : 'Арга хэмжээ рүү очих'}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'en' ? 'Manage Results' : 'Үр дүн удирдах'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Add competition results' : 'Тэмцээний үр дүн нэмэх'}
                  </p>
                  <Link to="/admin/results">
                    <Button size="sm" className="mt-2">
                      {language === 'en' ? 'Go to Results' : 'Үр дүн рүү очих'}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Building2 className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {language === 'en' ? 'Manage Sponsors' : 'Ивээн тэтгэгч удирдах'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'en' ? 'Add and manage sponsors' : 'Ивээн тэтгэгч нэмж удирдах'}
                  </p>
                  <Link to="/admin/sponsors">
                    <Button size="sm" className="mt-2">
                      {language === 'en' ? 'Go to Sponsors' : 'Ивээн тэтгэгч рүү очих'}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Quick Actions' : 'Хурдан үйлдлүүд'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex flex-col py-4 px-2" asChild>
                <Link to="/admin/articles/new">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>{language === 'en' ? 'New Article' : 'Шинэ мэдээ'}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col py-4 px-2" asChild>
                <Link to="/admin/events/new">
                  <CalendarDays className="h-6 w-6 mb-2" />
                  <span>{language === 'en' ? 'New Event' : 'Шинэ арга хэмжээ'}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col py-4 px-2" asChild>
                <Link to="/admin/gallery/upload">
                  <Image className="h-6 w-6 mb-2" />
                  <span>{language === 'en' ? 'Upload Media' : 'Медиа оруулах'}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col py-4 px-2" asChild>
                <Link to="/admin/results/new">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>{language === 'en' ? 'Add Results' : 'Үр дүн нэмэх'}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Welcome message */}
        <Card>
          <CardContent className="pt-6">
            <p>
              {language === 'en' 
                ? `Welcome, ${user?.name || user?.username}! You are logged in as ${user?.role}.` 
                : `Тавтай морил, ${user?.name || user?.username}! Та ${user?.role} эрхээр нэвтэрсэн байна.`}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}