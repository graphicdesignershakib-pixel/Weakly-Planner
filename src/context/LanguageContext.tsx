import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'bn' | 'en';

interface LanguageContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  toggleLang: () => void;
  isBn: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bn',
  setLang: () => {},
  toggleLang: () => {},
  isBn: true,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('life_planner_lang');
      return saved === 'en' ? 'en' : 'bn';
    } catch {
      return 'bn';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('life_planner_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isBn: lang === 'bn' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
