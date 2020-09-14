import React, {memo, useCallback} from 'react';
import swapUtils from '../../../../../utils/pages/swapUtils';
import {ListItem} from '../../../../../components/template';
import {StyleSheet, View} from 'react-native';
import {pTd} from '../../../../../utils/common';
import {Colors} from '../../../../../assets/theme';
import {TextM, TextS} from '../../../../../components/template/CommonText';
const RateItem = props => {
  const {title, subtitle, rate, tA, tB, sA, sB, fColor} = props;
  const explanation = useCallback(
    (title1, title2, color = Colors.primaryColor) => {
      return (
        <View style={styles.poolToken}>
          <TextM style={[styles.subtitleStyle, {color}]}>{title1}</TextM>
          <TextM style={[styles.subtitleStyle, {color}]}>{title2}</TextM>
        </View>
      );
    },
    [],
  );
  const {color, sign} = swapUtils.getRateStyle(rate);
  const bottomView = tA && tB;
  return (
    <>
      <ListItem
        disabled
        title={title}
        style={!bottomView ? {} : styles.liquidityBox}
        rightElement={
          <View style={styles.rightBox}>
            <TextS style={{color}}>
              {sign}
              {swapUtils.getPercentage(rate)}
            </TextS>
            <TextM style={styles.textStyles} numberOfLines={1}>
              {subtitle}
            </TextM>
          </View>
        }
      />
      {bottomView
        ? explanation(
            `${tA || '0'} ${sA || ''}`,
            `${tB || '0'} ${sB || ''}`,
            fColor,
          )
        : null}
    </>
  );
};

export default memo(RateItem);

const styles = StyleSheet.create({
  subtitleDetailsStyle: {
    fontSize: pTd(26),
    color: Colors.kRed,
    fontWeight: 'bold',
  },
  liquidityBox: {
    borderBottomWidth: 0,
    minHeight: 0,
    paddingBottom: 0,
  },
  rightBox: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  textStyles: {
    fontSize: pTd(26),
    fontWeight: 'bold',
    color: Colors.fontBlack,
    textAlign: 'right',
    marginRight: pTd(10),
  },
  poolToken: {
    paddingTop: pTd(10),
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'flex-end',
    paddingRight: pTd(30),
    height: pTd(110),
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingBottom: pTd(20),
  },
  subtitleStyle: {
    fontSize: pTd(28),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
});
