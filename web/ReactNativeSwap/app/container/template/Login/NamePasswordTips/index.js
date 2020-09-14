import React, {memo} from 'react';
import {TextS} from '../../../../components/template/CommonText';
import {Colors} from '../../../../assets/theme';
import {pTd} from '../../../../utils/common';
import i18n from 'i18n-js';
import {View} from 'react-native';
const NamePasswordTips = () => {
  return (
    <View>
      <TextS style={{color: Colors.fontGray, marginTop: pTd(20)}}>
        *{i18n.t('login.usernameTips')}
      </TextS>
      <TextS style={{color: Colors.fontGray, marginTop: pTd(20)}}>
        *{i18n.t('login.pwdTips')}
      </TextS>
      <TextS style={{color: Colors.fontGray, marginTop: pTd(20)}}>
        *{i18n.t('login.pwdNotTips')}
      </TextS>
    </View>
  );
};

export default memo(NamePasswordTips);
