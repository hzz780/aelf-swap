import React, {memo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  Touchable,
  ActionSheet,
  CommonButton,
  CommonToast,
} from '../../../../components/template';
import {pTd} from '../../../../utils/common';
import {TextM} from '../../../../components/template/CommonText';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
const CreatePool = () => {
  const dispatch = useDispatch();
  const {allTokens, userBalances, pairs} = useStateToProps(base => {
    const {user, swap} = base;
    return {
      allTokens: user.allTokens,
      userBalances: user.userBalances,
      pairs: swap.pairs,
    };
  });
  const createPair = useCallback(
    symbolPair => dispatch(swapActions.createPair(symbolPair)),
    [dispatch],
  );
  const [state, setState] = useSetState({
    firstToken: '',
    secondToken: '',
  });
  const {firstToken, secondToken} = state;
  const onSelect = useCallback(
    item => {
      setState({[item.type]: item});
    },
    [setState],
  );
  const selectToken = useCallback(
    (token, type) => {
      const items = Array.isArray(allTokens)
        ? allTokens.map(item => {
            return {
              ...item,
              type,
              balance: userBalances[item.symbol] || '0',
              title: item.symbol,
              onPress: onSelect,
              disabled:
                firstToken?.symbol === item.symbol ||
                secondToken?.symbol === item.symbol,
            };
          })
        : [];
      let tokenName = i18n.t('swap.pleaseSelect');
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
          <TextM style={{color}}>{tokenName}</TextM>
          <Entypo size={pTd(30)} name="chevron-thin-down" />
        </Touchable>
      );
    },
    [allTokens, firstToken, onSelect, secondToken, userBalances],
  );
  // const tokenDetails = useMemo(() => {
  //   const List = [
  //     {title: i18n.t('swap.tokenName'), subtitle: firstToken?.symbol},
  //     {
  //       title: i18n.t('swap.totalSupply'),
  //       subtitle: `0.948835 ${firstToken?.symbol || ''}`,
  //     },
  //     {
  //       title: i18n.t('swap.circulatingSupply'),
  //       subtitle: `0.948835 ${firstToken?.symbol || ''}`,
  //     },
  //   ];
  //   return (
  //     <View style={styles.tokenDetailsBox}>
  //       {List.map((item, index) => {
  //         return (
  //           <View key={index} style={styles.tokenDetailsItemBox}>
  //             <TextL>{item.title}</TextL>
  //             <TextM style={styles.rightText}>{item.subtitle}</TextM>
  //           </View>
  //         );
  //       })}
  //     </View>
  //   );
  // }, [firstToken]);
  const onCreatePair = useCallback(() => {
    if (Array.isArray(pairs)) {
      if (
        pairs.find(item => {
          return (
            (item.symbolA === firstToken.symbol ||
              item.symbolA === secondToken.symbol) &&
            (item.symbolB === firstToken.symbol ||
              item.symbolB === secondToken.symbol)
          );
        })
      ) {
        CommonToast.fail(i18n.t('swap.pairExists'));
        return;
      } else {
        TransactionVerification.show(value => {
          if (!value) {
            return;
          }
          createPair(`${firstToken.symbol}-${secondToken.symbol}`);
        });
      }
    } else {
      TransactionVerification.show(value => {
        if (!value) {
          return;
        }
        createPair(`${firstToken.symbol}-${secondToken.symbol}`);
      });
    }
  }, [createPair, firstToken.symbol, pairs, secondToken.symbol]);
  return (
    <View style={GStyle.container}>
      <CommonHeader title={i18n.t('swap.createPool')} canBack />
      <View style={styles.container}>
        {selectToken(firstToken?.symbol, 'firstToken')}
        {/* {tokenDetails} */}
        {selectToken(secondToken?.symbol, 'secondToken')}
        <CommonButton
          disabled={!(firstToken?.symbol && secondToken?.symbol)}
          onPress={onCreatePair}
          title={i18n.t('swap.create')}
          style={styles.buttonStyles}
        />
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
