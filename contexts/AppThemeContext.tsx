import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark';

type ThemeColors = {
  background: string;
  heroBackground: string;
  heroOverlay: string;
  surface: string;
  surfaceMuted: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderMuted: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  iconPrimary: string;
  iconSecondary: string;
  highlight: string;
  highlightText: string;
  shadow: string;
  inputBackground: string;
};

type AppThemeContextValue = {
  theme: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const STORAGE_KEY = 'app_theme_mode';

const lightColors: ThemeColors = {
  background: '#f7f8fb',
  heroBackground: '#ffffff',
  heroOverlay: 'rgba(255, 255, 255, 0.78)',
  surface: '#ffffff',
  surfaceMuted: '#f2f4f8',
  surfaceAlt: '#f9fafb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderMuted: '#e2e8f0',
  accent: '#f97316',
  accentSoft: 'rgba(249, 115, 22, 0.16)',
  accentText: '#0f172a',
  iconPrimary: '#f97316',
  iconSecondary: '#64748b',
  highlight: '#f97316',
  highlightText: '#fff7ed',
  shadow: 'rgba(15, 23, 42, 0.08)',
  inputBackground: '#ffffff',
};

const darkColors: ThemeColors = {
  background: '#070e1b',
  heroBackground: '#111d2e',
  heroOverlay: 'rgba(0, 0, 0, 0.35)',
  surface: '#0c1627',
  surfaceMuted: '#111d2e',
  surfaceAlt: '#111d2e',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#94a3b8',
  border: '#1e293b',
  borderMuted: '#1e293b',
  accent: '#f97316',
  accentSoft: 'rgba(249, 115, 22, 0.18)',
  accentText: '#0f172a',
  iconPrimary: '#f97316',
  iconSecondary: '#cbd5f5',
  highlight: '#fde68a',
  highlightText: '#0f172a',
  shadow: 'rgba(0, 0, 0, 0.45)',
  inputBackground: 'rgba(148, 163, 184, 0.12)',
};

const AppThemeContext = createContext<AppThemeContextValue | undefined>(
  undefined
);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
          setTheme(stored);
        } else {
          const system = Appearance.getColorScheme();
          setTheme(system === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        const system = Appearance.getColorScheme();
        setTheme(system === 'dark' ? 'dark' : 'light');
      }
    };

    loadTheme();
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const isDark = theme === 'dark';
  const colors = useMemo(
    () => (isDark ? darkColors : lightColors),
    [isDark]
  );

  const value = useMemo(
    () => ({
      theme,
      isDark,
      colors,
      toggleTheme,
    }),
    [theme, isDark, colors, toggleTheme]
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = (): AppThemeContextValue => {
  const context = useContext(AppThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider');
  }
  return context;
};
