import React, {memo, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  Touchable,
  ActionSheet,
  CommonButton,
} from '../../../../components/template';
import {pTd} from '../../../../utils/common';
import {TextL, TextM} from '../../../../components/template/CommonText';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSetState} from '../../../../utils/pages/hooks';
import i18n from 'i18n-js';
const tokenList = [
  {token: 'ELF', balance: '234.123'},
  {token: 'BLF', balance: '204.123'},
  {token: 'CLF', balance: '2394.123'},
  {token: 'ALF', balance: '2341.123'},
];
const CreatePool = () => {
  const [state, setState] = useSetState({
    firstToken: '',
    secondToken: '',
  });
  const {firstToken, secondToken} = state;
  const onSelect = useCallback(
    item => {
      setState({[item.type]: item.token});
    },
    [setState],
  );
  const selectToken = useCallback(
    (token, type) => {
      const items = tokenList.map(item => ({
        ...item,
        type,
        title: item.token,
        onPress: onSelect,
      }));
      let tokenName = 'Please Select';
      let color = Colors.fontGray;
      if (token) {
        tokenName = token;
        color = Colors.fontBlack;
      }
      return (
        <Touchable
          onPress={() => {
            ActionSheet.show(items, {title: i18n.t('cancel')});
          }}
          style={styles.selectBox}>
          <TextL style={{color}}>{tokenName}</TextL>
          <Entypo size={pTd(30)} name="chevron-thin-down" />
        </Touchable>
      );
    },
    [onSelect],
  );
  const tokenDetails = useMemo(() => {
    const List = [
      {title: 'Token Name:', subtitle: firstToken},
      {title: 'Total Supply:', subtitle: `0.948835 ${firstToken}`},
      {title: 'Circulating Supply:', subtitle: `0.948835 ${firstToken}`},
    ];
    return (
      <View style={styles.tokenDetailsBox}>
        {List.map((item, index) => {
          return (
            <View key={index} style={styles.tokenDetailsItemBox}>
              <TextL>{item.title}</TextL>
              <TextM style={styles.rightText}>{item.subtitle}</TextM>
            </View>
          );
        })}
      </View>
    );
  }, [firstToken]);
  return (
    <View style={GStyle.container}>
      <CommonHeader title="Create Pool" canBack />
      <View style={styles.container}>
        {selectToken(firstToken, 'firstToken')}
        {tokenDetails}
        {selectToken(secondToken, 'secondToken')}
        <CommonButton title="Create" style={styles.buttonStyles} />
      </View>
    </View>
  );
};

export default memo(CreatePool);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: pTd(30),
    paddingHorizontal: pTd(30),
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: pTd(25),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    alignItems: 'center',
  },
  tokenDetailsBox: {
    marginTop: pTd(20),
    marginBottom: pTd(50),
  },
  tokenDetailsItemBox: {
    marginTop: pTd(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightText: {
    flex: 1,
    textAlign: 'right',
  },
  buttonStyles: {
    marginTop: pTd(50),
  },
});
