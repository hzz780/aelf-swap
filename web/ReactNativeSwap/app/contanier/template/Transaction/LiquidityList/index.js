import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {CommonButton} from '../../../../components/template';
import {TextL} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import MeLiquidity from '../MeLiquidity';
import navigationService from '../../../../utils/common/navigationService';
const LiquidityList = () => {
  return (
    <View style={GStyle.container}>
      <CommonButton
        onPress={() => navigationService.navigate('AddLiquidity')}
        title="Add Liquidity"
        style={styles.buttonStyles}
      />
      <View style={styles.titleBox}>
        <TextL>My Liquidity</TextL>
      </View>
      <MeLiquidity />
    </View>
  );
};

export default memo(LiquidityList);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: pTd(30),
  },
  buttonStyles: {
    marginTop: pTd(30),
  },
  titleBox: {
    marginTop: pTd(20),
    paddingVertical: pTd(20),
    marginHorizontal: pTd(30),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
});
