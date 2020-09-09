import React, {memo, useMemo, useCallback, useRef, useState} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  SectionStickyList,
  Touchable,
} from '../../../../components/template';
import {TextL, TextM, TextS} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import {bottomBarHeigth} from '../../../../utils/common/device';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useStateToProps} from '../../../../utils/pages/hooks';
import PairCharts from '../PairCharts';
import aelfUtils from '../../../../utils/pages/aelfUtils';
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
const PairDetails = props => {
  const {tokenUSD} = useStateToProps(base => {
    const {user} = base;
    return {
      tokenUSD: user.tokenUSD,
    };
  });
  const dispatch = useDispatch();
  const [pairData, setPairData] = useState(props.route.params?.pairData || {});
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  // const getPairInfo = useCallback(
  //   symbolPair => dispatch(swapActions.getPairInfo(symbolPair)),
  //   [dispatch],
  // );
  // useFocusEffect(
  //   useCallback(() => {
  //     getPairInfo(pairData.symbolPair);
  //   }, [getPairInfo, pairData.symbolPair]),
  // );
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
  const [index, setIndex] = useState(0);
  const [loadCompleted, setLoadCompleted] = useState(true);
  const list = useRef();
  const renderHeader = useMemo(() => {
    const {symbolA, symbolB, reserveA, reserveB} = pairData || {};
    const subtitle = swapUtils.getSwapUSD(pairData, tokenUSD);
    return (
      <View>
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.overview')}
          </TextL>
        </View>
        <ListItem
          style={styles.liquidityBox}
          disabled
          title={i18n.t('swap.liquidity')}
          subtitle={subtitle}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        {explanation(
          `${reserveA || '0'} ${symbolA || ''}`,
          `${reserveB || '0'} ${symbolB || ''}`,
        )}
        <ListItem
          disabled
          style={styles.liquidityBox}
          title={`${i18n.t('swap.volume')}(24h)`}
          subtitle="$ 234,123"
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        {explanation(
          `${reserveA || '0'} ${symbolA || ''}`,
          `${reserveB || '0'} ${symbolB || ''}`,
          Colors.fontGray,
        )}
        <ListItem
          disabled
          style={styles.liquidityBox}
          title={`${i18n.t('swap.fee')}(24h)`}
          subtitle="$ 234,123"
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        {explanation(
          `${reserveA || '0'} ${symbolA || ''}`,
          `${reserveB || '0'} ${symbolB || ''}`,
          Colors.fontGray,
        )}
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
          )} ${symbolB} ($ ${swapUtils.getUSD(symbolA, tokenUSD)})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          disabled
          title={symbolB}
          subtitle={`≈ ${swapUtils.detailsPrice(
            reserveB,
            reserveA,
          )} ${symbolA} ($ ${swapUtils.getUSD(symbolB, tokenUSD)})`}
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
  }, [explanation, pairData, tokenUSD]);
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
  const {symbolPair} = pairData || {};
  const upPullRefresh = useCallback(() => {
    getPairs(symbolPair, (code, v) => {
      if (code === 1) {
        setPairData(v);
      }
      onSetLoadCompleted(true);
      list.current && list.current.endUpPullRefresh();
      list.current && list.current.endBottomRefresh();
    });
  }, [getPairs, onSetLoadCompleted, symbolPair]);
  const onEndReached = useCallback(() => {
    onSetLoadCompleted(true);
    list.current && list.current.endBottomRefresh();
  }, [onSetLoadCompleted]);
  const data = index === 0 ? swapList : liquidityList;

  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={`${symbolPair} ${i18n.t('swap.pair')}`} canBack />
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
        listFooterHight={pTd(90)}
      />
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
    </View>
  );
};

export default memo(PairDetails);

const styles = StyleSheet.create({
  overviewBox: {
    paddingVertical: pTd(15),
    paddingLeft: pTd(30),
  },
  preBox: {
    marginTop: pTd(20),
  },
  subtitleStyle: {
    fontSize: pTd(28),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
  toolBarBox: {
    flexDirection: 'row',
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
  itemBox: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingLeft: pTd(30),
    paddingVertical: pTd(20),
    backgroundColor: 'white',
  },
  timeStyle: {
    color: Colors.fontGray,
    marginTop: pTd(5),
  },
  toolListTitile: {
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
    paddingHorizontal: pTd(30),
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBox: {
    flexDirection: 'row',
    paddingHorizontal: pTd(30),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingTop: pTd(30),
    paddingBottom: bottomBarHeigth || pTd(30),
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: Colors.borderColor,
  },
  bottomItem: {
    borderRadius: pTd(15),
    marginHorizontal: pTd(15),
  },
  liquidityBox: {
    borderBottomWidth: 0,
    minHeight: 0,
    paddingBottom: 0,
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
  itemtitleBox: {
    flexDirection: 'row',
    paddingRight: pTd(30),
  },
  leftTitle: {
    color: Colors.fontGray,
    flex: 1,
  },
});
