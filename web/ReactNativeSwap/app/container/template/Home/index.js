import i18n from 'i18n-js';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import React, {memo, useRef, useCallback, useState, useMemo} from 'react';
import Overview from './components/Overview';
import {GStyle} from '../../../assets/theme';
import swapActions from '../../../redux/swapRedux';
import HomeToolBar from './components/HomeToolBar';
import {useSetState, useStateToProps} from '../../../utils/pages/hooks';
import {AccountsItem, PairsItem, TokensItem} from './components/HomeItems';
import {CommonHeader, SectionStickyList} from '../../../components/template';
import {pTd} from '../../../utils/common';
let headerHeight = pTd(1408);
let totalScroll = 0,
  scroll = {};
const Home = () => {
  const dispatch = useDispatch();
  const list = useRef();
  const [loadCompleted, setLoadCompleted] = useSetState(null, true);
  const [index, setIndex] = useState(1);
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  const endList = useCallback(
    (v, i) => {
      if (v === 1) {
        setLoadCompleted({[i]: false});
      } else {
        setLoadCompleted({[i]: true});
      }
      list.current?.endBottomRefresh();
    },
    [setLoadCompleted],
  );
  const onGetAccountList = useCallback(
    (i, loadingPaging) =>
      dispatch(swapActions.getAccountList(loadingPaging, v => endList(v, i))),
    [dispatch, endList],
  );
  const onGetTokenList = useCallback(
    (i, loadingPaging) =>
      dispatch(swapActions.getTokenList(loadingPaging, v => endList(v, i))),
    [dispatch, endList],
  );
  const {pairs, accountList, tokenList} = useStateToProps(base => {
    const {settings, swap} = base;
    return {
      language: settings.language,
      pairs: swap.pairs,
      accountList: swap.accountList,
      tokenList: swap.tokenList,
    };
  });
  useFocusEffect(
    useCallback(() => {
      upPullRefresh();
    }, [upPullRefresh]),
  );
  const upPullRefresh = useCallback(() => {
    setLoadCompleted(null);
    getPairs(undefined, () => {
      list.current?.endUpPullRefresh();
      list.current?.endBottomRefresh();
    });
    onGetTokenList(0);
    onGetAccountList(2);
  }, [getPairs, onGetAccountList, onGetTokenList, setLoadCompleted]);
  const onEndReached = useCallback(() => {
    if (index === 2) {
      onGetAccountList(2, true);
    } else if (index === 0) {
      onGetTokenList(0, true);
    }
  }, [index, onGetAccountList, onGetTokenList]);
  const renderItem = useCallback(
    ({item}) => {
      if (!item) {
        return null;
      }
      if (index === 1) {
        return <PairsItem item={item} />;
      } else if (index === 0) {
        return <TokensItem item={item} />;
      }
      return <AccountsItem item={item} />;
    },
    [index],
  );
  const renderHeader = useMemo(() => {
    return (
      <Overview
        onLayout={({nativeEvent: {layout}}) => {
          headerHeight = layout.height;
        }}
      />
    );
  }, []);
  const stickyHead = useCallback(() => {
    return (
      <HomeToolBar
        index={index}
        setIndex={i => {
          setIndex(i);
          if (totalScroll >= headerHeight) {
            const y =
              scroll[i] && scroll[i] > headerHeight ? scroll[i] : headerHeight;
            list.current?.scrollTo(y);
          }
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, totalScroll]);
  const getData = useCallback(() => {
    if (index === 0) {
      return tokenList;
    } else if (index === 2) {
      return accountList;
    }
    return pairs;
  }, [accountList, index, pairs, tokenList]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('swap.market')} />
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
        renderHeader={renderHeader}
        onEndReached={onEndReached}
        loadCompleted={index === 1 || loadCompleted?.[index]}
        upPullRefresh={upPullRefresh}
        bottomLoadTip={i18n.t('swap.loadMore')}
      />
    </View>
  );
};
export default memo(Home);
