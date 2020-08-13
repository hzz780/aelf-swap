import React, {memo, useMemo, useCallback} from 'react';
import {View} from 'react-native';
import {GStyle} from '../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  ActionSheet,
} from '../../../../components/template';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import settingsActions from '../../../../redux/settingsRedux';
import {useDispatch} from 'react-redux';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
import {useStateToProps} from '../../../../utils/pages/hooks';
const SecurityCenter = () => {
  const dispatch = useDispatch();
  const changeSecurityLock = useCallback(
    securityLock => dispatch(settingsActions.changeSecurityLock(securityLock)),
    [dispatch],
  );
  const {securityLock} = useStateToProps(base => {
    const {settings} = base;
    return {
      securityLock: settings.securityLock,
    };
  });
  const onValueChange = useCallback(
    value => {
      if (value) {
        ActionSheet.alert(
          i18n.t('securityLock.openVerification'),
          i18n.t('securityLock.openVerificationTip'),
          [
            {title: i18n.t('cancel'), type: 'cancel'},
            {
              title: i18n.t('determine'),
              onPress: () => {
                TransactionVerification.show(success => {
                  success && changeSecurityLock(value);
                });
              },
            },
          ],
        );
      } else {
        ActionSheet.alert(
          i18n.t('securityLock.downVerification'),
          i18n.t('securityLock.downVerificationTip'),
          [
            {title: i18n.t('cancel'), type: 'cancel'},
            {
              title: i18n.t('determine'),
              onPress: () => {
                TransactionVerification.show(success => {
                  success && changeSecurityLock(value);
                });
              },
            },
          ],
        );
      }
    },
    [changeSecurityLock],
  );
  const Components = useMemo(() => {
    return (
      <View style={GStyle.secondContainer}>
        <CommonHeader title={i18n.t('mineModule.securityCenterT')} canBack />
        <ListItem
          title={i18n.t('mineModule.securityCenter.paySettings')}
          onPress={() => navigationService.navigate('PaymentSettings')}
        />
        <ListItem
          title={i18n.t('securityLock.title')}
          switching
          disabled
          value={securityLock}
          onValueChange={onValueChange}
        />
      </View>
    );
  }, [onValueChange, securityLock]);
  return Components;
};

export default memo(SecurityCenter);
