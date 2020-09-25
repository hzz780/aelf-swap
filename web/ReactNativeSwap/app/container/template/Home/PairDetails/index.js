import React, {memo, useMemo, useCallback, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  SectionStickyList,
  Touchable,
} from '../../../../components/template';
import {TextL} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import {bottomBarHeight} from '../../../../utils/common/device';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import PairCharts from '../components/PairCharts';
import {useFocusEffect} from '@react-navigation/native';
import RateItem from './RateItem';
import TransactionsItem from '../components/TransactionsItem';
import ToolBar from '../components/ToolBar';
let headerHeight = pTd(1510);
let isActive = false;
let totalScroll = 0,
  scroll = {};
const PairDetails = props => {
  const list = useRef();
  const [pairData, setPairData] = useState(props.route.params?.pairData || {});
  const {
    tokenUSD,
    pairInfos,
    pairSwapList,
    pairAddLiquidityList,
    pairRemoveLiquidityList,
  } = useStateToProps(base => {
    const {user, swap} = base;
    const symbolPair = pairData?.symbolPair;
    return {
      tokenUSD: user.tokenUSD,
      pairInfos: swap.pairInfos,
      pairSwapList: swap.pairSwap?.[symbolPair],
      pairAddLiquidityList: swap.pairAddLiquidity?.[symbolPair],
      pairRemoveLiquidityList: swap.pairRemoveLiquidity?.[symbolPair],
    };
  });
  const dispatch = useDispatch();
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  const getPairInfo = useCallback(
    symbolPair => dispatch(swapActions.getPairInfo(symbolPair)),
    [dispatch],
  );
  const {symbolPair} = pairData || {};
  const [loadCompleted, setLoadCompleted] = useSetState(null, true);
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
  const onGetPairSwapList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getPairSwapList(symbolPair, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [dispatch, endList, symbolPair],
  );
  const onGetPairAddLiquidityList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getPairAddLiquidityList(symbolPair, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [dispatch, endList, symbolPair],
  );
  const onGetPairRemoveLiquidityList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getPairRemoveLiquidityList(symbolPair, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [dispatch, endList, symbolPair],
  );
  const pairInfo = pairInfos?.[pairData?.symbolPair];
  const [index, setIndex] = useState(0);
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
  const renderHeader = useMemo(() => {
    const {symbolA, symbolB, reserveA, reserveB} = pairData || {};
    const subtitle = swapUtils.getSwapUSD(pairData, tokenUSD);
    const {
      volumeInPrice,
      volumeInPriceRate,
      volumeA,
      volumeB,
      liquidityInPriceRate,
      liquidityA,
      liquidityB,
      feeInPrice,
      feeInPriceRate,
    } = pairInfo || {};
    return (
      <View
        onLayout={({nativeEvent: {layout}}) => (headerHeight = layout.height)}>
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.overview')}
          </TextL>
        </View>
        <RateItem
          title={i18n.t('swap.liquidity')}
          subtitle={subtitle}
          rate={liquidityInPriceRate}
          fColor={Colors.fontGray}
          tA={liquidityA}
          tB={liquidityB}
          sA={symbolA}
          sB={symbolB}
        />
        <RateItem
          title={`${i18n.t('swap.volume')}(24h)`}
          subtitle={`$ ${swapUtils.USDdigits(volumeInPrice)}`}
          rate={volumeInPriceRate}
          tA={volumeA}
          tB={volumeB}
          sA={symbolA}
          sB={symbolB}
          fColor={Colors.fontGray}
        />
        <RateItem
          title={`${i18n.t('swap.fee')}(24h)`}
          subtitle={`$ ${feeInPrice || ''}`}
          rate={feeInPriceRate}
          fColor={Colors.fontGray}
        />
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.price')}
          </TextL>
        </View>
        <ListItem
          disabled
          title={symbolA}
          subtitle={`≈ ${swapUtils.detailsPrice(
            reserveA,
            reserveB,
          )} ${symbolB || ''} ($ ${swapUtils.getUSD(symbolA, tokenUSD)})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          disabled
          title={symbolB}
          subtitle={`≈ ${swapUtils.detailsPrice(
            reserveB,
            reserveA,
          )} ${symbolA || ''} ($ ${swapUtils.getUSD(symbolB, tokenUSD)})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <PairCharts {...pairData} />
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.transactions')}
          </TextL>
        </View>
      </View>
    );
  }, [pairData, pairInfo, tokenUSD]);
  const stickyHead = useCallback(() => {
    return (
      <ToolBar
        setIndex={i => {
          if (totalScroll >= headerHeight) {
            const y =
              scroll[i] && scroll[i] > headerHeight ? scroll[i] : headerHeight;
            list.current?.scrollTo(y);
          }
          setIndex(i);
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
    getPairs(symbolPair, (code, v) => {
      if (code === 1) {
        setPairData(v);
      }
    });
    setLoadCompleted(null);
    getPairInfo(symbolPair);
    onGetPairSwapList(0);
    onGetPairAddLiquidityList(1);
    onGetPairRemoveLiquidityList(2);
  }, [
    getPairInfo,
    getPairs,
    onGetPairAddLiquidityList,
    onGetPairRemoveLiquidityList,
    onGetPairSwapList,
    setLoadCompleted,
    symbolPair,
  ]);
  const onEndReached = useCallback(() => {
    if (index === 0) {
      onGetPairSwapList(0, true);
    } else if (index === 1) {
      onGetPairAddLiquidityList(1, true);
    } else {
      onGetPairRemoveLiquidityList(2, true);
    }
  }, [
    index,
    onGetPairAddLiquidityList,
    onGetPairRemoveLiquidityList,
    onGetPairSwapList,
  ]);
  const getData = useCallback(() => {
    if (index === 0) {
      return pairSwapList;
    } else if (index === 1) {
      return pairAddLiquidityList;
    }
    return pairRemoveLiquidityList;
  }, [index, pairAddLiquidityList, pairRemoveLiquidityList, pairSwapList]);
  const BottomButton = useMemo(() => {
    return (
      <View style={styles.bottomBox}>
        <Touchable
          onPress={() => {
            // DeviceEventEmitter.emit('SWAP_DATA', pairData);
            navigationService.navigate('DefaultSwap', {pairData});
          }}
          style={[
            styles.toolBarItem,
            styles.bottomItem,
            {backgroundColor: Colors.primaryColor},
          ]}>
          <TextL style={styles.whiteColor}>{i18n.t('swap.swap')}</TextL>
        </Touchable>
        <Touchable
          onPress={() => navigationService.navigate('AddLiquidity', {pairData})}
          style={[styles.toolBarItem, styles.bottomItem]}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.addLiquidity')}
          </TextL>
        </Touchable>
      </View>
    );
  }, [pairData]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={`${symbolPair} ${i18n.t('swap.pair')}`} canBack />
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
        listFooterHight={pTd(180)}
        onEndReached={onEndReached}
        renderHeader={renderHeader}
        loadCompleted={loadCompleted?.[index]}
        upPullRefresh={upPullRefresh}
      />
      {BottomButton}
    </View>
  );
};

export default memo(PairDetails);

const styles = StyleSheet.create({
  overviewBox: {
    paddingVertical: pTd(15),
    paddingLeft: pTd(30),
  },
  subtitleStyle: {
    fontSize: pTd(28),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
  toolBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: pTd(20),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  whiteColor: {
    color: 'white',
  },
  bottomBox: {
    flexDirection: 'row',
    paddingHorizontal: pTd(30),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingTop: pTd(30),
    paddingBottom: bottomBarHeight || pTd(30),
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: Colors.borderColor,
  },
  bottomItem: {
    borderRadius: pTd(15),
    marginHorizontal: pTd(15),
  },
});
