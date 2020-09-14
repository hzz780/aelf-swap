import React, {memo} from 'react';
import {Touchable} from '../../../../components/template';
import navigationService from '../../../../utils/common/navigationService';
import styles from '../styles';
import {TextM, TextS} from '../../../../components/template/CommonText';
import {View} from 'react-native';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useStateToProps} from '../../../../utils/pages/hooks';
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
const PairsItem = props => {
  const {tokenUSD} = useStateToProps(base => {
    const {settings, user} = base;
    return {
      language: settings.language,
      tokenUSD: user.tokenUSD,
    };
  });
  const {item} = props;
  const subtitle = swapUtils.getSwapUSD(item, tokenUSD);
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
        <TextS numberOfLines={1}>{subtitle}</TextS>
        <SymbolText margin>123 {item.symbolA}</SymbolText>
        <SymbolText>123 {item.symbolB}</SymbolText>
      </View>
      <View style={styles.flexBox}>
        <TextS numberOfLines={1}>{subtitle}</TextS>
        <SymbolText margin>123 {item.symbolA}</SymbolText>
        <SymbolText>123 {item.symbolB}</SymbolText>
      </View>
    </Touchable>
  );
};

export default memo(PairsItem);
