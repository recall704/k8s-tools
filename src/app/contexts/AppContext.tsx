'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';
import { Language } from '../i18n/locales';

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * Provider component for global app state
 * @component
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh-CN');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const value = {
    lang,
    setLang,
    isDarkMode,
    setIsDarkMode,
  };

  return (
    <AppContext.Provider value={value}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </AppContext.Provider>
  );
}

/**
 * Hook to access the app context
 * @returns {AppContextType} The app context value
 * @throws {Error} If used outside of AppProvider
 */
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
