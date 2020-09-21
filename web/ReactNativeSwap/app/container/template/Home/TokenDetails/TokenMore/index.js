import React, {memo, useCallback} from 'react';
import {ListComponent, CommonHeader} from '../../../../../components/template';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import {View} from 'react-native';
import {GStyle} from '../../../../../assets/theme';
import TitleTool from '../../TitleTool';
import i18n from 'i18n-js';
import PairItem from '../../components/PairItem';
const TokenMore = props => {
  const {tokenInfo} = useStateToProps(base => {
    const {user, swap} = base;
    return {
      tokenUSD: user.tokenUSD,
      tokenInfo: swap.tokenInfo,
    };
  });
  const symbol = props.route.params?.symbol ?? '';
  const tokenDetails = tokenInfo[symbol];
  const {topPairs} = tokenDetails || {};
  const renderItem = useCallback(({item}) => {
    return <PairItem item={item} />;
  }, []);
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('swap.token.topPairs')} canBack />
      <TitleTool
        titleList={[
          i18n.t('swap.pair'),
          i18n.t('swap.liquidity'),
          `${i18n.t('swap.volume')}(24h)`,
        ]}
      />
      <ListComponent data={topPairs} renderItem={renderItem} />
    </View>
  );
};

export default memo(TokenMore);
