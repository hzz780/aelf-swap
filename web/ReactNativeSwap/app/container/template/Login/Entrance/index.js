import React, {memo, useCallback, useEffect} from 'react';
import {launchScreen} from '../../../../assets/images';
import {View, ImageBackground} from 'react-native';
import {
  CommonButton,
  ActionSheet,
  CommonHeader,
} from '../../../../components/template';
import navigationService from '../../../../utils/common/navigationService';
import {TextL, TextM} from '../../../../components/template/CommonText';
import styles from './styles';
import i18n from 'i18n-js';
import Icon from 'react-native-vector-icons/AntDesign';
import {localLanguage} from '../../../../i18n/config';
import {useDispatch} from 'react-redux';
import settingsActions from '../../../../redux/settingsRedux';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {GStyle} from '../../../../assets/theme';
import {permissionDenied} from '../../../../utils/pages';
import {useStateToProps} from '../../../../utils/pages/hooks';
const Entrance = props => {
  const {addAccount} = props.route.params || {};
  const dispatch = useDispatch();
  const changeLanguage = useCallback(
    language => dispatch(settingsActions.changeLanguage(language)),
    [dispatch],
  );
  const {userList, address, canUse} = useStateToProps(base => {
    const {user, settings} = base;
    return {
      userList: user.userList,
      address: user.address,
      canUse: settings.canUse,
      language: settings.language,
    };
  });
  const onPress = useCallback(
    value => {
      changeLanguage(value.language);
    },
    [changeLanguage],
  );
  const items = localLanguage.map(item => ({
    ...item,
    onPress: onPress,
  }));
  const getLocation = useCallback(
    () => dispatch(settingsActions.getLocation()),
    [dispatch],
  );
  useEffect(() => {
    !address && getLocation();
  }, [address, getLocation]);
  const onLogin = useCallback(async () => {
    if (!canUse) {
      return ActionSheet.alert(
        i18n.t('permission.cannotTitle'),
        i18n.t('permission.cannotTip'),
        [{title: i18n.t('determine')}],
      );
    }
    const {status} = await BarCodeScanner.requestPermissionsAsync();
    if (status !== 'granted') {
      permissionDenied(
        i18n.t('permission.camera'),
        i18n.t('login.scanCodeLogin'),
      );
    } else {
      navigationService.navigate('QRCodeScan');
    }
  }, [canUse]);
  const onRegister = useCallback(() => {
    if (!canUse) {
      return ActionSheet.alert(
        i18n.t('permission.cannotTitle'),
        i18n.t('permission.cannotTip'),
        [{title: i18n.t('determine')}],
      );
    }
    navigationService.navigate('Registered');
  }, [canUse]);
  return (
    <View style={GStyle.container}>
      <ImageBackground
        resizeMode="contain"
        style={styles.bgStyle}
        source={launchScreen}>
        {addAccount ? (
          <CommonHeader
            title={i18n.t('login.addAccount')}
            headerStyle={styles.headerStyle}
            canBack
          />
        ) : (
          <View style={styles.topTool}>
            <TextL
              onPress={() => navigationService.reset('Tab')}
              style={styles.jLooking}>
              {i18n.t('login.jLook')}
            </TextL>
          </View>
        )}
        <View style={styles.container}>
          <View style={styles.BottomBox}>
            <CommonButton
              title={i18n.t('login.login')}
              style={styles.loginButton}
              onPress={onLogin}
            />
            <CommonButton
              title={i18n.t('login.register')}
              onPress={onRegister}
            />
            <View style={styles.premiumBox}>
              {/* <TextL
                onPress={() => navigationService.navigate('AdvancedLogin')}
                style={styles.premium}>
                {i18n.t('login.premiumTips')}
              </TextL> */}
              {userList && userList.length ? (
                <View style={styles.loginAccountBox}>
                  <TextL
                    onPress={() =>
                      navigationService.navigate('LoginAccountLogin')
                    }
                    style={styles.loginAccount}>
                    {i18n.t('login.loginAccountLoginTip')}
                  </TextL>
                </View>
              ) : null}
            </View>
            <TextM
              style={[styles.language, addAccount && styles.hideLanguage]}
              onPress={
                addAccount
                  ? null
                  : () => ActionSheet.show(items, {title: i18n.t('cancel')})
              }>
              {i18n.t('switchLanguage')}
              <Icon name="caretright" />
            </TextM>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
export default memo(Entrance);
