import React, {memo, useCallback, useRef, useState} from 'react';
import {
  ListComponent,
  ListItem,
  Touchable,
} from '../../../../components/template';
import {View} from 'react-native';
import {Colors} from '../../../../assets/theme';
import {TextL} from '../../../../components/template/CommonText';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import {useStateToProps} from '../../../../utils/pages/hooks';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useDispatch} from 'react-redux';
import swapActions from '../../../../redux/swapRedux';
import {useFocusEffect} from '@react-navigation/native';
import styles from './styles';
const MeLiquidity = () => {
  const dispatch = useDispatch();
  const list = useRef();
  const [loadCompleted, setLoadCompleted] = useState(true);
  const {myLiquidity} = useStateToProps(base => {
    const {swap} = base;
    return {
      myLiquidity: swap.myLiquidity,
    };
  });
  const getAccountAssets = useCallback(
    (pair, callBack) => dispatch(swapActions.getAccountAssets(pair, callBack)),
    [dispatch],
  );
  useFocusEffect(
    useCallback(() => {
      upPullRefresh();
    }, [upPullRefresh]),
  );
  const renderItem = useCallback(({item}) => {
    const {reserveA, reserveB, symbolA, symbolB, balance, totalSupply} =
      item || {};
    const List = [
      {
        title: `${i18n.t('swap.pooled')} ${symbolA}:`,
        subtitle: swapUtils.getPoolToken(balance, totalSupply, reserveA),
      },
      {
        title: `${i18n.t('swap.pooled')} ${symbolB}:`,
        subtitle: swapUtils.getPoolToken(balance, totalSupply, reserveB),
      },
      {title: `${i18n.t('swap.myPoolTokens')}:`, subtitle: balance},
      {
        title: `${i18n.t('swap.myPoolShare')}:`,
        subtitle: swapUtils.getPoolShare(balance, totalSupply),
      },
    ];
    return (
      <Touchable activeOpacity={1} style={styles.itemBox}>
        <ListItem
          disabled
          // onPress={() => navigationService.navigate('PairDetails')}
          titleStyle={styles.itemTitleStyle}
          style={styles.listItemBox}
          subtitleStyle={styles.itemSubtitleStyle}
          title={item.symbolPair}
          rightElement={null}
          // subtitle={i18n.t('swap.more')}
        />
        {List.map((i, index) => {
          return (
            <ListItem
              disabled
              key={index}
              style={styles.listItemBox}
              {...i}
              rightElement={null}
            />
          );
        })}
        <View style={styles.toolBox}>
          <Touchable
            onPress={() =>
              navigationService.navigate('AddLiquidity', {pairData: item})
            }
            style={[styles.addTool, {backgroundColor: Colors.primaryColor}]}>
            <TextL style={styles.whiteText}>{i18n.t('swap.add')}</TextL>
          </Touchable>
          <Touchable
            onPress={() =>
              navigationService.navigate('RemoveLiquidity', {pairData: item})
            }
            style={styles.addTool}>
            <TextL>{i18n.t('swap.remove')}</TextL>
          </Touchable>
        </View>
      </Touchable>
    );
  }, []);
  const upPullRefresh = useCallback(() => {
    getAccountAssets(false, () => {
      list.current && list.current.endUpPullRefresh();
      list.current && list.current.endBottomRefresh();
    });
    setLoadCompleted(true);
  }, [getAccountAssets]);
  return (
    <ListComponent
      ref={list}
      bottomLoadTip={i18n.t('swap.loadMore')}
      message=" "
      showFooter={!loadCompleted}
      loadCompleted={loadCompleted}
      pointerEvents="box-none"
      renderItem={renderItem}
      upPullRefresh={upPullRefresh}
      data={myLiquidity}
    />
  );
};

export default memo(MeLiquidity);
