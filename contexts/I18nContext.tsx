import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'ar';

const STRINGS: Record<Lang, Record<string, string>> = {
  en: {
    welcome: 'Welcome back',
    email: 'Email',
    password: 'Password',
    continue: 'Continue',
    forgot: 'Forgot password?',
    google: 'Continue with Google',
    createCustomer: 'Create a customer account',
    applyDriver: 'Apply as a rider',
    adminHint: 'Admin login only. Use Admin / Habibi321',
  },
  ar: {
    welcome: 'مرحباً من جديد',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    continue: 'متابعة',
    forgot: 'هل نسيت كلمة المرور؟',
    google: 'المتابعة عبر جوجل',
    createCustomer: 'إنشاء حساب زبون',
    applyDriver: 'قدّم كسائق توصيل',
    adminHint: 'تسجيل دخول المدير فقط: Admin / Habibi321',
  },
};

type I18nValue = {
  lang: Lang;
  t: (key: string) => string;
  setLang: (l: Lang) => void;
};

const I18nContext = createContext<I18nValue | undefined>(undefined);
const STORAGE_KEY = 'app_lang_code_v1';

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'ar' || saved === 'en') setLangState(saved);
      } catch {}
    })();
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    AsyncStorage.setItem(STORAGE_KEY, l).catch(() => {});
  }, []);

  const t = useCallback((key: string) => {
    return STRINGS[lang][key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};

