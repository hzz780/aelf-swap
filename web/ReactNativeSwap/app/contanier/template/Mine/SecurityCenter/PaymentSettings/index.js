import React, {memo, useMemo, useCallback} from 'react';
import {View} from 'react-native';
import {GStyle} from '../../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  ActionSheet,
  CommonToast,
  VerifyPassword,
} from '../../../../../components/template';
import navigationService from '../../../../../utils/common/navigationService';
import settingsActions from '../../../../../redux/settingsRedux';
import {useDispatch} from 'react-redux';
import * as LocalAuthentication from 'expo-local-authentication';
import {touchAuth} from '../../../../../utils/pages';
import i18n from 'i18n-js';
import {useStateToProps} from '../../../../../utils/pages/hooks';
const PaymentSettings = () => {
  const dispatch = useDispatch();
  const changeBiometrics = useCallback(
    biometrics => dispatch(settingsActions.changeBiometrics(biometrics)),
    [dispatch],
  );
  const {biometrics} = useStateToProps(base => {
    const {settings} = base;
    return {
      biometrics: settings.biometrics,
    };
  });
  const onValueChange = useCallback(
    async value => {
      if (value) {
        const results = await LocalAuthentication.hasHardwareAsync();
        if (!results) {
          return CommonToast.text(
            i18n.t('mineModule.securityCenter.notSupportTip'),
          );
        }
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (!enrolled) {
          return CommonToast.text(
            i18n.t('mineModule.securityCenter.unsavedTip'),
          );
        }
        VerifyPassword.payShow(success => {
          success &&
            touchAuth()
              .then(() => {
                changeBiometrics(value);
                CommonToast.success(i18n.t('setSuccess'));
              })
              .catch(() => {
                changeBiometrics(!value);
                CommonToast.fail(i18n.t('setFail'));
              });
        });
      } else {
        ActionSheet.alert(
          i18n.t('mineModule.securityCenter.turnOffBiometrics'),
          i18n.t('mineModule.securityCenter.turnOffBiometricsTip'),
          [
            {title: i18n.t('cancel'), type: 'cancel'},
            {
              title: i18n.t('determine'),
              onPress: () => changeBiometrics(value),
            },
          ],
        );
      }
    },
    [changeBiometrics],
  );
  const Components = useMemo(() => {
    return (
      <View style={GStyle.secondContainer}>
        <CommonHeader
          title={i18n.t('mineModule.securityCenter.paySettings')}
          canBack
        />
        <ListItem
          title={i18n.t('mineModule.securityCenter.changePayPwd')}
          onPress={() => navigationService.navigate('ChangePaymentPwd')}
        />
        <ListItem
          disabled
          title={i18n.t('mineModule.securityCenter.biometrics')}
          switching
          onValueChange={onValueChange}
          value={biometrics}
        />
      </View>
    );
  }, [biometrics, onValueChange]);
  return Components;
};

export default memo(PaymentSettings);
