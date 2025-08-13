import Layout from '@/components/layout/Layout';
import MediaGallery from '@/components/gallery/MediaGallery';
import { useLanguage } from '@/contexts/LanguageContext';
import { mediaItems } from '@/lib/mockData';

export default function GalleryPage() {
  const { language } = useLanguage();
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Media Gallery' : 'Медиа галерей'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'en' 
              ? 'Browse photos and videos from Mongolian AI Olympiad events and activities.'
              : 'Монголын AI Олимпиадын арга хэмжээ, үйл ажиллагааны зураг, видеог үзнэ үү.'}
          </p>
        </div>
        
        <MediaGallery mediaItems={mediaItems} />
      </div>
    </Layout>
  );
}