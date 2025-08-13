import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoadingScreenProps {
  message?: string;
  minimal?: boolean;
}

const LoadingScreen = ({ message, minimal = false }: LoadingScreenProps) => {
  const { language } = useLanguage();
  
  const defaultMessage = language === 'en' ? 'Loading...' : 'Ачаалж байна...';
  
  if (minimal) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-2"
        >
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-primary" />
        </motion.div>
        {message !== null && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground text-lg font-medium"
          >
            {message || defaultMessage}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
