import React, {memo, useCallback} from 'react';
import {ListComponent} from '../../../../../components/template';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import PairsItem from '../../PairsItem';

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
    return <PairsItem item={item} />;
  }, []);
  return <ListComponent data={topPairs} renderItem={renderItem} />;
};

export default memo(TokenMore);
