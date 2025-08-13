import { createContext, useState, useContext, ReactNode } from "react";
import { Language } from "@/types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: { en: string; mn: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("mn");

  const t = (text: { en: string; mn: string }) => {
    return text[language] || text.en;
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
