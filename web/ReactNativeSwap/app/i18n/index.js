// @flow
'use strict';
import i18n from 'i18n-js';
import moment from 'moment/moment';
import 'moment/locale/zh-cn';

import en from './languages/en.json';
import zh_cn from './languages/zh_cn.json';

//default language
i18n.defaultLocale = 'en';

i18n.translations = {
  en,
  'zh-cn': zh_cn,
};

i18n.switchLanguage = language => {
  i18n.locale = language;
  moment.locale(language);
};
