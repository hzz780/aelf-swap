import Spinner from 'react-native-spinkit';
import {ImageBackground, View} from 'react-native';
import * as Localization from 'expo-localization';
import React, {useEffect, useCallback, memo} from 'react';
import {useDispatch} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {pTd} from '../../../utils/common';
import {languageList} from '../../../i18n/config';
import {launchScreen} from '../../../assets/images';
import settingsActions from '../../../redux/settingsRedux';
import navigationService from '../../../utils/common/navigationService';
import {Colors, GStyle} from '../../../assets/theme';
import {useStateToProps} from '../../../utils/pages/hooks';
import {statusBarHeight, isIos} from '../../../utils/common/device';

const style = {
  flex: 1,
  marginTop: isIos ? 0 : statusBarHeight,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column-reverse',
  paddingTop: pTd(500),
};
const time = 2000;
const Referral = () => {
  const dispatch = useDispatch();
  const changeLanguage = useCallback(
    language => dispatch(settingsActions.changeLanguage(language)),
    [dispatch],
  );
  const {address, securityLock, language} = useStateToProps(state => {
    const {user, settings} = state;
    return {
      address: user.address,
      securityLock: settings.securityLock,
      language: settings.language,
    };
  });
  useEffect(() => {
    SplashScreen.hide();
    if (language) {
      if (languageList.includes(language)) {
        changeLanguage(language);
      }
    } else {
      const languages = Localization.locale;
      let localLanguages = languages;
      if (Array.isArray(languages)) {
        localLanguages = languages[0];
      }
      //The local language may be en-xxx or zh-xxx, we intercept the first two to match
      localLanguages = localLanguages.slice(0, 2);
      if (localLanguages === 'zh') {
        localLanguages = 'zh-cn';
      }
      if (languageList.includes(localLanguages)) {
        changeLanguage(localLanguages);
      }
    }
    const timer = setTimeout(() => {
      if (address) {
        navigationService.reset(
          securityLock ? [{name: 'Tab'}, {name: 'SecurityLock'}] : 'Tab',
        );
      } else {
        navigationService.reset('Entrance');
      }
    }, time);
    return () => {
      timer && clearTimeout(timer);
    };
  }, [changeLanguage, language, securityLock, address]);
  return (
    <View style={GStyle.container}>
      <ImageBackground style={style} source={launchScreen}>
        <Spinner type={'Circle'} color={Colors.primaryColor} size={60} />
      </ImageBackground>
    </View>
  );
};
export default memo(Referral);
