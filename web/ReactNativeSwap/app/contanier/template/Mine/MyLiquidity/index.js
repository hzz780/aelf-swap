import React, {memo} from 'react';
import {View} from 'react-native';
import {GStyle} from '../../../../assets/theme';
import {CommonHeader} from '../../../../components/template';
import MeLiquidity from '../../Transaction/MeLiquidity';
import i18n from 'i18n-js';
const MyLiquidity = () => {
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('swap.myLiquidity')} canBack />
      <MeLiquidity />
    </View>
  );
};

export default memo(MyLiquidity);
