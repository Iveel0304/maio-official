import { createContext, useState, useContext, ReactNode } from "react";
import { Language } from "@/types";
import { safeTranslate } from "@/lib/translationValidator";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: { en: string; mn: string } | string | undefined | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("mn");

  const t = (text: { en: string; mn: string } | string | undefined | null): string => {
    // Handle null, undefined, or empty values
    if (!text) return '';
    
    // If already a string, return it
    if (typeof text === 'string') return text;
    
    // If it's an object, ensure it has the expected structure
    if (typeof text === 'object' && text !== null) {
      // Ensure we return a string, not an object
      const result = text[language] || text.en || text.mn || '';
      return typeof result === 'string' ? result : '';
    }
    
    // Fallback for any other type
    return '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
