import React, {memo} from 'react';
import {Touchable} from '../../../../../components/template';
import navigationService from '../../../../../utils/common/navigationService';
import {TextM, TextS} from '../../../../../components/template/CommonText';
import {StyleSheet, View} from 'react-native';
import swapUtils from '../../../../../utils/pages/swapUtils';
const SymbolText = memo(props => {
  const {children, margin} = props;
  return (
    <TextS
      ellipsizeMode="middle"
      style={margin ? styles.marginGray : styles.colorGray}
      numberOfLines={1}>
      {children}
    </TextS>
  );
});
const PairItem = props => {
  const {item} = props;
  if (!item) {
    return;
  }
  let sA = item.symbolA,
    sB = item.symbolB;
  if ((!sA || !sB) && typeof item.symbolPair === 'string') {
    const sStr = item.symbolPair.split('-');
    sA = sStr[0];
    sB = sStr[1];
  }
  console.log(item, '======item');
  return (
    <Touchable
      onPress={() =>
        navigationService.navigate('PairDetails', {
          pairData: {
            symbolA: sA,
            symbolB: sB,
            reserveA: item.liquidityA,
            reserveB: item.liquidityB,
            ...item,
          },
        })
      }
      style={styles.listItemBox}>
      <TextM numberOfLines={1} style={styles.titleStyle}>
        {item.symbolPair}
      </TextM>
      <View style={styles.flexBox}>
        <TextS numberOfLines={1}>
          $ {swapUtils.USDdigits(item.liquidityInPrice)}
        </TextS>
        <SymbolText margin>
          {item.liquidityA} {sA}
        </SymbolText>
        <SymbolText>
          {item.liquidityB} {sB}
        </SymbolText>
      </View>
      <View style={styles.flexBox}>
        <TextS numberOfLines={1}>
          $ {swapUtils.USDdigits(item.volumeInPrice)}
        </TextS>
        <SymbolText margin>
          {item.volumeA || '0'} {sA}
        </SymbolText>
        <SymbolText>
          {item.volumeB || '0'} {sB}
        </SymbolText>
      </View>
    </Touchable>
  );
};

export default memo(PairItem);

const styles = StyleSheet.create({
  titleStyle: {
    flex: 1,
    color: Colors.primaryColor,
  },
  listItemBox: {
    paddingHorizontal: pTd(30),
    paddingVertical: pTd(20),
    flexDirection: 'row',
    backgroundColor: Colors.bgColor2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  flexBox: {
    flex: 1,
    marginLeft: pTd(10),
  },
  marginGray: {
    marginTop: pTd(10),
    color: Colors.fontGray,
  },
  colorGray: {
    color: Colors.fontGray,
  },
});
