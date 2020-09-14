import i18n from 'i18n-js';
import React, {memo} from 'react';
import {CommonHeader} from '../../../../components/template';
import {ScrollView, View, StyleSheet} from 'react-native';
import {TextL, TextTitle} from '../../../../components/template/CommonText';
import privacyPolicy from '../config/privacyPolicy';
import {GStyle} from '../../../../assets/theme';
import {pTd} from '../../../../utils/common';
import {bottomBarHeigth} from '../../../../utils/common/device';
import {useStateToProps} from '../../../../utils/pages/hooks';
const PrivacyPolicy = () => {
  const {language} = useStateToProps(base => {
    const {settings} = base;
    return {
      language: settings.language,
    };
  });
  const terms = privacyPolicy[language || 'en'];
  return (
    <View style={GStyle.container}>
      <CommonHeader
        canBack
        title={i18n.t('mineModule.aboutUs.privacyPolicy')}
      />
      <ScrollView>
        <View style={styles.container}>
          <TextTitle style={styles.title}>{terms.title}</TextTitle>
          <TextL>{terms.details}</TextL>
        </View>
      </ScrollView>
    </View>
  );
};
export default memo(PrivacyPolicy);
const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
  },
  container: {
    paddingHorizontal: pTd(15),
    paddingBottom: pTd(30) + bottomBarHeigth,
  },
});
