import React, {memo, useRef, useCallback, useEffect} from 'react';
import {View, BackHandler} from 'react-native';
import GStyle from '../../../../assets/theme/gStyle';
import {
  CommonHeader,
  CommonButton,
  MyQRCode,
} from '../../../../components/template';
import styles from './styles';
import {screenshots} from '../../../../utils/pages';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import userActions from '../../../../redux/userRedux';
import {useDispatch} from 'react-redux';
import {TextM, TextL} from '../../../../components/template/CommonText';
import {useStateToProps} from '../../../../utils/pages/hooks';
const GenerateQRCode = props => {
  const dispatch = useDispatch();
  const setSaveQRCode = useCallback(
    value => dispatch(userActions.setSaveQRCode(value)),
    [dispatch],
  );
  const {userName, keystore, payPw} = useStateToProps(base => {
    const {settings, user} = base;
    return {
      userName: user.userName,
      keystore: user.keystore,
      payPw: settings.payPw,
    };
  });
  const viewShot = useRef();
  const next = useCallback(async () => {
    const result = await screenshots(viewShot);
    if (result) {
      setSaveQRCode(true);
      if (payPw && payPw.length === 6) {
        navigationService.reset('Tab');
      } else {
        navigationService.navigate('SetTransactionPwd');
      }
    }
  }, [payPw, setSaveQRCode]);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);
  const rightOnPress = useCallback(() => {
    if (payPw && payPw.length === 6) {
      navigationService.reset('Tab');
    } else {
      navigationService.navigate('SetTransactionPwd');
    }
  }, [payPw]);
  const QRCodeValue = keystore ? JSON.stringify(keystore) : null;
  return (
    <View style={GStyle.container}>
      <CommonHeader
        style={styles.headerStyle}
        title={i18n.t('login.backupQRCode.title')}
        rightTitle={i18n.t('login.backupQRCode.later')}
        rightOnPress={rightOnPress}>
        <View style={styles.nameBox}>
          {/* <TextTitle style={styles.account}>
            {i18n.t('account')}:{userName}
          </TextTitle> */}
          {/* <TextL style={styles.address}>Address:{userInfo.address} </TextL> */}
        </View>
        <View ref={viewShot} style={styles.shotView}>
          <TextL style={styles.userNameStyle}>
            {i18n.t('mineModule.username')}:{userName}
          </TextL>
          <MyQRCode value={QRCodeValue} />
        </View>
        <CommonButton
          disabled={!QRCodeValue}
          style={styles.buttonBox}
          title={i18n.t('login.backupQRCode.saveQRCode')}
          onPress={next}
        />
        <TextM style={styles.tips}>{i18n.t('login.QRCodeTip')}</TextM>
      </CommonHeader>
    </View>
  );
};
export default memo(GenerateQRCode);
