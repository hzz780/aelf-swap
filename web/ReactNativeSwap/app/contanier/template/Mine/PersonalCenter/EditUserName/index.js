import React, {memo, useState} from 'react';
import {View} from 'react-native';
import {
  CommonHeader,
  Input,
  CommonButton,
  CommonToast,
} from '../../../../../components/template';
import styles from './styles';
import {TextL} from '../../../../../components/template/CommonText';
import i18n from 'i18n-js';
import {USERNAME_REG} from '../../../../../config/constant';
import {GStyle} from '../../../../../assets/theme';
const EditUserName = () => {
  const [name, setName] = useState('');
  const onPress = () => {
    if (USERNAME_REG.test(name)) {
    } else {
      CommonToast.fail(i18n.t('login.nameErr'));
    }
  };
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader
        title={i18n.t('mineModule.personalCenter.editUserName')}
        canBack
      />
      <Input
        style={styles.input}
        onChangeText={setName}
        placeholder={i18n.t('mineModule.personalCenter.userName')}
      />
      <TextL style={styles.tips}>
        {i18n.t('mineModule.personalCenter.userNameTip')}
      </TextL>
      <CommonButton title={i18n.t('determine')} onPress={onPress} />
    </View>
  );
};

export default memo(EditUserName);
