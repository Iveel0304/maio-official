import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;