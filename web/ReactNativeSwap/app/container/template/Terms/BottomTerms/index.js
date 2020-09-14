import React, {memo, useMemo} from 'react';
import i18n from 'i18n-js';
import {StyleSheet, View, Text} from 'react-native';
import {Colors} from '../../../../assets/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {pTd} from '../../../../utils/common';
import navigationService from '../../../../utils/common/navigationService';
const BottomTerms = props => {
  const {changeState, value} = props;
  const icon = value
    ? {
        color: Colors.fontColor,
        name: 'checkcircle',
      }
    : {
        color: Colors.fontGray,
        name: 'checkcircleo',
      };
  const Component = useMemo(() => {
    return (
      <View style={styles.container}>
        <AntDesign
          size={pTd(28)}
          onPress={changeState}
          style={styles.icon}
          {...icon}
        />
        <Text style={styles.text}>
          {i18n.t('terms.tips')}
          <Text
            onPress={() => navigationService.navigate('PrivacyPolicy')}
            style={styles.termsText}>
            {i18n.t('terms.privacyPolicy')}
          </Text>
          <Text
            onPress={() => navigationService.navigate('TermsService')}
            style={styles.termsText}>
            {i18n.t('terms.serviceAgreement')}
          </Text>
        </Text>
      </View>
    );
  }, [changeState, icon]);
  return Component;
};
export default memo(BottomTerms);
const styles = StyleSheet.create({
  icon: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  container: {
    paddingVertical: pTd(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: pTd(24),
    lineHeight: pTd(50),
  },
  termsText: {
    color: Colors.fontColor,
  },
});
