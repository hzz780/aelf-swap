import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import i18n from 'i18n-js';
import {pTd} from '../../../../utils/common';
import {bottomBarHeight} from '../../../../utils/common/device';
import {Colors} from '../../../../assets/theme';
import {TextL, TextM} from '../../../../components/template/CommonText';
import {useStateToProps} from '../../../../utils/pages/hooks';
import swapUtils from '../../../../utils/pages/swapUtils';
const MySingleLiquidity = props => {
  const {myLiquidity} = useStateToProps(base => {
    const {swap} = base;
    return {
      myLiquidity: swap.myLiquidity,
    };
  });
  const {pair} = props;
  const {symbolPair} = pair || {};
  let thatPair;
  if (Array.isArray(myLiquidity)) {
    thatPair = myLiquidity.find(item => {
      return item.symbolPair === symbolPair;
    });
  }
  if (thatPair) {
    const {reserveA, reserveB, symbolA, symbolB, balance, totalSupply} =
      thatPair || {};
    const List = [
      {
        title: `${i18n.t('swap.pooled')} ${symbolA}:`,
        subtitle: swapUtils.getPoolToken(balance, totalSupply, reserveA),
      },
      {
        title: `${i18n.t('swap.pooled')} ${symbolB}:`,
        subtitle: swapUtils.getPoolToken(balance, totalSupply, reserveB),
      },
      {title: `${i18n.t('swap.myPoolTokens')}:`, subtitle: balance},
      {
        title: `${i18n.t('swap.myPoolShare')}:`,
        subtitle: swapUtils.getPoolShare(balance, totalSupply),
      },
    ];
    return (
      <View style={styles.myLiquidity}>
        <TextL style={styles.themeColor}>{i18n.t('swap.myLiquidity')}</TextL>
        {List.map((item, index) => {
          return (
            <View key={index} style={styles.myLiquidityItemBox}>
              <TextM>{item.title}</TextM>
              <TextM style={styles.rightText}>{item.subtitle}</TextM>
            </View>
          );
        })}
      </View>
    );
  }
};

export default memo(MySingleLiquidity);

const styles = StyleSheet.create({
  myLiquidity: {
    marginTop: pTd(20),
    backgroundColor: '#F3F3F3',
    padding: pTd(20),
    borderRadius: pTd(15),
    marginBottom: pTd(30) + bottomBarHeight,
  },
  themeColor: {
    color: Colors.primaryColor,
  },
  myLiquidityItemBox: {
    marginTop: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightText: {
    flex: 1,
    textAlign: 'right',
  },
});
