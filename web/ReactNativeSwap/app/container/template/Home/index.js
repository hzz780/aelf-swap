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
import HomeToolBar from './HomeToolBar';
import PairsItem from './PairsItem';
import Overview from './Overview';
let isActive = true;
const Home = () => {
  const dispatch = useDispatch();
  const list = useRef();
  const [loadCompleted, setLoadCompleted] = useState(null);
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
        setLoadCompleted({...(loadCompleted || {}), [i]: false});
      } else {
        setLoadCompleted({...(loadCompleted || {}), [i]: true});
      }
      list.current?.endBottomRefresh();
    },
    [loadCompleted],
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
    getPairs(undefined, () => {
      list.current?.endUpPullRefresh();
      list.current?.endBottomRefresh();
    });
    onGetAccountList(2);
    onGetTokenList(0);
  }, [getPairs, onGetAccountList, onGetTokenList]);
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
              ${swapUtils.USDdigits(liquidityInPrice)}
            </TextS>
            <TextS
              style={[styles.tokenTopSubtitle, styles.flexBox]}
              numberOfLines={1}>
              ${swapUtils.USDdigits(price)}
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
              ${swapUtils.USDdigits(totalBalanceInPrice)}
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
