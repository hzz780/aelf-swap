import i18n from 'i18n-js';
import React, {memo, useRef, useCallback, useState, useMemo} from 'react';
import {
  CommonHeader,
  ListItem,
  SectionStickyList,
} from '../../../components/template';
import {View, StyleSheet} from 'react-native';
import {useStateToProps} from '../../../utils/pages/hooks';
import {GStyle, Colors} from '../../../assets/theme';
import {pTd} from '../../../utils/common';
import navigationService from '../../../utils/common/navigationService';
import swapActions from '../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import swapUtils from '../../../utils/pages/swapUtils';
import {useFocusEffect} from '@react-navigation/native';
import OverviewCharts from './OverviewCharts';
import {TextL} from '../../../components/template/CommonText';
let isActive = true;

const Home = () => {
  const dispatch = useDispatch();
  const list = useRef();
  const [loadCompleted, setLoadCompleted] = useState(true);
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  const {pairs, tokenUSD} = useStateToProps(base => {
    const {settings, swap, user} = base;
    return {
      language: settings.language,
      pairs: swap.pairs,
      tokenUSD: user.tokenUSD,
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
      const subtitle = swapUtils.getSwapUSD(item, tokenUSD);
      return (
        <ListItem
          title={item.symbolPair}
          subtitle={subtitle}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
          onPress={() =>
            navigationService.navigate('PairDetails', {pairData: item})
          }
        />
      );
    },
    [tokenUSD],
  );
  const renderHeader = useMemo(() => {
    return (
      <>
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.overview')}
          </TextL>
        </View>
        <OverviewCharts />
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.allMarkets')}
          </TextL>
        </View>
      </>
    );
  }, []);
  const stickyHead = useCallback(() => {
    return (
      <ListItem
        style={styles.topBox}
        titleStyle={styles.topTitle}
        subtitleStyle={styles.topSubtitle}
        title={i18n.t('swap.pair')}
        subtitle={i18n.t('swap.liquidity')}
        rightElement={null}
        disabled
      />
    );
  }, []);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('swap.market')} />
      <SectionStickyList
        whetherAutomatic
        data={pairs}
        loadCompleted={loadCompleted}
        upPullRefresh={upPullRefresh}
        // onEndReached={onEndReached}
        bottomLoadTip={i18n.t('swap.loadMore')}
        renderHeader={renderHeader}
        stickyHead={stickyHead}
        renderItem={renderItem}
        ref={list}
        showFooter
        allLoadedTips=" "
      />
    </View>
  );
};
export default memo(Home);

const styles = StyleSheet.create({
  topBox: {
    paddingVertical: pTd(20),
    minHeight: pTd(80),
  },
  grayColor: {
    color: Colors.fontGray,
  },
  itemBox: {
    paddingVertical: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  topTitle: {
    color: Colors.fontGray,
    fontSize: pTd(30),
  },
  topSubtitle: {
    fontSize: pTd(30),
  },
  subtitleStyle: {
    color: Colors.fontBlack,
  },
  overviewBox: {
    paddingTop: pTd(15),
    paddingBottom: pTd(15),
    paddingLeft: pTd(30),
  },
});
