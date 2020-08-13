import React, {memo, useCallback, useEffect} from 'react';
import {
  CommonHeader,
  Touchable,
  Input,
  CommonButton,
  CommonToast,
} from '../../../../components/template';
import i18n from 'i18n-js';
import {useSetState} from '../../../../utils/pages/hooks';
import {View, Keyboard} from 'react-native';
import GStyle from '../../../../assets/theme/gStyle';
import styles from './styles';
import {TextM} from '../../../../components/template/CommonText';
import {PASSWORD_REG, USERNAME_REG} from '../../../../config/constant';
import NamePasswordTips from '../NamePasswordTips';
import userActions from '../../../../redux/userRedux';
import AElf from 'aelf-sdk';
import {useDispatch} from 'react-redux';
import BottomTerms from '../../Terms/BottomTerms';
const Registered = () => {
  const dispatch = useDispatch();
  const [state, setState] = useSetState({
    userName: '',
    pwd: '',
    pwdConfirm: '',
    pwdDifferent: false,
    userNameRule: false,
    pwdRule: false,
    pwdConfirmRule: false,
    newWallet: null,
    agree: false,
  });
  const onRegistered = useCallback(
    (newWallet, pwd, userName) =>
      dispatch(userActions.onRegistered(newWallet, pwd, userName)),
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
  const registered = useCallback(() => {
    Keyboard.dismiss();
    const {userName, pwd, newWallet, pwdConfirm, agree} = state;
    if (
      USERNAME_REG.test(userName) &&
      pwdConfirm === pwd &&
      PASSWORD_REG.test(pwd) &&
      agree
    ) {
      onRegistered(newWallet, pwd, userName);
    } else {
      CommonToast.fail('fail');
    }
  }, [onRegistered, state]);
  const generateKeystore = useCallback(async () => {
    let newWallet;
    try {
      newWallet = AElf.wallet.createNewWallet();
    } catch (error) {
      console.error(error);
    }
    setState({newWallet});
  }, [setState]);
  useEffect(() => {
    generateKeystore();
  }, [generateKeystore]);
  const {
    userNameRule,
    pwdRule,
    pwdConfirmRule,
    pwdDifferent,
    userName,
    pwdConfirm,
    pwd,
    agree,
  } = state;
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('login.register')} canBack>
        <Touchable
          style={styles.container}
          activeOpacity={1}
          onPress={() => Keyboard.dismiss()}>
          <Input
            leftTitleBox={styles.leftTitleBox}
            leftTextStyle={styles.leftTextStyle}
            leftTitle={i18n.t('login.userName')}
            onBlur={userNameBlur}
            onChangeText={value => setState({userName: value})}
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
            onChangeText={value => setState({pwd: value})}
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
            onChangeText={value => setState({pwdConfirm: value})}
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
              !agree ||
              !USERNAME_REG.test(userName) ||
              !PASSWORD_REG.test(pwd) ||
              !pwdConfirm === pwd
            }
            onPress={registered}
            title={i18n.t('login.register')}
            style={styles.buttonStyles}
          />
          <BottomTerms
            value={agree}
            changeState={() => setState({agree: !agree})}
          />
        </Touchable>
      </CommonHeader>
    </View>
  );
};

export default memo(Registered);
