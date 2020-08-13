import i18n from 'i18n-js';
import React, {memo, useRef, useCallback, useState} from 'react';
import {
  CommonHeader,
  CommonButton,
  ListComponent,
  Touchable,
  ListItem,
} from '../../../components/template';
import {ScrollView, View, StyleSheet} from 'react-native';
import {useStateToProps} from '../../../utils/pages/hooks';
import {GStyle, Colors} from '../../../assets/theme';
import {TextM, TextL} from '../../../components/template/CommonText';
import {pTd} from '../../../utils/common';
import navigationService from '../../../utils/common/navigationService';
import {color} from 'react-native-reanimated';
let isActive = true;
const Home = () => {
  const list = useRef();
  const [loadCompleted, setLoadCompleted] = useState(true);
  useStateToProps(base => {
    const {settings} = base;
    return {
      language: settings.language,
    };
  });
  const onSetLoadCompleted = useCallback(value => {
    if (isActive) {
      setLoadCompleted(value);
    }
  }, []);
  const upPullRefresh = useCallback(() => {
    onSetLoadCompleted(true);
    list.current && list.current.endUpPullRefresh();
    list.current && list.current.endBottomRefresh();
  }, [onSetLoadCompleted]);
  const onEndReached = useCallback(() => {
    onSetLoadCompleted(true);
    list.current && list.current.endBottomRefresh();
  }, [onSetLoadCompleted]);
  const renderItem = useCallback(() => {
    return (
      <ListItem
        title={'ELF-AEETH'}
        subtitle="$ 234,123"
        rightElement={null}
        titleStyle={{color: Colors.primaryColor}}
        subtitleStyle={styles.subtitleStyle}
        onPress={() => navigationService.navigate('PairDetails')}
      />
    );
  }, []);
  return (
    <View style={GStyle.container}>
      <CommonHeader title={'Market'} />
      <ListItem
        style={styles.topBox}
        titleStyle={styles.topTitle}
        subtitleStyle={styles.topSubtitle}
        title={'Pair'}
        subtitle="Liquidity"
        rightElement={null}
      />
      <ListComponent
        ref={list}
        whetherAutomatic
        data={[1, 2]}
        bottomLoadTip={i18n.t('lottery.loadMore')}
        message=" "
        showFooter={!loadCompleted}
        loadCompleted={loadCompleted}
        renderItem={renderItem}
        upPullRefresh={upPullRefresh}
        onEndReached={onEndReached}
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
});
