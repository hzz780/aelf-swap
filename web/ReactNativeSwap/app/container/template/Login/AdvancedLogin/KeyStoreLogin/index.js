import React, {useCallback, memo} from 'react';
import {
  Touchable,
  Input,
  CommonButton,
  CommonToast,
} from '../../../../../components/template';
import {View, Keyboard} from 'react-native';
import {GStyle} from '../../../../../assets/theme';
import NamePasswordTips from '../../NamePasswordTips';
import styles from '../styles';
import i18n from 'i18n-js';
import {useSetState, useStateToProps} from '../../../../../utils/pages/hooks';
import {PASSWORD_REG} from '../../../../../config/constant';
import {TextM} from '../../../../../components/template/CommonText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import aelfUtils from '../../../../../utils/pages/aelfUtils';
import userActions from '../../../../../redux/userRedux';
import {useDispatch} from 'react-redux';
import navigationService from '../../../../../utils/common/navigationService';
import {sleep} from '../../../../../utils/pages';
const KeyStoreLogin = () => {
  const [state, setState] = useSetState({
    topInput: '',
    pwd: '',
    pwdRule: false,
    loading: false,
  });
  const {payPw} = useStateToProps(base => {
    const {settings} = base;
    return {
      payPw: settings.payPw,
    };
  });
  const dispatch = useDispatch();
  const onLoginSuccess = useCallback(
    data => dispatch(userActions.onLoginSuccess(data)),
    [dispatch],
  );
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
  const login = useCallback(async () => {
    const {topInput, pwd} = state;
    setState({loading: true});
    await sleep(500);
    try {
      const keystore = JSON.parse(topInput);
      const {address, privateKey, nickName} = aelfUtils.unlockKeystore(
        keystore,
        pwd,
      );
      onLoginSuccess({
        address: address,
        keystore,
        userName: nickName || aelfUtils.formatAddress(address),
        balance: 0,
        saveQRCode: false,
        privateKey,
      });
      CommonToast.success(i18n.t('loginSuccess'));
      if (payPw && payPw.length === 6) {
        navigationService.reset('Tab');
      } else {
        navigationService.reset([{name: 'Tab'}, {name: 'SetTransactionPwd'}]);
      }
      setState({loading: false});
    } catch (error) {
      console.log(error, '======error');
      CommonToast.fail(i18n.t('login.advancedLogin.KeyStore'));
      setState({loading: false});
    }
    // navigationService.reset('Tab');
  }, [onLoginSuccess, payPw, setState, state]);
  const {pwdRule, loading, topInput, pwd} = state;
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
            onChangeText={v => setState({topInput: v})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          <Input
            secureTextEntry={true}
            leftTitleBox={styles.leftTitleBox}
            leftTextStyle={styles.leftTextStyle}
            leftTitle={i18n.t('login.pwd')}
            onBlur={pwdBlur}
            onChangeText={v => setState({pwd: v})}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          {pwdRule && (
            <TextM style={GStyle.pwTip}>{i18n.t('login.pwdFormatErr')}</TextM>
          )}
          <NamePasswordTips />
          <CommonButton
            disabled={!pwd || !topInput}
            loading={loading}
            onPress={login}
            title={i18n.t('login.login')}
            style={styles.buttonStyles}
          />
        </View>
      </KeyboardAwareScrollView>
    </Touchable>
  );
};

export default memo(KeyStoreLogin);
