import { Context, createContext, useContext, useEffect, useState } from 'react'
import { useNuiEvent } from '../hooks/useNuiEvent'
import { fetchNui } from '../utils/fetchNui'

import * as defaultLocale from '../../../locales/en.json'; 

// Typage des locales et du contexte
type Locale = Record<string, string>;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locales: Locale) => void;
  getLocale: (key: string) => string;
}

// Création du contexte avec une valeur par défaut vide
export const LocaleCtx = createContext<LocaleContextValue>({
  locale: {},
  setLocale: () => {}, // Fonction vide par défaut
  getLocale: (key) => key, // Fonction par défaut qui retourne la clé si non trouvée
});

// Création d'un Provider pour le contexte Locale
const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // État pour stocker les locales
  const [locale, setLocale] = useState<Locale>({});

  // Fonction pour obtenir une chaîne de caractères avec une valeur par défaut si la clé n'existe pas
  const getLocale = (key: string): string => {
    return locale[key] ?? (defaultLocale as Locale)[key] ?? key;
  };

  useEffect(() => {
    fetchNui('loadLocale')
  }, [])

  useNuiEvent('setLocale', async (data: Locale) => setLocale(data))

  return <LocaleCtx.Provider value={{ locale, setLocale, getLocale }}>{children}</LocaleCtx.Provider>;
};

export default LocaleProvider

// Hook pour utiliser le contexte des locales
export const useLocales = () => useContext<LocaleContextValue>(LocaleCtx as Context<LocaleContextValue>);