import { Context, createContext, useContext, useEffect, useState } from 'react'
import { useNuiEvent } from '../hooks/useNuiEvent'
import { fetchNui } from '../utils/fetchNui' 

// Typages des arguments et actions
type TrollArgument =
  | { type: 'number'; value: string; label: string; default?: number }
  | { type: 'text'; value: string; label: string; default?: string }
  | {
      type: 'select';
      value: string;
      label: string;
      options: { value: string; label: string; selected?: boolean }[];
    };

type TrollAction = {
  value: string;
  label: string;
  arguments: TrollArgument[];
};

// Typage du contexte
interface TrollsContextValue {
  trolls: TrollAction[];
  setTrolls: (trolls: TrollAction[]) => void;
}

// Création du contexte avec une valeur par défaut vide
export const TrollsCtx = createContext<TrollsContextValue>({
  trolls: [],
  setTrolls: () => {}, // Fonction vide par défaut
});

// Création d'un Provider pour le contexte Trolls
const TrollsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // État pour stocker les trolls
  const [trolls, setTrolls] = useState<TrollAction[]>([]);

  useEffect(() => {
    fetchNui('loadTrolls');
  }, []);

  // Gestion des événements pour mettre à jour les trolls
  useNuiEvent('setTrolls', (data: TrollAction[]) => setTrolls(data));

  return <TrollsCtx.Provider value={{ trolls, setTrolls }}>{children}</TrollsCtx.Provider>;
};

export default TrollsProvider;

// Hook pour utiliser le contexte des trolls
export const useTrolls = () => useContext<TrollsContextValue>(TrollsCtx as Context<TrollsContextValue>);


type TranslateFunction = (label: string) => string;
export const Translator = (actions: TrollAction[], translate: TranslateFunction): TrollAction[] => {
  // Crée une copie de l'objet TrollAction pour éviter la mutation directe
  const translatedActions: TrollAction[] = [...actions];

  for (let translatedAction of translatedActions) {
    // Traduire le label de l'action si présent
    if (translatedAction.label) {
      translatedAction.label = translate(translatedAction.label);
    }

    // Parcourir les arguments de l'action et traduire les labels
    translatedAction.arguments = translatedAction.arguments.map((arg) => {
      // Crée une copie de l'argument pour éviter la mutation directe
      const translatedArg = { ...arg };

      // Traduire le label de l'argument si présent
      if (translatedArg.label) {
        translatedArg.label = translate(translatedArg.label);
      }

      // Si l'argument est de type 'select', traduire les labels des options
      if (translatedArg.type === 'select' && translatedArg.options) {
        translatedArg.options = translatedArg.options.map((option) => ({
          ...option,
          label: translate(option.label),
        }));
      }

      return translatedArg;
    });
  }

  return translatedActions;
};