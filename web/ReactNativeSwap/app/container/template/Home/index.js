import i18n from 'i18n-js';
import React, {memo, useRef, useCallback, useState, useMemo} from 'react';
import {CommonHeader, SectionStickyList} from '../../../components/template';
import {View} from 'react-native';
import {useSetState, useStateToProps} from '../../../utils/pages/hooks';
import {GStyle} from '../../../assets/theme';
import swapActions from '../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import HomeToolBar from './components/HomeToolBar';
import Overview from './components/Overview';
import {AccountsItem, PairsItem, TokensItem} from './components/HomeItems';
let isActive = true;
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
      if (!isActive) {
        return;
      }
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
    return <Overview />;
  }, []);
  const stickyHead = useCallback(() => {
    return (
      <HomeToolBar
        index={index}
        setIndex={i => {
          setIndex(i);
          list.current?.scrollTo({
            sectionIndex: 0,
            itemIndex: 0,
            animated: false,
          });
        }}
      />
    );
  }, [index]);
  const getData = useCallback(() => {
    if (index === 1) {
      return pairs;
    } else if (index === 2) {
      return accountList;
    } else {
      return tokenList;
    }
  }, [accountList, index, pairs, tokenList]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('swap.market')} />
      <SectionStickyList
        ref={list}
        data={getData()}
        showFooter
        whetherAutomatic
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
