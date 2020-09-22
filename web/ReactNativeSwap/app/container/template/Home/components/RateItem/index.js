import React, {memo} from 'react';
import swapUtils from '../../../../../utils/pages/swapUtils';
import {ListItem} from '../../../../../components/template';
import {StyleSheet} from 'react-native';
import {pTd} from '../../../../../utils/common';
import {Colors} from '../../../../../assets/theme';
const RateItem = props => {
  const {title, subtitle, rate} = props;
  const {color, sign} = swapUtils.getRateStyle(rate);
  return (
    <ListItem
      disabled
      title={title}
      subtitle={subtitle}
      subtitleDetails={sign + swapUtils.getPercentage(rate)}
      rightElement={null}
      subtitleDetailsStyle={[styles.subtitleDetailsStyle, {color}]}
      subtitleStyle={styles.subtitleStyle}
    />
  );
};

export default memo(RateItem);

const styles = StyleSheet.create({
  subtitleDetailsStyle: {
    fontSize: pTd(26),
    color: Colors.kRed,
    fontWeight: 'bold',
  },
  subtitleStyle: {
    fontSize: pTd(26),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
});
