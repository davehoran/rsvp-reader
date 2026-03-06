import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { lsGet, lsSet } from '../utils/localStorage.js';

const DEFAULTS = { wpm: 250, chunkSize: 1, theme: 'light' };

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => ({
    ...DEFAULTS,
    ...lsGet('settings', {}),
  }));

  useEffect(() => {
    lsSet('settings', settings);
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, []);

  const update = useCallback((patch) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
