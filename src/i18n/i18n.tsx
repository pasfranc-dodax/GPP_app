import I18n from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en';
import fr from './fr';

const locales = RNLocalize.getLocales();

async function setLocale() {
  const lang = await AsyncStorage.getItem('lang');
  if (lang) {
    I18n.locale = lang;
  } else {
    if (Array.isArray(locales)) {
      I18n.locale = locales[0].languageTag;
      AsyncStorage.setItem('lang', locales[0].languageTag);
    }
  }
}

setLocale();
I18n.fallbacks = false;
I18n.translations = {
  default: en,
  'en-US': en,
  en,
  fr,
};

export default I18n;
