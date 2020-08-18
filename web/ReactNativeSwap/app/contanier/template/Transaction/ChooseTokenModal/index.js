import React, {memo, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {pTd} from '../../../../utils/common';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GStyle, Colors} from '../../../../assets/theme';
import {OverlayModal, Touchable} from '../../../../components/template';
import {TextL, TextM} from '../../../../components/template/CommonText';
import {useSetState} from '../../../../utils/pages/hooks';
import {ScrollView} from 'react-native-gesture-handler';
const arrowSize = pTd(9);
import i18n from 'i18n-js';
const arrowStyle = {
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
  borderLeftWidth: arrowSize,
  borderRightWidth: arrowSize,
};
const sortList = (Arr, rise) => {
  let list = [];
  if (Array.isArray(Arr)) {
    list = [...Arr];
    list.sort((a, b) => {
      return rise ? a.balance - b.balance : b.balance - a.balance;
    });
  }
  return list;
};
const Components = memo(props => {
  const {tokenList, onPress} = props;
  const [state, setState] = useSetState({
    list: [],
    rise: false,
  });
  const {list, rise} = state;
  useEffect(() => {
    setState({list: sortList(tokenList, rise)});
  }, [rise, setState, tokenList]);
  return (
    <View style={[GStyle.container, styles.chooseTokenModal]}>
      <View style={styles.titleBox}>
        <TextL>{i18n.t('swap.select')} Token</TextL>
        <AntDesign
          color={Colors.fontGray}
          size={pTd(40)}
          name="close"
          onPress={() => OverlayModal.hide()}
        />
      </View>
      <View style={styles.listHead}>
        <TextM style={{color: Colors.fontGray}}>Token</TextM>
        <Touchable
          onPress={() => setState({rise: !rise})}
          style={styles.balanceBox}>
          <TextM style={{color: Colors.fontGray}}>
            {i18n.t('mineModule.balance')}
          </TextM>
          <View style={styles.arrowBox}>
            <View
              style={[
                styles.upArrow,
                rise && {borderBottomColor: Colors.primaryColor},
              ]}
            />
            <View
              style={[
                styles.downArrow,
                !rise && {borderTopColor: Colors.primaryColor},
              ]}
            />
          </View>
        </Touchable>
      </View>
      <ScrollView>
        <View>
          {list.map((item, index) => {
            return (
              <Touchable
                onPress={() => {
                  OverlayModal.hide();
                  onPress(item);
                }}
                key={index}
                style={styles.itemBox}>
                <TextL>{item.token}</TextL>
                <TextL>{item.balance}</TextL>
              </Touchable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
});
const show = props => {
  OverlayModal.show(<Components {...props} />, {
    style: styles.bgStyle,
    containerStyle: styles.containerStyle,
  });
};

export default {show};
const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'column-reverse',
  },
  containerStyle: {
    height: '60%',
  },
  chooseTokenModal: {
    borderTopRightRadius: pTd(50),
    borderTopLeftRadius: pTd(50),
    paddingHorizontal: pTd(50),
    paddingTop: pTd(50),
  },
  titleBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listHead: {
    paddingVertical: pTd(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  itemBox: {
    paddingVertical: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  upArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopColor: 'transparent', //下箭头颜色
    borderBottomColor: Colors.fontGray, //上箭头颜色
    marginBottom: pTd(5),
    borderBottomWidth: arrowSize,
    ...arrowStyle,
  },
  downArrow: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopColor: Colors.fontGray, //下箭头颜色
    borderBottomColor: 'transparent', //上箭头颜色
    borderTopWidth: arrowSize,
    ...arrowStyle,
  },
  arrowBox: {
    marginLeft: pTd(5),
  },
  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
