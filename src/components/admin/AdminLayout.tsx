import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Medal, 
  Image, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const menuItems = {
    en: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: FileText, label: 'Articles', href: '/admin/articles' },
      { icon: Calendar, label: 'Events', href: '/admin/events' },
      { icon: Medal, label: 'Results', href: '/admin/results' },
      { icon: Image, label: 'Media Gallery', href: '/admin/gallery' },
      { icon: Users, label: 'Users', href: '/admin/users', adminOnly: true },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ],
    mn: [
      { icon: LayoutDashboard, label: 'Удирдлагын самбар', href: '/admin' },
      { icon: FileText, label: 'Мэдээнүүд', href: '/admin/articles' },
      { icon: Calendar, label: 'Арга хэмжээнүүд', href: '/admin/events' },
      { icon: Medal, label: 'Үр дүнгүүд', href: '/admin/results' },
      { icon: Image, label: 'Медиа галерей', href: '/admin/gallery' },
      { icon: Users, label: 'Хэрэглэгчид', href: '/admin/users', adminOnly: true },
      { icon: Settings, label: 'Тохиргоо', href: '/admin/settings' },
    ]
  };
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems[language].filter(
    item => !item.adminOnly || user.role === 'admin'
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:flex flex-col w-64 bg-background border-r min-h-screen p-4">
        <div className="flex items-center h-12 mb-8">
          <Link to="/" className="flex items-center px-3 font-bold text-lg">
            MAIO Admin
          </Link>
        </div>
        
        <nav className="space-y-1 flex-1">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="pt-4 border-t">
          <div className="px-3 py-2 text-sm text-muted-foreground">
            {user.name || user.username} ({user.role})
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            {language === 'en' ? 'Log Out' : 'Гарах'}
          </Button>
        </div>
      </aside>
      
      {/* Mobile navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-background border-b">
        <Link to="/" className="font-bold text-lg">
          MAIO Admin
        </Link>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="flex items-center h-12 mb-8">
              <div className="font-bold text-lg">MAIO Admin</div>
            </div>
            
            <nav className="space-y-1">
              {filteredMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            
            <div className="pt-4 mt-4 border-t">
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {user.name || user.username} ({user.role})
              </div>
              
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                {language === 'en' ? 'Log Out' : 'Гарах'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Main content */}
      <main className="flex-1">
        <div className="lg:py-8 lg:px-8 p-4 mt-16 lg:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;