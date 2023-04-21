import i18n from 'i18next';
// 插件
import {initReactI18next} from 'react-i18next';
import {ReactNativeLanguageDetector} from 'react-native-localization-settings';

// 語言包
import en from './languages/enUS.json';
import zh from './languages/zhCN.json';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n
  .use(initReactI18next)
  .use(ReactNativeLanguageDetector)
  .init({
    compatibilityJSON: 'v3', // 对安卓进行兼容
    resources,
    debug: true,
    fallbackLng: 'zh', // 默认语言，也是设置语言时设置了不存在的语言时使用的
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
