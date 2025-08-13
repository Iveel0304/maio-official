import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, Check, Copy } from 'lucide-react';
import { Button } from './button';
import { useLanguage } from '@/contexts/LanguageContext';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const SocialShare = ({ url, title, description = '', className = '' }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description)
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.title}`,
      color: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950',
      bgColor: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}`,
      color: 'text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950',
      bgColor: 'from-sky-500 to-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}&title=${shareData.title}&summary=${shareData.description}`,
      color: 'text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950',
      bgColor: 'from-blue-700 to-blue-800'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${shareData.title}&body=${shareData.description}%20${shareData.url}`,
      color: 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900',
      bgColor: 'from-gray-600 to-gray-700'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
  };

  // Check if Web Share API is available
  const canUseNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const handleNativeShare = async () => {
    if (canUseNativeShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        className="flex items-center gap-2"
      >
        {/* Main share button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Share2 className="h-4 w-4 mr-2" />
          </motion.div>
          {language === 'en' ? 'Share' : 'Хуваалцах'}
        </Button>

        {/* Native share button (mobile) */}
        {canUseNativeShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNativeShare}
            className="md:hidden"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </motion.div>

      {/* Share options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 left-0 bg-background border border-border rounded-lg shadow-lg p-2 z-50 min-w-[200px]"
          >
            <div className="space-y-1">
              {/* Social media buttons */}
              {socialLinks.map((social, index) => (
                <motion.button
                  key={social.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  onClick={() => handleShare(social.url)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${social.color} hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className={`p-1.5 rounded-full bg-gradient-to-r ${social.bgColor} text-white`}>
                    <social.icon className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">{social.name}</span>
                </motion.button>
              ))}

              {/* Copy link button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: socialLinks.length * 0.05, duration: 0.2 }}
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="p-1.5 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                  <motion.div
                    animate={{ scale: copied ? [1, 1.3, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}
                  </motion.div>
                </div>
                <span className="text-sm font-medium">
                  {copied 
                    ? (language === 'en' ? 'Copied!' : 'Хуулсан!') 
                    : (language === 'en' ? 'Copy Link' : 'Линк хуулах')
                  }
                </span>
              </motion.button>
            </div>

            {/* Close button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-2 pt-2 border-t border-border"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs text-muted-foreground"
              >
                {language === 'en' ? 'Close' : 'Хаах'}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;
