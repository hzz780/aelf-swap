import React, {useCallback, memo} from 'react';
import {
  CommonHeader,
  Touchable,
  Input,
  CommonButton,
} from '../../../../components/template';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, Keyboard} from 'react-native';
import {GStyle} from '../../../../assets/theme';
import NamePasswordTips from '../NamePasswordTips';
import styles, {tabActiveColor} from './styles';
import i18n from 'i18n-js';
import {useSetState} from '../../../../utils/pages/hooks';
import {PASSWORD_REG, USERNAME_REG} from '../../../../config/constant';
import {TextM} from '../../../../components/template/CommonText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const Tab = createMaterialTopTabNavigator();
const PrivateKeyLogin = () => {
  const [state, setState] = useSetState({
    topInput: '',
    userName: '',
    pwd: '',
    pwdConfirm: '',
    pwdDifferent: false,
    userNameRule: false,
    pwdRule: false,
    pwdConfirmRule: false,
  });
  const userNameBlur = useCallback(() => {
    const {userName} = state;
    if (!USERNAME_REG.test(userName)) {
      setState({userNameRule: true});
    } else {
      setState({userNameRule: false});
    }
  }, [setState, state]);
  const pwdBlur = useCallback(() => {
    const {pwd, pwdConfirm} = state;
    if (!PASSWORD_REG.test(pwd)) {
      setState({pwdRule: true});
    } else {
      setState({pwdRule: false});
    }

    if (pwdConfirm && pwd && pwdConfirm !== pwd) {
      setState({pwdDifferent: true});
    } else if (pwdConfirm && pwd && pwdConfirm === pwd) {
      setState({pwdDifferent: false});
    }
  }, [setState, state]);
  const pwdComfirmBlur = useCallback(() => {
    const {pwdConfirm, pwd} = state;
    if (!PASSWORD_REG.test(pwdConfirm)) {
      setState({pwdConfirmRule: true});
    } else {
      setState({pwdConfirmRule: false});
    }

    if (pwdConfirm && pwd && pwd !== pwdConfirm) {
      setState({pwdDifferent: true});
    } else if (pwdConfirm && pwd && pwd === pwdConfirm) {
      setState({pwdDifferent: false});
    }
  }, [setState, state]);
  const login = useCallback(() => {
    // navigationService.reset('Tab');
  }, []);
  const {userNameRule, pwdRule, pwdConfirmRule, pwdDifferent} = state;
  return (
    <Touchable
      style={GStyle.container}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
        extraHeight={50}>
        <View style={styles.container}>
          <Input
            multiline={true}
            style={styles.input}
            onChangeText={topInput => setState({topInput})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          <Input
            leftTitleBox={styles.leftTitleBox}
            leftTextStyle={styles.leftTextStyle}
            leftTitle={i18n.t('login.userName')}
            onBlur={userNameBlur}
            onChangeText={userName => setState({userName})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          {userNameRule && (
            <TextM style={GStyle.pwTip}>{i18n.t('login.nameErr')}</TextM>
          )}
          <Input
            secureTextEntry={true}
            leftTitleBox={styles.leftTitleBox}
            leftTextStyle={styles.leftTextStyle}
            leftTitle={i18n.t('login.newPwd')}
            onBlur={pwdBlur}
            onChangeText={pwd => setState({pwd})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          {pwdRule && (
            <TextM style={GStyle.pwTip}>{i18n.t('login.pwdFormatErr')}</TextM>
          )}
          <Input
            secureTextEntry={true}
            leftTitleBox={[styles.leftTitleBox, {marginBottom: 10}]}
            leftTextStyle={styles.leftTextStyle}
            leftTitle={i18n.t('login.confirmPwd')}
            onBlur={pwdComfirmBlur}
            onChangeText={pwdConfirm => setState({pwdConfirm})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          {pwdConfirmRule && (
            <TextM style={GStyle.pwTip}>{i18n.t('login.pwdFormatErr')}</TextM>
          )}
          {pwdDifferent && (
            <TextM style={GStyle.pwTip}>{i18n.t('login.inconsistent')}</TextM>
          )}
          <NamePasswordTips />
          <CommonButton
            // disabled
            onPress={login}
            title={i18n.t('login.login')}
            style={styles.buttonStyles}
          />
        </View>
      </KeyboardAwareScrollView>
    </Touchable>
  );
};
const KeyStoreLogin = () => {
  const [state, setState] = useSetState({
    topInput: '',
    pwd: '',
    pwdRule: false,
  });
  const pwdBlur = useCallback(() => {
    const {pwd, pwdConfirm} = state;
    if (!PASSWORD_REG.test(pwd)) {
      setState({pwdRule: true});
    } else {
      setState({pwdRule: false});
    }

    if (pwdConfirm && pwd && pwdConfirm !== pwd) {
      setState({pwdDifferent: true});
    } else if (pwdConfirm && pwd && pwdConfirm === pwd) {
      setState({pwdDifferent: false});
    }
  }, [setState, state]);
  const login = useCallback(() => {
    // navigationService.reset('Tab');
  }, []);
  const {pwdRule} = state;
  return (
    <Touchable
      style={GStyle.container}
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardOpeningTime={0}
        extraHeight={50}>
        <View style={styles.container}>
          <Input
            multiline={true}
            style={styles.input}
            onChangeText={topInput => setState({topInput})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          <Input
            secureTextEntry={true}
            leftTitleBox={styles.leftTitleBox}
            leftTextStyle={styles.leftTextStyle}
            leftTitle={i18n.t('login.pwd')}
            onBlur={pwdBlur}
            onChangeText={pwd => setState({pwd})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          {pwdRule && (
            <TextM style={GStyle.pwTip}>{i18n.t('login.pwdFormatErr')}</TextM>
          )}
          <NamePasswordTips />
          <CommonButton
            // disabled
            onPress={login}
            title={i18n.t('login.login')}
            style={styles.buttonStyles}
          />
        </View>
      </KeyboardAwareScrollView>
    </Touchable>
  );
};
const AdvancedLogin = () => {
  const tabNav = [
    {
      name: 'PrivateKeyLogin',
      component: PrivateKeyLogin,
      options: {title: i18n.t('login.advancedLogin.PrivateKey')},
    },
    {
      name: 'KeyStoreLogin',
      component: KeyStoreLogin,
      options: {title: 'KeyStore'},
    },
  ];
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('login.advancedLogin.title')} canBack />
      <Tab.Navigator
        lazy={false}
        tabBarOptions={{
          allowFontScaling: false,
          upperCaseLabel: false,
          activeTintColor: 'white',
          inactiveTintColor: tabActiveColor,
          labelStyle: styles.labelStyle,
          indicatorStyle: styles.indicatorStyle,
          style: styles.style,
        }}>
        {tabNav.map((item, index) => {
          return <Tab.Screen key={index} {...item} />;
        })}
      </Tab.Navigator>
    </View>
  );
};
export default memo(AdvancedLogin);
