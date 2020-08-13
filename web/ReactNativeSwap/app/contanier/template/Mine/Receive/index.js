import React, {memo, useRef} from 'react';
import {GStyle} from '../../../../assets/theme';
import {
  CommonHeader,
  MyQRCode,
  CommonButton,
} from '../../../../components/template';
import styles from './styles';
import {View} from 'react-native';
import {TextL, CopyText} from '../../../../components/template/CommonText';
import i18n from 'i18n-js';
import {screenshots} from '../../../../utils/pages';
import {useStateToProps} from '../../../../utils/pages/hooks';
const Receive = () => {
  const viewShot = useRef();
  const {address, keystore, userName} = useStateToProps(base => {
    const {user} = base;
    return {
      address: user.address,
      keystore: user.keystore,
      userName: user.userName,
    };
  });
  const QRCodeValue = keystore ? JSON.stringify(keystore) : null;
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('mineModule.collect')} canBack>
        <View style={styles.box}>
          <View style={styles.topBox}>
            <TextL style={styles.userNameStyle}>
              {i18n.t('mineModule.receive.qRCode')}
            </TextL>
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
              onPress={() => screenshots(viewShot)}
            />
          </View>
          <View style={styles.addressBox}>
            <CopyText copied={address}>
              {i18n.t('address')}: {address}
            </CopyText>
          </View>
        </View>
      </CommonHeader>
    </View>
  );
};

export default memo(Receive);
