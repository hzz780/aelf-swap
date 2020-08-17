import React, {memo} from 'react';
import {View} from 'react-native';
import {GStyle} from '../../../../assets/theme';
import {CommonHeader} from '../../../../components/template';
import MeLiquidity from '../../Transaction/MeLiquidity';

const MyLiquidity = () => {
  return (
    <View style={GStyle.container}>
      <CommonHeader title="My Liquidity" canBack />
      <MeLiquidity />
    </View>
  );
};

export default memo(MyLiquidity);
