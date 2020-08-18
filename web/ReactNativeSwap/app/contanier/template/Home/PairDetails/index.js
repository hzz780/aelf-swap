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
      </View>
    </>
  );
});
const PairDetails = () => {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  const [loadCompleted, setLoadCompleted] = useState(true);
  const list = useRef();
  const renderHeader = useMemo(() => {
    return (
      <View>
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.overview')}
          </TextL>
        </View>
        <ListItem
          title={i18n.t('swap.liquidity')}
          subtitle="$ 234,123"
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          title={`${i18n.t('swap.fee')}(24h)`}
          subtitle="$ 234,123"
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          title={i18n.t('swap.pooledTokens')}
          subtitle="1,275,362 ELF"
          subtitleDetails="1,873 AEETH"
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
          subtitleDetailsStyle={styles.subtitleStyle}
        />
        <ListItem
          style={styles.preBox}
          title={'ELF'}
          subtitle="1,275,362 ELF/AEETH ($ 125.24)"
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          title={'AEETH'}
          subtitle="1,275,362 AEETH/ELF ($ 125.24)"
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <View style={styles.overviewBox}>
          <TextL style={{color: Colors.primaryColor}}>
            {i18n.t('swap.transactions')}
          </TextL>
        </View>
      </View>
    );
  }, []);
  const stickyHead = useCallback(() => {
    return (
      <ToolBar
        setIndex={i => {
          if (i === 1) {
            setData([]);
          } else {
            setData([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
          }
          setIndex(i);
        }}
        index={index}
      />
    );
  }, [index]);
  const renderItem = useCallback(() => {
    let leftTitle = i18n.t('swap.swap'),
      rigthTitle = i18n.t('swap.for');
    if (index === 1) {
      leftTitle = i18n.t('swap.add');
      rigthTitle = i18n.t('swap.and');
    } else if (index === 2) {
      leftTitle = i18n.t('swap.remove');
      rigthTitle = i18n.t('swap.and');
    }
    return (
      <View style={styles.itemBox}>
        <TextM style={{color: Colors.fontGray}}>
          {leftTitle}{' '}
          <TextL style={{color: Colors.fontBlack}}>10.1234 ELF</TextL>{' '}
          {rigthTitle}{' '}
          <TextL style={{color: Colors.fontBlack}}>1.2345 AEETH</TextL>
        </TextM>
        <TextS style={styles.timeStyle}>2020.08.15 12:30:00</TextS>
      </View>
    );
  }, [index]);
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
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={`ELF-AEETH ${i18n.t('swap.pair')}`} canBack />
      <SectionStickyList
        data={data}
        loadCompleted={loadCompleted}
        upPullRefresh={upPullRefresh}
        onEndReached={onEndReached}
        renderHeader={renderHeader}
        stickyHead={stickyHead}
        renderItem={renderItem}
        ref={list}
        showFooter
        allLoadedTips=" "
        listFooterHight={pTd(90)}
      />
      <View style={styles.bottomBox}>
        <Touchable
          onPress={() => navigationService.navigate('Swap')}
          style={[
            styles.toolBarItem,
            styles.bottomItem,
            {backgroundColor: Colors.primaryColor},
          ]}>
          <TextL style={styles.whiteColor}>{i18n.t('swap.swap')}</TextL>
        </Touchable>
        <Touchable
          onPress={() => navigationService.navigate('AddLiquidity')}
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
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
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
    paddingLeft: pTd(30),
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
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
});
