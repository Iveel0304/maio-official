import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchArticles } from '@/lib/mockData';
import ArticleGrid from '@/components/articles/ArticleGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState(searchArticles(query));
  
  useEffect(() => {
    const searchQuery = searchParams.get('q') || '';
    setQuery(searchQuery);
    
    if (searchQuery) {
      setSearchResults(searchArticles(searchQuery));
    } else {
      setSearchResults([]);
    }
  }, [searchParams]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      setSearchParams({ q: query });
      setSearchResults(searchArticles(query));
    }
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Search Results' : 'Хайлтын үр дүн'}
          </h1>
          
          {query && (
            <p className="text-xl text-muted-foreground">
              {language === 'en' 
                ? `Results for "${query}"`
                : `"${query}" хайлтын үр дүн`}
            </p>
          )}
        </div>
        
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder={language === 'en' ? 'Search articles...' : 'Мэдээлэл хайх...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              {language === 'en' ? 'Search' : 'Хайх'}
            </Button>
          </form>
        </div>
        
        {query ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {searchResults.length === 0
                  ? (language === 'en' ? 'No results found' : 'Үр дүн олдсонгүй')
                  : (language === 'en' 
                      ? `Found ${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
                      : `${searchResults.length} үр дүн олдлоо`)
                }
              </h2>
            </div>
            
            {searchResults.length > 0 && (
              <ArticleGrid articles={searchResults} />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'en' ? 'Enter a search term' : 'Хайх үгээ оруулна уу'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Use the search box above to find articles, news, and announcements.'
                : 'Мэдээ, мэдээлэл болон зарлалуудыг олоход дээрх хайлтын хайрцгийг ашиглана уу.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}