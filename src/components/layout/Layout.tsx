import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <motion.main 
        className={`flex-1 ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
