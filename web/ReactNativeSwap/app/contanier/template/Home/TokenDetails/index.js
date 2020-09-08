import React, {memo, useMemo, useCallback, useRef, useState} from 'react';
import {View, LayoutAnimation} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  SectionStickyList,
  Touchable,
  BounceSpinner,
} from '../../../../components/template';
import {TextL, TextM, TextS} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useStateToProps} from '../../../../utils/pages/hooks';
import PairCharts from '../PairCharts';
import aelfUtils from '../../../../utils/pages/aelfUtils';
import styles from './styles';
import TitleTool from '../TitleTool';
import PairsItem from '../PairsItem';
import {useFocusEffect} from '@react-navigation/native';
let isActive = true;
const ToolBar = memo(props => {
  const {index, setIndex} = props;
  const toolList = [
    i18n.t('swap.swaps'),
    i18n.t('swap.adds'),
    i18n.t('swap.removes'),
  ];
  return (
    <>
      <View style={styles.toolBarBox}>
        {toolList.map((item, j) => {
          const current = j === index;
          return (
            <Touchable
              highlight
              underlayColor={Colors.bottonPressColor}
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setIndex(j);
              }}
              key={j}
              style={[
                styles.toolBarItem,
                current && {backgroundColor: Colors.primaryColor},
              ]}>
              <TextL style={[current && styles.whiteColor]}>{item}</TextL>
            </Touchable>
          );
        })}
      </View>
      <View style={styles.toolListTitile}>
        <TextL style={{color: Colors.primaryColor}}>{toolList[index]}</TextL>
        <TextL style={{color: Colors.primaryColor}}>
          {i18n.t('swap.totalValue')}
        </TextL>
      </View>
    </>
  );
});
const swapList = [
  {
    sender: '12313', // 交易者
    symbolIn: 'ELF',
    symbolOut: 'AEUSD',
    amountIn: 12312,
    amountOut: 12313,
    priceIn: 0.1,
    priceOut: 0.1,
    fee: 123,
    txId: '13142',
    time: 123, // unix时间戳
  },
  {
    sender: '12313', // 交易者
    symbolIn: 'ELF',
    symbolOut: 'AEUSD',
    amountIn: 12312,
    amountOut: 12313,
    priceIn: 0.1,
    priceOut: 0.1,
    fee: 123,
    txId: '13142',
    time: 123, // unix时间戳
  },
];
const liquidityList = [
  {
    sender: '12313', // 交易者
    symbolA: 'ELF',
    symbolB: 'AEUSD',
    amountA: 12312,
    amountB: 12313,
    priceA: 0.1,
    priceB: 0.1,
    txId: '13142',
    time: 123, // unix时间戳
  },
  {
    sender: '12313', // 交易者
    symbolA: 'ELF',
    symbolB: 'AEUSD',
    amountA: 12312,
    amountB: 12313,
    priceA: 0.1,
    priceB: 0.1,
    txId: '13142',
    time: 123, // unix时间戳
  },
];
const TokenDetails = props => {
  const {tokenInfo} = useStateToProps(base => {
    const {user, swap} = base;
    return {
      tokenUSD: user.tokenUSD,
      tokenInfo: swap.tokenInfo,
    };
  });
  const dispatch = useDispatch();
  const getTokenInfo = useCallback(
    (symbol, callBack) => dispatch(swapActions.getTokenInfo(symbol, callBack)),
    [dispatch],
  );
  const symbol = props.route.params?.symbol ?? '';
  const tokenDetails = tokenInfo[symbol];
  const {
    price,
    priceRate,
    liquidity,
    liqiodityRate,
    volumeInPrice,
    volumeInPriceRate,
    txsCount,
    txsCountRate,
    topPairs,
  } = tokenDetails || {};
  console.log(tokenDetails, '=====tokenDetails');
  useFocusEffect(
    useCallback(() => {
      upPullRefresh();
    }, [upPullRefresh]),
  );
  const [index, setIndex] = useState(0);
  const [loadCompleted, setLoadCompleted] = useState(true);
  const list = useRef();
  const Item = useCallback((title, subtitle, rate) => {
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
  }, []);
  const TopPairs = useMemo(() => {
    if (Array.isArray(topPairs)) {
      return (
        <>
          <View style={[styles.overviewBox, styles.toolBarBox]}>
            <TextL style={[styles.flexBox, {color: Colors.primaryColor}]}>
              Top Pairs
            </TextL>
            <TextL style={[{color: Colors.primaryColor}]}>More ></TextL>
          </View>
          <TitleTool
            titleList={[
              i18n.t('swap.pair'),
              i18n.t('swap.liquidity'),
              i18n.t('swap.volume'),
            ]}
          />
          {topPairs.map((item, i) => {
            return <PairsItem item={item} key={i} />;
          })}
        </>
      );
    }
  }, [topPairs]);
  const renderHeader = useMemo(() => {
    return (
      <>
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.overview')}
          </TextL>
        </View>
        {Item(i18n.t('swap.price'), `$ ${price}`, priceRate)}
        {Item(i18n.t('swap.liquidity'), `${liquidity}`, liqiodityRate)}
        {Item(
          `${i18n.t('swap.volume')}(24h)`,
          `$ ${volumeInPrice}`,
          volumeInPriceRate,
        )}
        {Item(`${i18n.t('swap.TXS')}(24h)`, `${txsCount}`, txsCountRate)}
        <PairCharts />
        {TopPairs}
        {/* <PairCharts {...pairData} /> */}
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.transactions')}
          </TextL>
        </View>
      </>
    );
  }, [
    Item,
    TopPairs,
    liqiodityRate,
    liquidity,
    price,
    priceRate,
    txsCount,
    txsCountRate,
    volumeInPrice,
    volumeInPriceRate,
  ]);
  const stickyHead = useCallback(() => {
    return <ToolBar setIndex={setIndex} index={index} />;
  }, [index]);
  const renderItem = useCallback(
    ({item}) => {
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
        priceOut,
        priceA,
        priceB,
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
      const totalValue = priceOut
        ? priceOut * amountOut
        : priceA * amountA + priceB * amountB;
      return (
        <View style={styles.itemBox}>
          <View style={styles.itemtitleBox}>
            <TextM style={styles.leftTitle}>
              {leftTitle}{' '}
              <TextL style={{color: Colors.fontBlack}}>
                {amountIn || amountA} {symbolIn || symbolA}
              </TextL>{' '}
              {rigthTitle}{' '}
              <TextL style={{color: Colors.fontBlack}}>
                {amountOut || amountB} {symbolOut || symbolB}
              </TextL>
            </TextM>
            <TextM numberOfLines={1}>
              ${swapUtils.getTotalValue(totalValue)}
            </TextM>
          </View>
          <TextS numberOfLines={1} style={styles.timeStyle}>
            {sender}
          </TextS>
          <TextS style={styles.timeStyle}>
            {aelfUtils.timeConversion(new Date().getTime())}
          </TextS>
        </View>
      );
    },
    [index],
  );
  const onSetLoadCompleted = useCallback(value => {
    if (isActive) {
      setLoadCompleted(value);
    }
  }, []);
  const upPullRefresh = useCallback(() => {
    getTokenInfo(symbol, () => {
      list.current && list.current.endUpPullRefresh();
      list.current && list.current.endBottomRefresh();
    });
  }, [getTokenInfo, symbol]);
  const onEndReached = useCallback(() => {
    onSetLoadCompleted(true);
    list.current && list.current.endBottomRefresh();
  }, [onSetLoadCompleted]);
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
  const data = index === 0 ? swapList : liquidityList;
  console.log(tokenDetails, '====tokenDetails');
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={`${symbol}`} canBack />
      {tokenDetails ? (
        <>
          <SectionStickyList
            data={data}
            loadCompleted={loadCompleted}
            upPullRefresh={upPullRefresh}
            // onEndReached={onEndReached}
            renderHeader={renderHeader}
            stickyHead={stickyHead}
            renderItem={renderItem}
            ref={list}
            showFooter
            allLoadedTips=" "
            listFooterHight={pTd(90)}
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
