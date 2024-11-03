import { isEnvBrowser } from "./misc";
import { RegisterLocale } from '@/utils/Locale'

interface DebugEvent<T = any> {
  action: string;
  data: T;
}

/**
 * Emulates dispatching an event using SendNuiMessage in the lua scripts.
 * This is used when developing in browser
 *
 * @param events - The event you want to cover
 * @param timer - How long until it should trigger (ms)
 */
export const debugData = <P>(events: DebugEvent<P>[], timer = 1000): void => {
  if (process.env.NODE_ENV === "development" && isEnvBrowser()) {
    for (const event of events) {
      setTimeout(() => {
        window.dispatchEvent(
          new MessageEvent("message", {
            data: {
              action: event.action,
              data: event.data,
            },
          })
        );
      }, timer);
    }
  }
};

export function DebugImportLangFiles() {
  const langFiles: Record<string, Function> = {
    en: () => import('@/../../locales/en.json'),
    fr: () => import('@/../../locales/fr.json'),
    de: () => import('@/../../locales/de.json'),
    pt: () => import('@/../../locales/pt.json'),
  };
  return Promise.all(["en", "fr", "de", "pt"].map((code) => {
    return langFiles[code]().then((file: any) => RegisterLocale(code, file.default || file));
  }));
}
