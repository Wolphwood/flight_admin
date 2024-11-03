// Typage des locales et du contexte
type Locale = Record<string, string | string[]>;
type Locales = Record<string, Locale>;

type TranslationOptions = {
  lang?: string;
  AllowArray?: boolean;
  default?: string;
}
type TranslationArguments = undefined | null | (string | number)[]

let LANGS: Locales = {};
let default_lang: string = 'fr';
let current_locale: string = default_lang;

function GetDefaultLang() {
  return default_lang;
}
function GetCurrentLang() {
  return current_locale;
}
function SetCurrentLang(lang: string) {
  return current_locale = lang;
}

function RegisterLocale(code: string, locale: Locale) { // ⚠ Will override existings keys
  LANGS[code] = Object.assign(
    LANGS[code] ?? {},
    locale ?? {}
  )
}

function GetRawLocale(key: string, options: TranslationOptions = {}) {
  if (!LANGS[options.lang ?? current_locale]) return null;
  if (!LANGS[options.lang ?? current_locale][key]) return null;

  let value = LANGS[options.lang ?? current_locale][key];

  if (Array.isArray(value)) {
    if (options.AllowArray === true) {
      return LANGS[options.lang ?? current_locale][key];
    } else {
      let list = LANGS[options.lang ?? current_locale][key];
      return list[Math.floor(Math.random() * list.length)];
    }
  }

  return LANGS[current_locale][key];
}

function FormatString(string: string, args: TranslationArguments = []) {
  if (typeof args === 'undefined' || args == null) return string;
  if (!Array.isArray(args)) args = [ args ];
  if (args.length === 0) return string;

  let index = 0;
  return string.replace(/\%([asdifuxX])/g, (match: string, specifier: string): string => {
    // Typage explicite de `value` comme `string | number`
    let value: string | number = (args ?? [])[index++] ?? 'Null';

    switch (specifier) {
      // Any type
      case 'a':
        return String(value);  // Convertir en string pour uniformiser le type de retour
      
      // String
      case 's':
        return String(value);
      
      // Integer (signed)
      case 'd':
      case 'i':
        return String(parseInt(String(value)));
      
      // Floating-point
      case 'f':
        return parseFloat(String(value)).toFixed(2);
      
      // Unsigned integer
      case 'u':
        return String(Math.abs(parseInt(String(value))));
      
      // Hexadecimal lowercase
      case 'x':
        return parseInt(String(value)).toString(16);
      
      // Hexadecimal uppercase
      case 'X':
        return parseInt(String(value)).toString(16).toUpperCase();
      
      default:
        return match;
    }
});
}

function GetLocale(key: string, args: TranslationArguments = [], options: TranslationOptions = {}) {
  if (!LANGS[options.lang ?? current_locale]) return options.default ?? key;
  if (!LANGS[options.lang ?? current_locale][key]) return options.default ?? key;

  let value = GetRawLocale(key, options) ?? GetRawLocale(key.toLowerCase(), Object.assign({}, options, { lang: default_lang }));
  if (!value) return options.default ?? key;

  if (Array.isArray(value)) {
    return value.map(s => FormatString(s, args));
  } else {
    return FormatString(value, args);
  }
}

function GetForcedStringLocale(key: string, args: TranslationArguments = [], options: TranslationOptions = {}) {
  let result = GetLocale(key, args, options);
  return Array.isArray(result) ? result.join(' ') : result;
}

const _getLangs = (k: string) => k ? LANGS[k] : LANGS;


export { GetDefaultLang, GetCurrentLang, SetCurrentLang, RegisterLocale, GetRawLocale, GetLocale, GetForcedStringLocale, FormatString, _getLangs }