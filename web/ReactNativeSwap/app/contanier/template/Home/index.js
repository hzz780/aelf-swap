import i18n from 'i18n-js';
import React, {memo, useRef, useCallback, useState, useMemo} from 'react';
import {
  CommonHeader,
  SectionStickyList,
  Touchable,
} from '../../../components/template';
import {View} from 'react-native';
import {useStateToProps} from '../../../utils/pages/hooks';
import {GStyle} from '../../../assets/theme';
import navigationService from '../../../utils/common/navigationService';
import swapActions from '../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import swapUtils from '../../../utils/pages/swapUtils';
import {useFocusEffect} from '@react-navigation/native';
import {TextM, TextS} from '../../../components/template/CommonText';
import styles from './styles';
import ToolBar from './ToolBar';
import PairsItem from './PairsItem';
import Overview from './Overview';
let isActive = true;
const tokenList = [
  {
    symbol: 'ELF',
    liquidityInPrice: 1214, // 流通量，为美元，无则为'-'
    liquidity: 123,
    price: 12, // 价格，为美元，无则为'-'
    priceRate: 0.01, // 价格变化率
  },
  {
    symbol: 'ELF',
    liquidityInPrice: 1214, // 流通量，为美元，无则为'-'
    liquidity: 123,
    price: 12, // 价格，为美元，无则为'-'
    priceRate: 0.01, // 价格变化率
  },
  {
    symbol: 'ELF',
    liquidityInPrice: 1214, // 流通量，为美元，无则为'-'
    liquidity: 123,
    price: 12, // 价格，为美元，无则为'-'
    priceRate: 0.01, // 价格变化率
  },
];
const accountList = [
  {
    address: 'aDTDFwfZxkMwYqCxndue9YU9xAF5wskSekdKQXHdPAEyynbEv',
    totalBalanceInPrice: 12313, // 美元价格计算的总市值
  },
  {
    address: '12313213',
    totalBalanceInPrice: 12313, // 美元价格计算的总市值
  },
  {
    address: '12313213',
    totalBalanceInPrice: 12313, // 美元价格计算的总市值
  },
];
const Home = () => {
  const dispatch = useDispatch();
  const list = useRef();
  const [loadCompleted, setLoadCompleted] = useState(false);
  const [index, setIndex] = useState(1);
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  const {pairs} = useStateToProps(base => {
    const {settings, swap} = base;
    return {
      language: settings.language,
      pairs: swap.pairs,
    };
  });
  useFocusEffect(
    useCallback(() => {
      getPairs();
    }, [getPairs]),
  );
  const onSetLoadCompleted = useCallback(value => {
    if (isActive) {
      setLoadCompleted(value);
    }
  }, []);
  const upPullRefresh = useCallback(() => {
    getPairs(undefined, () => {
      list.current && list.current.endUpPullRefresh();
      list.current && list.current.endBottomRefresh();
    });
    onSetLoadCompleted(true);
  }, [getPairs, onSetLoadCompleted]);
  const onEndReached = useCallback(() => {
    onSetLoadCompleted(true);
    list.current && list.current.endBottomRefresh();
  }, [onSetLoadCompleted]);
  const renderItem = useCallback(
    ({item}) => {
      if (!item) {
        return null;
      }
      if (index === 1) {
        return <PairsItem item={item} />;
      } else if (index === 0) {
        const {symbol, liquidityInPrice, price, priceRate} = item;
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
              ${liquidityInPrice}
            </TextS>
            <TextS
              style={[styles.tokenTopSubtitle, styles.flexBox]}
              numberOfLines={1}>
              ${price}
            </TextS>
            <TextS
              style={[styles.tokenTopSubtitle, styles.flexBox, {color}]}
              numberOfLines={1}>
              {sign + swapUtils.getPercentage(priceRate)}
            </TextS>
          </Touchable>
        );
      } else {
        const {address, totalBalanceInPrice} = item;
        return (
          <Touchable
            onPress={() =>
              navigationService.navigate('AccountDetails', {address})
            }
            style={styles.listItem2Box}>
            <TextM
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styles.titleStyle, styles.accountTitleStyle]}>
              {address}
            </TextM>
            <TextS
              style={[styles.accountSubtitle, styles.flexBox]}
              numberOfLines={1}>
              ${totalBalanceInPrice}
            </TextS>
          </Touchable>
        );
      }
    },
    [index],
  );
  const renderHeader = useMemo(() => {
    return <Overview />;
  }, []);
  const stickyHead = useCallback(() => {
    return <ToolBar index={index} setIndex={setIndex} />;
  }, [index]);
  const data = index === 1 ? pairs : index === 2 ? accountList : tokenList;
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('swap.market')} />
      <SectionStickyList
        ref={list}
        data={data}
        showFooter
        whetherAutomatic
        stickyHead={stickyHead}
        renderItem={renderItem}
        renderHeader={renderHeader}
        onEndReached={onEndReached}
        loadCompleted={loadCompleted}
        upPullRefresh={upPullRefresh}
        bottomLoadTip={i18n.t('swap.loadMore')}
      />
    </View>
  );
};
export default memo(Home);
