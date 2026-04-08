import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'dark' | 'light';
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() =>
    (localStorage.getItem('skindetect_theme') as Theme) || 'dark'
  );

  const getEffective = (t: Theme): 'dark' | 'light' =>
    t === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t;

  const [effectiveTheme, setEffective] = useState<'dark' | 'light'>(() => getEffective(theme));

  const apply = (t: Theme) => {
    const effective = getEffective(t);
    setEffective(effective);
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(effective);
  };

  useEffect(() => {
    apply(theme);
    // Listen for system preference changes
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (theme === 'system') apply('system'); };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem('skindetect_theme', t);
    setThemeState(t);
    apply(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
