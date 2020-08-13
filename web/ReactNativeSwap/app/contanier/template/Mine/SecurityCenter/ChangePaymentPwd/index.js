import React, {memo, useMemo, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../../assets/theme';
import {
  CommonHeader,
  ActionSheet,
  CommonButton,
} from '../../../../../components/template';
import {TextL} from '../../../../../components/template/CommonText';
import Spinner from 'react-native-spinkit';
import {pTd} from '../../../../../utils/common';
import navigationService from '../../../../../utils/common/navigationService';
import {isIos} from '../../../../../utils/common/device';
import i18n from 'i18n-js';
import {useFocusEffect} from '@react-navigation/native';
import {useStateToProps} from '../../../../../utils/pages/hooks';
const ChangePaymentPwd = () => {
  const [safety, setSafety] = useState(null);
  const {userName, payPw} = useStateToProps(base => {
    const {settings, user} = base;
    return {
      userName: user.userName,
      payPw: settings.payPw,
    };
  });
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        if (true) {
          if (payPw && payPw.length === 6) {
            setSafety(true);
          } else {
            navigationService.navigate('SecondChangePaymentPwd', {
              remember: false,
            });
          }
        } else {
          setSafety(false);
          ActionSheet.alert(
            i18n.t('mineModule.securityCenter.nonCompliant'),
            null,
            [
              {
                title: i18n.t('mineModule.securityCenter.out'),
                onPress: () => navigationService.goBack(),
              },
              {
                title: i18n.t('mineModule.securityCenter.recheck'),
                onPress: () => {},
              },
            ],
          );
        }
      }, 1000);
      return () => {
        timer && clearTimeout(timer);
      };
    }, [payPw]),
  );
  const Components = useMemo(() => {
    if (safety === null) {
      return (
        <View style={styles.checkingBox}>
          <TextL>{i18n.t('mineModule.securityCenter.safetyTesting')}</TextL>
          <Spinner
            type={'ThreeBounce'}
            color={'#000000'}
            size={pTd(40)}
            style={styles.spinnerStyle}
          />
        </View>
      );
    }
    if (safety === false) {
      return null;
    }
    if (safety === true) {
      return (
        <View style={GStyle.container}>
          <TextL style={styles.tips}>
            {i18n.t('mineModule.securityCenter.ask', {userName})}
          </TextL>
          <View style={styles.buttonBox}>
            <CommonButton
              title={i18n.t('mineModule.securityCenter.noRemember')}
              style={styles.notButtonStyle}
              onPress={() => {
                navigationService.navigate('SecondChangePaymentPwd', {
                  remember: false,
                });
              }}
            />
            <CommonButton
              title={i18n.t('mineModule.securityCenter.remember')}
              style={styles.buttonStyle}
              onPress={() => {
                navigationService.navigate('SecondChangePaymentPwd', {
                  remember: true,
                });
              }}
            />
          </View>
        </View>
      );
    }
  }, [safety, userName]);
  return (
    <View style={GStyle.container}>
      <CommonHeader
        title={i18n.t('mineModule.securityCenter.changePayPwd')}
        canBack
      />
      <View style={styles.container}>{Components}</View>
    </View>
  );
};

export default memo(ChangePaymentPwd);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinnerStyle: {
    marginLeft: 3,
    marginBottom: isIos ? pTd(10) : 0,
    alignSelf: 'center',
  },
  tips: {
    textAlign: 'center',
    margin: pTd(80),
    marginHorizontal: pTd(100),
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonStyle: {
    width: '40%',
  },
  notButtonStyle: {
    width: '40%',
    backgroundColor: Colors.disabledColor,
  },
});
