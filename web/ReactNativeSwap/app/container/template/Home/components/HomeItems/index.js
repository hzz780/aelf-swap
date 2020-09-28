import React, {memo} from 'react';
import {Touchable} from '../../../../../components/template';
import navigationService from '../../../../../utils/common/navigationService';
import {TextM, TextS} from '../../../../../components/template/CommonText';
import {StyleSheet, View} from 'react-native';
import swapUtils from '../../../../../utils/pages/swapUtils';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import aelfUtils from '../../../../../utils/pages/aelfUtils';
const SymbolText = memo(props => {
  const {children, margin, style} = props;
  return (
    <TextS
      ellipsizeMode="middle"
      style={[margin ? styles.marginGray : styles.colorGray, style]}
      numberOfLines={1}>
      {children}
    </TextS>
  );
});
const PairsItem = memo(props => {
  const {tokenUSD} = useStateToProps(base => {
    const {settings, user} = base;
    return {
      language: settings.language,
      tokenUSD: user.tokenUSD,
    };
  });
  const {item} = props;
  const subtitle = swapUtils.getSwapUSD(item, tokenUSD);
  const {symbolA, symbolB, reserveA, reserveB, symbolPair} = item || {};
  return (
    <Touchable
      onPress={() =>
        navigationService.navigate('PairDetails', {pairData: item})
      }
      style={styles.listItemBox}>
      <TextM numberOfLines={1} style={styles.titleStyle}>
        {symbolPair}
      </TextM>
      <View style={styles.NFlexBox}>
        <TextS numberOfLines={1}>{subtitle}</TextS>
        <SymbolText margin>
          {reserveA} {symbolA}
        </SymbolText>
        <SymbolText>
          {reserveB} {symbolB}
        </SymbolText>
      </View>
      {/* <View style={styles.flexBox}>
        <TextS numberOfLines={1}>{subtitle}</TextS>
        <SymbolText margin>
          {reserveA} {symbolA}
        </SymbolText>
        <SymbolText>
          {reserveB} {symbolB}
        </SymbolText>
      </View> */}
    </Touchable>
  );
});
const TokensItem = memo(props => {
  const {item} = props;
  const {symbol, liquidityInPrice, price, priceRate} = item || {};
  const {color, sign} = swapUtils.getRateStyle(priceRate);
  return (
    <Touchable
      onPress={() => navigationService.navigate('TokenDetails', {symbol})}
      style={styles.listItem2Box}>
      <TextM numberOfLines={1} style={[styles.titleStyle]}>
        {symbol}
      </TextM>
      <TextS
        style={[styles.tokenTopSubtitle, styles.flexBox]}
        numberOfLines={1}>
        ${swapUtils.USDdigits(liquidityInPrice)}
      </TextS>
      <TextS
        style={[styles.tokenTopSubtitle, styles.flexBox]}
        numberOfLines={1}>
        ${swapUtils.USDdigits(price)}
      </TextS>
      <TextS
        style={[styles.tokenTopSubtitle, styles.flexBox, {color}]}
        numberOfLines={1}>
        {sign + swapUtils.getPercentage(priceRate)}
      </TextS>
    </Touchable>
  );
});
const AccountsItem = memo(props => {
  const {item} = props;
  const {address, totalBalanceInPrice} = item || {};
  return (
    <Touchable
      onPress={() => navigationService.navigate('AccountDetails', {address})}
      style={styles.listItem2Box}>
      <SymbolText style={[styles.titleStyle, styles.accountTitleStyle]}>
        {aelfUtils.formatAddress(address)}
      </SymbolText>
      <TextS style={[styles.accountSubtitle, styles.flexBox]} numberOfLines={1}>
        ${swapUtils.USDdigits(totalBalanceInPrice)}
      </TextS>
    </Touchable>
  );
});
export {PairsItem, TokensItem, AccountsItem};

const styles = StyleSheet.create({
  tokenTopSubtitle: {
    fontSize: pTd(26),
    color: Colors.fontGray,
  },
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
  listItem2Box: {
    paddingHorizontal: pTd(30),
    paddingVertical: pTd(30),
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
  accountSubtitle: {
    textAlign: 'right',
  },
  accountTitleStyle: {
    flex: 2,
  },
  NFlexBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
