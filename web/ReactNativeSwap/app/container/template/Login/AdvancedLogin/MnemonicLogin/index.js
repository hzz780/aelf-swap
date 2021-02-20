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
import {useSetState} from '../../../../../utils/pages/hooks';
import {PASSWORD_REG, USERNAME_REG} from '../../../../../config/constant';
import {TextM} from '../../../../../components/template/CommonText';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import aelfUtils from '../../../../../utils/pages/aelfUtils';
import userActions from '../../../../../redux/userRedux';
import {useDispatch} from 'react-redux';
const MnemonicLogin = () => {
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
  const dispatch = useDispatch();
  const onRegistered = useCallback(
    (newWallet, pwd, userName, advanced) =>
      dispatch(userActions.onRegistered(newWallet, pwd, userName, advanced)),
    [dispatch],
  );
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
  const pwdConfirmBlur = useCallback(() => {
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
    Keyboard.dismiss();
    const {topInput, userName, pwd, pwdConfirm} = state;
    try {
      const newWallet = aelfUtils.getWalletByMnemonic(topInput.trim());
      if (
        newWallet &&
        USERNAME_REG.test(userName) &&
        pwdConfirm === pwd &&
        PASSWORD_REG.test(pwd)
      ) {
        onRegistered(newWallet, pwd, userName, true);
      } else {
        CommonToast.fail(i18n.t('login.advancedLogin.MnemonicTip'));
      }
    } catch (error) {
      console.log(error, '=======error');
      CommonToast.fail(i18n.t('login.advancedLogin.MnemonicTip'));
    }
  }, [onRegistered, state]);
  const {
    userNameRule,
    pwdRule,
    pwdConfirmRule,
    pwdDifferent,
    userName,
    pwdConfirm,
    pwd,
  } = state;
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
            maxLength={30}
            leftTitleBox={styles.leftTitleBox}
            leftTextStyle={styles.leftTextStyle}
            leftTitle={i18n.t('login.userName')}
            onBlur={userNameBlur}
            onChangeText={v => setState({userName: v})}
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
            onChangeText={v => setState({pwd: v})}
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
            onBlur={pwdConfirmBlur}
            onChangeText={v => setState({pwdConfirm: v})}
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
            disabled={
              !USERNAME_REG.test(userName) ||
              !PASSWORD_REG.test(pwd) ||
              !(pwdConfirm === pwd)
            }
            onPress={login}
            title={i18n.t('login.login')}
            style={styles.buttonStyles}
          />
        </View>
      </KeyboardAwareScrollView>
    </Touchable>
  );
};

export default memo(MnemonicLogin);
