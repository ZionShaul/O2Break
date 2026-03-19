import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lang } from '../types';

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'he',
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('he');

  useEffect(() => {
    AsyncStorage.getItem('lang').then(v => {
      if (v === 'he' || v === 'en') setLang(v);
    });
  }, []);

  const toggle = () => {
    const next: Lang = lang === 'he' ? 'en' : 'he';
    setLang(next);
    AsyncStorage.setItem('lang', next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

/** Translate helper: picks Hebrew or English string based on current lang */
export const t = (lang: Lang, he: string, en: string): string =>
  lang === 'he' ? he : en;
