import React, {memo} from 'react';
import i18n from 'i18n-js';
import {StyleSheet, View} from 'react-native';
import {TextM, TextS} from '../../../../../components/template/CommonText';
import aelfUtils from '../../../../../utils/pages/aelfUtils';
import swapUtils from '../../../../../utils/pages/swapUtils';
const TransactionsItem = props => {
  const {item, index} = props;
  if (!item) {
    return;
  }
  const {
    amountIn,
    amountOut,
    symbolIn,
    symbolOut,
    sender,
    symbolA,
    amountA,
    amountB,
    symbolB,
  } = item || {};
  let leftTitle = i18n.t('swap.swap'),
    rigthTitle = i18n.t('swap.for');
  if (index === 1) {
    leftTitle = i18n.t('swap.add');
    rigthTitle = i18n.t('swap.and');
  } else if (index === 2) {
    leftTitle = i18n.t('swap.remove');
    rigthTitle = i18n.t('swap.and');
  }
  return (
    <View style={styles.itemBox}>
      <View style={styles.itemtitleBox}>
        <TextM style={styles.leftTitle}>
          {leftTitle}{' '}
          <TextM style={{color: Colors.fontBlack}}>
            {swapUtils.replaceNegative(amountIn || amountA)}{' '}
            {symbolIn || symbolA}
          </TextM>{' '}
          {rigthTitle}{' '}
          <TextM style={{color: Colors.fontBlack}}>
            {swapUtils.replaceNegative(amountOut || amountB)}{' '}
            {symbolOut || symbolB}
          </TextM>
        </TextM>
        <TextM numberOfLines={1}>${swapUtils.getTotalValue(item)}</TextM>
      </View>
      <TextS
        ellipsizeMode="middle"
        numberOfLines={1}
        style={styles.senderStyle}>
        {aelfUtils.formatAddress(sender)}
      </TextS>
      <TextS style={styles.timeStyle}>
        {aelfUtils.timeConversion(new Date().getTime())}
      </TextS>
    </View>
  );
};

export default memo(TransactionsItem);
const styles = StyleSheet.create({
  itemBox: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingLeft: pTd(30),
    paddingVertical: pTd(20),
    backgroundColor: 'white',
  },
  timeStyle: {
    color: Colors.fontGray,
    marginTop: pTd(5),
  },
  itemtitleBox: {
    flexDirection: 'row',
    paddingRight: pTd(30),
  },
  leftTitle: {
    color: Colors.fontGray,
    flex: 1,
  },
  senderStyle: {
    color: Colors.fontGray,
    marginTop: pTd(10),
    marginRight: '30%',
  },
});