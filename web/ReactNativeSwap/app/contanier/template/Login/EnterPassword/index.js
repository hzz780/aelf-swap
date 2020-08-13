import React, {memo, useCallback} from 'react';
import {View, Keyboard} from 'react-native';
import GStyle from '../../../../assets/theme/gStyle';
import {
  CommonHeader,
  CommonButton,
  Input,
  Touchable,
  CommonToast,
} from '../../../../components/template';
import i18n from 'i18n-js';
import {TextL, TextM} from '../../../../components/template/CommonText';
import styles from './styles';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import {PASSWORD_REG} from '../../../../config/constant';
import navigationService from '../../../../utils/common/navigationService';
import userActions from '../../../../redux/userRedux';
import {useDispatch} from 'react-redux';
import {sleep} from '../../../../utils/pages';
import aelfUtils from '../../../../utils/pages/aelfUtils';
const EnterPassword = props => {
  const dispatch = useDispatch();
  const [state, setState] = useSetState({
    pwd: '',
    pwdRule: false,
    loading,
    pwdErr: false,
  });
  const {payPw} = useStateToProps(base => {
    const {settings} = base;
    return {
      payPw: settings.payPw,
    };
  });
  const {pwd, loading, pwdErr} = state;
  const {params} = props.route;
  const onLoginSuccess = useCallback(
    data => dispatch(userActions.onLoginSuccess(data)),
    [dispatch],
  );
  const pwdBlur = useCallback(() => {
    if (!PASSWORD_REG.test(pwd)) {
      setState({pwdRule: true});
    } else {
      setState({pwdRule: false});
    }
  }, [setState, pwd]);
  const login = useCallback(async () => {
    Keyboard.dismiss();
    setState({pwdErr: false, loading: true, pwdRule: false});
    await sleep(500);
    try {
      const {privateKey} = aelfUtils.unlockKeystore(params, pwd);
      if (privateKey) {
        onLoginSuccess({
          address: params.address,
          keystore: params,
          userName: params.nickName,
          balance: 0,
          saveQRCode: true,
          privateKey,
        });
        CommonToast.success(i18n.t('loginSuccess'));
        if (payPw && payPw.length === 6) {
          navigationService.reset('Tab');
        } else {
          navigationService.reset([{name: 'Tab'}, {name: 'SetTransactionPwd'}]);
        }
        setState({loading: false});
      }
    } catch (error) {
      console.log(error, '======error');
      setState({pwdErr: true, loading: false});
    }
  }, [onLoginSuccess, params, payPw, pwd, setState]);
  const {pwdRule} = state;
  if (!params) {
    return null;
  }
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('login.enterPassword.title')} canBack />
      <Touchable
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}
        style={styles.container}>
        <TextL style={styles.nickNameStyles}>
          {i18n.t('login.enterPassword.enterAccountPwd', {
            userName: params.nickName,
          })}
        </TextL>
        <Input
          secureTextEntry={true}
          leftTitleBox={styles.leftTitleBox}
          leftTextStyle={styles.leftTextStyle}
          leftTitle={i18n.t('login.pwd')}
          onBlur={pwdBlur}
          onChangeText={value => setState({pwd: value})}
          placeholder={i18n.t('login.pleaseEnt')}
        />
        {pwdRule && (
          <TextM style={GStyle.pwTip}>{i18n.t('login.pwdFormatErr')}</TextM>
        )}
        {pwdErr && <TextM style={GStyle.pwTip}>{i18n.t('pwdErr')}</TextM>}
        <CommonButton
          loading={loading}
          onPress={login}
          style={styles.buttonStyles}
          title={i18n.t('login.login')}
        />
      </Touchable>
    </View>
  );
};
export default memo(EnterPassword);
