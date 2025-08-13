import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { articles, events, mediaItems } from '@/lib/mockData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, FileText, Plus, Image, TrendingUp, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  const stats = [
    {
      title: { en: 'Total Articles', mn: 'Нийт мэдээ' },
      value: articles.length,
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      title: { en: 'Upcoming Events', mn: 'Ирэх арга хэмжээ' },
      value: events.filter(event => new Date(event.date) >= new Date()).length,
      icon: CalendarDays,
      color: 'text-amber-500',
    },
    {
      title: { en: 'Media Items', mn: 'Медиа' },
      value: mediaItems.length,
      icon: Image,
      color: 'text-purple-500',
    },
    {
      title: { en: 'Featured Articles', mn: 'Онцлох мэдээ' },
      value: articles.filter(article => article.featured).length,
      icon: TrendingUp,
      color: 'text-green-500',
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
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
        
        {/* Recent Content */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Articles */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Recent Articles' : 'Сүүлийн мэдээнүүд'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Recently published or updated articles'
                  : 'Саяхан нийтлэгдсэн эсвэл шинэчлэгдсэн мэдээнүүд'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles
                  .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
                  .slice(0, 5)
                  .map((article) => (
                    <div key={article.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{article.title[language]}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(article.publishDate), 'PPP')}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/articles/edit/${article.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Events */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Upcoming Events' : 'Ирэх арга хэмжээнүүд'}
              </CardTitle>
              <CardDescription>
                {language === 'en' 
                  ? 'Events scheduled in the near future'
                  : 'Ойрын ирээдүйд төлөвлөгдсөн арга хэмжээнүүд'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.title[language]}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(event.date), 'PPP')} - {event.time}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/admin/events/edit/${event.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  ))}

                {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    {language === 'en' ? 'No upcoming events' : 'Ирэх арга хэмжээ алга байна'}
                  </p>
                )}
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