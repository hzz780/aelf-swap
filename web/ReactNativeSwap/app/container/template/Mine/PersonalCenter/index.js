import React, {memo, useRef, useCallback} from 'react';
import {GStyle} from '../../../../assets/theme';
import {
  CommonHeader,
  MyQRCode,
  CommonButton,
} from '../../../../components/template';
import styles from './styles';
import {View} from 'react-native';
import {
  TextL,
  TextM,
  CopyText,
} from '../../../../components/template/CommonText';
import i18n from 'i18n-js';
import {screenshots} from '../../../../utils/pages';
import userActions from '../../../../redux/userRedux';
import {useDispatch} from 'react-redux';
import {useStateToProps} from '../../../../utils/pages/hooks';
const PersonalCenter = () => {
  const dispatch = useDispatch();
  const viewShot = useRef();
  const {address, userName, keystore} = useStateToProps(base => {
    const {user} = base;
    return {
      address: user.address,
      userName: user.userName,
      keystore: user.keystore,
    };
  });
  const setSaveQRCode = useCallback(
    value => dispatch(userActions.setSaveQRCode(value)),
    [dispatch],
  );
  const onSaveQRCode = useCallback(async () => {
    const result = await screenshots(viewShot);
    if (result) {
      setSaveQRCode(true);
    }
  }, [setSaveQRCode]);
  const QRCodeValue = keystore ? JSON.stringify(keystore) : null;

  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('mineModule.personalCenter.title')} canBack>
        <View style={styles.box}>
          <View style={styles.topBox}>
            <View ref={viewShot} style={styles.shotView}>
              <TextL style={styles.userNameStyle}>
                {i18n.t('mineModule.username')}:{userName}
              </TextL>
              <MyQRCode value={QRCodeValue} />
            </View>
            <CommonButton
              disabled={!QRCodeValue}
              style={styles.buttonStyle}
              title={i18n.t('login.backupQRCode.saveQRCode')}
              onPress={onSaveQRCode}
            />
            <View style={styles.addressBox}>
              <CopyText copied={address}>
                {i18n.t('address')}: {address}
              </CopyText>
              <TextM style={styles.addressTips}>
                {i18n.t('mineModule.personalCenter.qRCodeTip')}
              </TextM>
            </View>
          </View>
          {/* <ListItem
            style={styles.premium}
            title={i18n.t('mineModule.personalCenter.premiumAccount')}
          /> */}
          {/* <ListItem
            style={styles.authentication}
            title={i18n.t('mineModule.personalCenter.authentication')}
            subtitle={
              <Text>
                <Entypo name="circle-with-cross" />
                {i18n.t('mineModule.personalCenter.notCompleted')}
              </Text>
            }
            subtitleStyle={styles.subtitleStyle}
          />
          <View style={styles.tipsBox}>
            <TextM style={styles.tips}>
              {i18n.t('mineModule.personalCenter.authenticationTip')}
            </TextM>
          </View> */}
        </View>
      </CommonHeader>
    </View>
  );
};

export default memo(PersonalCenter);
