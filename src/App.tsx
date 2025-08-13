import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import NewsPage from './pages/NewsPage';
import ArticlePage from './pages/ArticlePage';
import EventsPage from './pages/EventsPage';
import ResultsPage from './pages/ResultsPage';
import GalleryPage from './pages/GalleryPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:id" element={<ArticlePage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                
                {/* Articles Management */}
                <Route path="/admin/articles" element={<AdminDashboard />} />
                <Route path="/admin/articles/new" element={<AdminDashboard />} />
                <Route path="/admin/articles/edit/:id" element={<AdminDashboard />} />
                
                {/* Events Management */}
                <Route path="/admin/events" element={<AdminDashboard />} />
                <Route path="/admin/events/new" element={<AdminDashboard />} />
                <Route path="/admin/events/edit/:id" element={<AdminDashboard />} />
                
                {/* Media/Gallery Management */}
                <Route path="/admin/gallery" element={<AdminDashboard />} />
                <Route path="/admin/gallery/upload" element={<AdminDashboard />} />
                
                {/* Results Management */}
                <Route path="/admin/results" element={<AdminDashboard />} />
                <Route path="/admin/results/new" element={<AdminDashboard />} />
                <Route path="/admin/results/edit/:id" element={<AdminDashboard />} />
                
                {/* Sponsors Management */}
                <Route path="/admin/sponsors" element={<AdminDashboard />} />
                
                {/* Settings */}
                <Route path="/admin/settings" element={<AdminDashboard />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;