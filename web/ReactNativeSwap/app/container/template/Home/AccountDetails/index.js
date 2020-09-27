import React, {memo, useMemo, useCallback, useRef, useState} from 'react';
import {View} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  SectionStickyList,
  Touchable,
  BounceSpinner,
  ActionSheet,
} from '../../../../components/template';
import {TextL} from '../../../../components/template/CommonText';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import {useStateToProps, useSetState} from '../../../../utils/pages/hooks';
import AccountCharts from '../components/AccountCharts';
import styles from './styles';
import TitleTool from '../components/TitleTool';
import {useFocusEffect} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import navigationService from '../../../../utils/common/navigationService';
import {bottomBarHeight} from '../../../../utils/common/device';
import TransactionsItem from '../components/TransactionsItem';
import swapUtils from '../../../../utils/pages/swapUtils';
import ToolBar from '../components/ToolBar';
import PairItem from '../components/PairItem';
import aelfUtils from '../../../../utils/pages/aelfUtils';
let headerHeight = pTd(1732);
let isActive = false;
let totalScroll = 0,
  scroll = {};
const AccountDetails = props => {
  const dispatch = useDispatch();
  const getAccountInfo = useCallback(
    (address, callBack) =>
      dispatch(swapActions.getAccountInfo(address, callBack)),
    [dispatch],
  );
  const [state, setState] = useSetState({symbolPair: null}, true);
  const [loadCompleted, setLoadCompleted] = useSetState(null, true);
  const {symbolPair} = state;
  const address = props.route.params?.address ?? '';
  const {
    accountInfo,
    addressSwapList,
    addressAddLiquidityList,
    addressRemoveLiquidityList,
  } = useStateToProps(base => {
    const {swap} = base;
    return {
      accountInfo: swap.accountInfo,
      addressSwapList: swap.addressSwap?.[address],
      addressAddLiquidityList: swap.addressAddLiquidity?.[address],
      addressRemoveLiquidityList: swap.addressRemoveLiquidity?.[address],
    };
  });
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
  const onGetAddressSwapList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getAddressSwapList(address, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [dispatch, endList, address],
  );
  const onGetAddressAddLiquidityList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getAddressAddLiquidityList(address, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [address, dispatch, endList],
  );
  const onGetAddressRemoveLiquidityList = useCallback(
    (i, loadingPaging) =>
      dispatch(
        swapActions.getAddressRemoveLiquidityList(address, loadingPaging, v =>
          endList(v, i),
        ),
      ),
    [address, dispatch, endList],
  );
  const addressDetails = accountInfo?.[address];
  const {totalSwapped, feePaid, txsCount, pairList} = addressDetails || {};
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
  const [index, setIndex] = useState(0);
  const list = useRef();
  const Item = useCallback((title, subtitle) => {
    return (
      <ListItem
        disabled
        title={title}
        subtitle={subtitle}
        rightElement={null}
        subtitleStyle={styles.subtitleStyle}
      />
    );
  }, []);
  const TopPairs = useMemo(() => {
    if (Array.isArray(pairList)) {
      return (
        <>
          <Touchable
            onPress={() => {
              navigationService.navigate('AccountPairList', {address});
            }}
            style={[styles.overviewBox, styles.toolBarBox]}>
            <TextL style={[styles.flexBox, {color: Colors.primaryColor}]}>
              {i18n.t('swap.pairs')}
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
          {pairList
            .slice(0, pairList.length > 2 ? 2 : pairList.length)
            .map((item, i) => {
              return <PairItem item={item} key={i} />;
            })}
        </>
      );
    }
  }, [address, pairList]);
  const onSelect = useCallback(
    item => {
      setState({symbolPair: item.symbolPair});
    },
    [setState],
  );
  const onAllPairs = useCallback(() => {
    const items = Array.isArray(pairList)
      ? pairList.map(item => {
          return {
            ...item,
            title: item.symbolPair,
            onPress: onSelect,
          };
        })
      : [];
    ActionSheet.show(
      [...items, {title: i18n.t('swap.account.allPairs'), onPress: onSelect}],
      {
        title: i18n.t('cancel'),
      },
    );
  }, [onSelect, pairList]);
  const renderHeader = useMemo(() => {
    return (
      <View
        onLayout={({nativeEvent: {layout}}) => (headerHeight = layout.height)}>
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.overview')}
          </TextL>
        </View>
        {Item(i18n.t('account'), aelfUtils.formatAddress(address))}
        {Item(
          i18n.t('swap.account.totalSwapped'),
          `$ ${swapUtils.USDdigits(totalSwapped)}`,
        )}
        {Item(
          i18n.t('swap.account.feePaid'),
          `$ ${swapUtils.USDdigits(feePaid)}`,
        )}
        {Item(i18n.t('swap.account.TXSCount'), txsCount)}
        <ListItem
          onPress={onAllPairs}
          style={styles.allPairsStyle}
          title={symbolPair || i18n.t('swap.account.allPairs')}
          rightElement={<AntDesign name="caretdown" color={Colors.fontGray} />}
        />
        <AccountCharts address={address} symbolPair={symbolPair} />
        {TopPairs}
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.transactions')}
          </TextL>
        </View>
      </View>
    );
  }, [
    Item,
    TopPairs,
    address,
    feePaid,
    onAllPairs,
    symbolPair,
    totalSwapped,
    txsCount,
  ]);
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
    setLoadCompleted(null);
    getAccountInfo(address);
    onGetAddressSwapList(0);
    onGetAddressAddLiquidityList(1);
    onGetAddressRemoveLiquidityList(2);
  }, [
    address,
    getAccountInfo,
    onGetAddressAddLiquidityList,
    onGetAddressRemoveLiquidityList,
    onGetAddressSwapList,
    setLoadCompleted,
  ]);
  const onEndReached = useCallback(() => {
    if (index === 0) {
      onGetAddressSwapList(0, true);
    } else if (index === 1) {
      onGetAddressAddLiquidityList(1, true);
    } else {
      onGetAddressRemoveLiquidityList(2, true);
    }
    list.current && list.current.endBottomRefresh();
  }, [
    index,
    onGetAddressAddLiquidityList,
    onGetAddressRemoveLiquidityList,
    onGetAddressSwapList,
  ]);
  const getData = useCallback(() => {
    if (index === 0) {
      return addressSwapList;
    } else if (index === 1) {
      return addressAddLiquidityList;
    }
    return addressRemoveLiquidityList;
  }, [
    addressAddLiquidityList,
    addressRemoveLiquidityList,
    addressSwapList,
    index,
  ]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={aelfUtils.formatAddress(address)} canBack />
      {addressDetails ? (
        <SectionStickyList
          ref={list}
          showFooter
          data={getData()}
          onScroll={v => {
            totalScroll = v;
            scroll[index] = v;
          }}
          whetherAutomatic
          stickyHead={stickyHead}
          renderItem={renderItem}
          listFooterHight={bottomBarHeight}
          onEndReached={onEndReached}
          renderHeader={renderHeader}
          loadCompleted={loadCompleted?.[index]}
          upPullRefresh={upPullRefresh}
        />
      ) : (
        <BounceSpinner type="Wave" style={styles.spinnerStyle} />
      )}
    </View>
  );
};

export default memo(AccountDetails);
