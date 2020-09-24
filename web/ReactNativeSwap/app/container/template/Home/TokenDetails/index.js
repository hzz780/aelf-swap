import React, {memo, useMemo, useCallback, useRef, useState} from 'react';
import {View} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  SectionStickyList,
  Touchable,
  BounceSpinner,
} from '../../../../components/template';
import {TextL} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import TokenCharts from '../components/TokenCharts';
import styles from './styles';
import TitleTool from '../components/TitleTool';
import {useFocusEffect} from '@react-navigation/native';
import RateItem from '../components/RateItem';
import TransactionsItem from '../components/TransactionsItem';
import ToolBar from '../components/ToolBar';
import PairItem from '../components/PairItem';
let headerHeight = pTd(1748);
let isActive = false;
let totalScroll = 0,
  scroll = {};
const TokenDetails = props => {
  const dispatch = useDispatch();
  const getTokenInfo = useCallback(
    (symbol, callBack) => dispatch(swapActions.getTokenInfo(symbol, callBack)),
    [dispatch],
  );
  const symbol = props.route.params?.symbol ?? '';
  const {
    tokenInfo,
    symbolSwapList,
    symbolAddLiquidityList,
    symbolRemoveLiquidityList,
  } = useStateToProps(base => {
    const {swap} = base;
    return {
      tokenInfo: swap.tokenInfo,
      symbolSwapList: swap.symbolSwap?.[symbol],
      symbolAddLiquidityList: swap.symbolAddLiquidity?.[symbol],
      symbolRemoveLiquidityList: swap.symbolRemoveLiquidity?.[symbol],
    };
  });
  const tokenDetails = tokenInfo[symbol];
  const [index, setIndex] = useState(0);
  const [loadCompleted, setLoadCompleted] = useSetState(null, true);
  const list = useRef();
  const endList = useCallback(
    (v, i) => {
      if (!isActive) {
        return;
      }
      if (v === 1) {
        setLoadCompleted({[i]: false});
      } else {
        setLoadCompleted({[i]: true});
      }
      list.current?.endUpPullRefresh();
      list.current?.endBottomRefresh();
    },
    [setLoadCompleted],
  );
  const onGetSymbolSwapList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getSymbolSwapList(symbol, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [dispatch, endList, symbol],
  );
  const onGetSymbolAddLiquidityList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getSymbolAddLiquidityList(symbol, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [dispatch, endList, symbol],
  );
  const onGetSymbolRemoveLiquidityList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getSymbolRemoveLiquidityList(symbol, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [dispatch, endList, symbol],
  );
  useFocusEffect(
    useCallback(() => {
      isActive = true;
      upPullRefresh();
      return () => {
        totalScroll = 0;
        scroll = {};
        isActive = false;
      };
    }, [upPullRefresh]),
  );
  const TopPairs = useMemo(() => {
    const {topPairs} = tokenDetails || {};
    if (Array.isArray(topPairs)) {
      return (
        <>
          <Touchable
            onPress={() => {
              navigationService.navigate('TokenMore', {symbol});
            }}
            style={[styles.overviewBox, styles.toolBarBox]}>
            <TextL style={[styles.flexBox, {color: Colors.primaryColor}]}>
              {i18n.t('swap.token.topPairs')}
            </TextL>
            <TextL style={[{color: Colors.primaryColor}]}>
              {i18n.t('swap.more')} {'>'}
            </TextL>
          </Touchable>
          <TitleTool
            titleList={[
              i18n.t('swap.pair'),
              i18n.t('swap.liquidity'),
              `${i18n.t('swap.volume')}(24h)`,
            ]}
          />
          {topPairs
            .slice(0, topPairs.length > 2 ? 2 : topPairs.length)
            .map((item, i) => {
              return <PairItem item={item} key={i} />;
            })}
        </>
      );
    } else {
      return <BounceSpinner />;
    }
  }, [symbol, tokenDetails]);
  const renderHeader = useMemo(() => {
    const {
      price,
      priceRate,
      liquidity,
      liqiodityRate,
      volumeInPrice,
      volumeInPriceRate,
      txsCount,
      txsCountRate,
    } = tokenDetails || {};
    if (!tokenDetails) {
      return <BounceSpinner />;
    }
    return (
      <View
        onLayout={({nativeEvent: {layout}}) => {
          headerHeight = layout.height;
        }}>
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.overview')}
          </TextL>
        </View>
        <RateItem
          title={i18n.t('swap.price')}
          subtitle={`$ ${swapUtils.USDdigits(price)}`}
          rate={priceRate}
        />
        <RateItem
          title={i18n.t('swap.liquidity')}
          subtitle={`$ ${swapUtils.USDdigits(liquidity)}`}
          rate={liqiodityRate}
        />
        <RateItem
          title={`${i18n.t('swap.volume')}(24h)`}
          subtitle={`$ ${swapUtils.USDdigits(volumeInPrice)}`}
          rate={volumeInPriceRate}
        />
        <RateItem
          title={`${i18n.t('swap.TXS')}(24h)`}
          subtitle={txsCount || '0'}
          rate={txsCountRate}
        />
        <TokenCharts symbol={symbol} />
        {TopPairs}
        {/* <PairCharts {...pairData} /> */}
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.transactions')}
          </TextL>
        </View>
      </View>
    );
  }, [TopPairs, symbol, tokenDetails]);
  const stickyHead = useCallback(() => {
    return (
      <ToolBar
        setIndex={i => {
          setIndex(i);
          if (totalScroll >= headerHeight) {
            const y =
              scroll[i] && scroll[i] > headerHeight ? scroll[i] : headerHeight;
            list.current?.scrollTo(y);
          }
        }}
        index={index}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, totalScroll]);
  const renderItem = useCallback(
    ({item}) => <TransactionsItem item={item} index={index} />,
    [index],
  );
  const upPullRefresh = useCallback(() => {
    getTokenInfo(symbol);
    setLoadCompleted(null);
    onGetSymbolSwapList(0);
    onGetSymbolAddLiquidityList(1);
    onGetSymbolRemoveLiquidityList(2);
  }, [
    getTokenInfo,
    onGetSymbolAddLiquidityList,
    onGetSymbolRemoveLiquidityList,
    onGetSymbolSwapList,
    setLoadCompleted,
    symbol,
  ]);
  const onEndReached = useCallback(() => {
    if (index === 0) {
      onGetSymbolSwapList(0, true);
    } else if (index === 1) {
      onGetSymbolAddLiquidityList(1, true);
    } else {
      onGetSymbolRemoveLiquidityList(2, true);
    }
  }, [
    index,
    onGetSymbolAddLiquidityList,
    onGetSymbolRemoveLiquidityList,
    onGetSymbolSwapList,
  ]);
  const BottomButton = useMemo(() => {
    return (
      <View style={styles.bottomBox}>
        <Touchable
          onPress={() => {
            navigationService.navigate('DefaultSwap', {
              pairData: {symbolA: symbol},
            });
          }}
          style={[
            styles.toolBarItem,
            styles.bottomItem,
            {backgroundColor: Colors.primaryColor},
          ]}>
          <TextL style={styles.whiteColor}>{i18n.t('swap.swap')}</TextL>
        </Touchable>
        <Touchable
          onPress={() =>
            navigationService.navigate('AddLiquidity', {
              pairData: {symbolA: symbol},
            })
          }
          style={[styles.toolBarItem, styles.bottomItem]}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.addLiquidity')}
          </TextL>
        </Touchable>
      </View>
    );
  }, [symbol]);
  const getData = useCallback(() => {
    if (index === 0) {
      return symbolSwapList;
    } else if (index === 1) {
      return symbolAddLiquidityList;
    }
    return symbolRemoveLiquidityList;
  }, [
    index,
    symbolAddLiquidityList,
    symbolRemoveLiquidityList,
    symbolSwapList,
  ]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={`${symbol}`} canBack />
      {tokenDetails ? (
        <>
          <SectionStickyList
            ref={list}
            data={getData()}
            showFooter
            whetherAutomatic
            onScroll={v => {
              totalScroll = v;
              scroll[index] = v;
            }}
            stickyHead={stickyHead}
            renderItem={renderItem}
            listFooterHight={pTd(200)}
            onEndReached={onEndReached}
            renderHeader={renderHeader}
            loadCompleted={loadCompleted?.[index]}
            upPullRefresh={upPullRefresh}
          />
          {BottomButton}
        </>
      ) : (
        <BounceSpinner type="Wave" style={styles.spinnerStyle} />
      )}
    </View>
  );
};

export default memo(TokenDetails);
