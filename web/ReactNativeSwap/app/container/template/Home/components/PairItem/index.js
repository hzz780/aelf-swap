import React, {memo} from 'react';
import {Touchable} from '../../../../../components/template';
import navigationService from '../../../../../utils/common/navigationService';
import styles from '../../styles';
import {TextM, TextS} from '../../../../../components/template/CommonText';
import {View} from 'react-native';
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
  return (
    <Touchable
      onPress={() =>
        navigationService.navigate('PairDetails', {pairData: item})
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
          {item.liquidityA} {item.symbolA}
        </SymbolText>
        <SymbolText>
          {item.liquidityB} {item.symbolB}
        </SymbolText>
      </View>
      <View style={styles.flexBox}>
        <TextS numberOfLines={1}>
          $ {swapUtils.USDdigits(item.volumeInPrice)}
        </TextS>
        <SymbolText margin>
          {item.volumeA} {item.symbolA}
        </SymbolText>
        <SymbolText>
          {item.volumeB} {item.symbolB}
        </SymbolText>
      </View>
    </Touchable>
  );
};

export default memo(PairItem);
