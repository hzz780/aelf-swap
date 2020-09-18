import React, {useCallback, memo} from 'react';
import {ListComponent, CommonHeader} from '../../../../../components/template';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import PairsItem from '../../PairsItem';
import {View} from 'react-native';
import {GStyle} from '../../../../../assets/theme';
import TitleTool from '../../TitleTool';
import i18n from 'i18n-js';
const AccountPairList = props => {
  const {accountInfo} = useStateToProps(base => {
    const {user, swap} = base;
    return {
      tokenUSD: user.tokenUSD,
      accountInfo: swap.accountInfo,
    };
  });
  const address = props.route.params?.address ?? '';
  const addressDetails = accountInfo ? accountInfo[address] : undefined;
  const {pairList} = addressDetails || {};
  const renderItem = useCallback(({item}) => {
    return <PairsItem item={item} />;
  }, []);
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('swap.account.pairList')} canBack />
      <TitleTool
        titleList={[
          i18n.t('swap.pair'),
          i18n.t('swap.liquidity'),
          `${i18n.t('swap.volume')}(24h)`,
        ]}
      />
      <ListComponent data={pairList} renderItem={renderItem} />
    </View>
  );
};

export default memo(AccountPairList);
