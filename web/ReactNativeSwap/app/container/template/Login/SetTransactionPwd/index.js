import React, {memo, useCallback, useEffect} from 'react';
import {
  CommonHeader,
  Password,
  CommonToast,
  ActionSheet,
} from '../../../../components/template';
import {View, Keyboard, StyleSheet, BackHandler} from 'react-native';
import {useSetState} from '../../../../utils/pages/hooks';
import {TextM} from '../../../../components/template/CommonText';
import {Colors, GStyle} from '../../../../assets/theme';
import {pTd} from '../../../../utils/common';
import * as LocalAuthentication from 'expo-local-authentication';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import {touchAuth} from '../../../../utils/pages';
import {useDispatch} from 'react-redux';
import settingsActions from '../../../../redux/settingsRedux';
const SetTransactionPwd = () => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  const dispatch = useDispatch();
  const changePayPw = useCallback(
    payPw => dispatch(settingsActions.changePayPw(payPw)),
    [dispatch],
  );
  const changeBiometrics = useCallback(
    biometrics => dispatch(settingsActions.changeBiometrics(biometrics)),
    [dispatch],
  );
  const [state, setState] = useSetState({
    tip: i18n.t('setPwd.setPwd1'),
    type: 'transactionPw',
    transactionPw: '',
    transactionPwConfirm: '',
  });
  const {type, transactionPw, tip} = state;
  const onChange = useCallback(
    (types, text) => {
      setState({[types]: text});
      switch (types) {
        case 'transactionPw':
          if (text.length === 6) {
            setState({
              type: 'transactionPwConfirm',
              tip: i18n.t('setPwd.setPwd2'),
            });
          }
          break;
        case 'transactionPwConfirm':
          if (text.length === 6 && text === transactionPw) {
            CommonToast.success(i18n.t('setSuccess'));
            changePayPw(text);
            setToken();
          } else if (text.length === 6 && text !== transactionPw) {
            CommonToast.fail(i18n.t('setPwd.pwdInconsistent'));
          }
          break;
      }
    },
    [setState, transactionPw, changePayPw, setToken],
  );
  const navigate = useCallback(
    value => {
      changeBiometrics(value);
      navigationService.navigate('Tab');
    },
    [changeBiometrics],
  );
  const setToken = useCallback(async () => {
    try {
      const results = await LocalAuthentication.hasHardwareAsync();
      if (results) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (enrolled) {
          Keyboard.dismiss();
          ActionSheet.alert(i18n.t('setBiometrics'), null, [
            {
              title: i18n.t('later'),
              type: 'cancel',
              onPress: () => {
                navigate(false);
              },
            },
            {
              title: i18n.t('determine'),
              onPress: () => {
                touchAuth()
                  .then(() => {
                    navigate(true);
                    CommonToast.success(i18n.t('setSuccess'));
                  })
                  .catch(() => {
                    navigate(false);
                    CommonToast.fail(i18n.t('setFail'));
                  });
              },
            },
          ]);
        } else {
          navigate(false);
        }
      } else {
        navigate(false);
      }
    } catch (error) {
      navigate(false);
    }
  }, [navigate]);
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('setPwd.title')} />
      <View style={styles.box}>
        <TextM style={{color: Colors.primaryColor}}>{tip}</TextM>
        <Password
          maxLength={6}
          key={type}
          style={GStyle.marginArg(pTd(50), 0, pTd(30), 0)}
          onChange={value => onChange(type, value)}
        />
      </View>
    </View>
  );
};
export default memo(SetTransactionPwd);
const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: pTd(100),
  },
});
