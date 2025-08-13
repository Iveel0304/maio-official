import Layout from '@/components/layout/Layout';
import CompetitionResults from '@/components/results/CompetitionResults';
import { useLanguage } from '@/contexts/LanguageContext';
import { competitions } from '@/lib/mockData';

export default function ResultsPage() {
  const { language } = useLanguage();
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Competition Results' : 'Тэмцээний үр дүн'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'en' 
              ? 'View the results and winners from past editions of the Mongolian AI Olympiad.'
              : 'Монголын AI Олимпиадын өмнөх тэмцээнүүдийн үр дүн, ялагчдыг үзнэ үү.'}
          </p>
        </div>
        
        <CompetitionResults competitions={competitions} />
      </div>
    </Layout>
  );
}