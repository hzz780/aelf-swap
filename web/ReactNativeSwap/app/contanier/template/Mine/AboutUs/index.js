import React, {memo, useMemo} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {CommonHeader, ListItem} from '../../../../components/template';
import i18n from 'i18n-js';
import {pTd} from '../../../../utils/common';
import {aelfLogo} from '../../../../assets/images';
import {TextL} from '../../../../components/template/CommonText';
import Constants from 'expo-constants';
import navigationService from '../../../../utils/common/navigationService';
const AboutUs = () => {
  const Components = useMemo(() => {
    return (
      <View style={GStyle.secondContainer}>
        <CommonHeader title={i18n.t('mineModule.aboutUsT')} canBack />
        <View style={styles.logoBox}>
          <Image
            resizeMode="contain"
            source={aelfLogo}
            style={styles.logoStyle}
          />
          <TextL>
            {i18n.t('mineModule.version', {
              number: Constants.nativeAppVersion,
            })}
          </TextL>
        </View>
        <ListItem title={i18n.t('mineModule.aboutUs.CheckUpdates')} />
        <ListItem
          title={i18n.t('mineModule.aboutUs.versionLog')}
          style={styles.itemBox}
        />
        <View style={styles.segmentation} />
        <ListItem
          onPress={() => navigationService.navigate('TermsService')}
          title={i18n.t('mineModule.aboutUs.serviceAgreement')}
        />
        <ListItem
          onPress={() => navigationService.navigate('PrivacyPolicy')}
          title={i18n.t('mineModule.aboutUs.privacyPolicy')}
        />
      </View>
    );
  }, []);
  return Components;
};

export default memo(AboutUs);
const styles = StyleSheet.create({
  logoBox: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pTd(50),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  logoStyle: {
    width: '50%',
    marginBottom: pTd(20),
  },
  itemBox: {
    marginBottom: pTd(20),
    borderBottomWidth: 0,
  },
});
