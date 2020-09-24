import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextL} from '../../../../../components/template/CommonText';
import {Colors} from '../../../../../assets/theme';
import i18n from 'i18n-js';
import RateItem from '../RateItem';
import OverviewCharts from '../../components/OverviewCharts';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import {BounceSpinner, ListItem} from '../../../../../components/template';
import swapUtils from '../../../../../utils/pages/swapUtils';
import TradingViewDemo from '../../../../../components/template/TradingView/demo';
const Overview = props => {
  const {overviewInfo} = useStateToProps(base => {
    const {settings, swap} = base;
    return {
      language: settings.language,
      overviewInfo: swap.overviewInfo,
    };
  });
  const {
    totalLiquidity,
    totalLiquidityRate,
    volume,
    volumeRate,
    txsCount,
    ELFPrice,
    pairsCount,
  } = overviewInfo || {};
  if (!overviewInfo) {
    return <BounceSpinner type="Wave" />;
  }
  return (
    <View {...props}>
      <View style={styles.overviewBox}>
        <TextL style={{color: Colors.primaryColor}}>
          {i18n.t('swap.overview')}
        </TextL>
      </View>
      <RateItem
        title={i18n.t('swap.totalValue')}
        subtitle={`$ ${swapUtils.USDdigits(totalLiquidity)}`}
        rate={totalLiquidityRate}
      />
      <RateItem
        title={`${i18n.t('swap.volume')}(24h)`}
        subtitle={swapUtils.USDdigits(volume)}
        rate={volumeRate}
      />
      <ListItem
        disabled
        title={`ELF ${i18n.t('swap.price')}`}
        subtitle={`$ ${swapUtils.USDdigits(ELFPrice)}`}
        rightElement={null}
        subtitleStyle={styles.subtitleStyle}
      />
      <ListItem
        disabled
        title={`${i18n.t('swap.transactions')}(24h)`}
        subtitle={txsCount}
        rightElement={null}
        subtitleStyle={styles.subtitleStyle}
      />
      <ListItem
        disabled
        title={i18n.t('swap.pairs')}
        subtitle={pairsCount}
        rightElement={null}
        subtitleStyle={styles.subtitleStyle}
      />
      <TradingViewDemo />
      {/* <OverviewCharts /> */}
      <View style={styles.overviewBox}>
        <TextL style={{color: Colors.primaryColor}}>
          {i18n.t('swap.allMarkets')}
        </TextL>
      </View>
    </View>
  );
};

export default memo(Overview);
const styles = StyleSheet.create({
  subtitleStyle: {
    fontSize: pTd(26),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
  overviewBox: {
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
    paddingLeft: pTd(30),
  },
});
