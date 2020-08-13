import React, {memo, useCallback, useEffect} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {GStyle, Colors} from '../../../assets/theme';
import {CommonHeader, Touchable} from '../../../components/template';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {pTd} from '../../../utils/common';
import {TextL} from '../../../components/template/CommonText';
import TransactionVerification from '../../../utils/pages/TransactionVerification';
import navigationService from '../../../utils/common/navigationService';
import i18n from 'i18n-js';
let timer;
const SecurityLock = () => {
  useEffect(() => {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      verification();
    }, 500);
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => {
      backHandler.remove();
      timer && clearTimeout(timer);
    };
  }, [verification]);
  const verification = useCallback(() => {
    TransactionVerification.show(
      value => value && navigationService.navigate('Tab'),
    );
  }, []);
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('securityLock.title')} />
      <View style={styles.container}>
        <Touchable onPress={verification} style={styles.touchBox}>
          <FontAwesome5
            name="user-lock"
            size={pTd(100)}
            color={Colors.fontColor}
          />
          <TextL style={styles.textStyle}>
            {i18n.t('securityLock.touchVerification')}
          </TextL>
        </Touchable>
      </View>
    </View>
  );
};

export default memo(SecurityLock);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    paddingTop: '50%',
  },
  textStyle: {
    marginTop: 15,
    color: Colors.fontColor,
  },
  touchBox: {
    alignItems: 'center',
  },
});
