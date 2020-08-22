import React, {memo, useCallback, useMemo, useState} from 'react';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  Input,
  CommonButton,
  ListItem,
} from '../../../../components/template';
import {View, StyleSheet} from 'react-native';
import {ChooseToken} from '../MAXComponent';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import {TextL, TextM} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import {bottomBarHeigth} from '../../../../utils/common/device';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useDispatch} from 'react-redux';
import config from '../../../../config';
import {useFocusEffect} from '@react-navigation/native';
import reduxUtils from '../../../../utils/pages/reduxUtils';
import unitConverter from '../../../../utils/pages/unitConverter';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
const RemoveLiquidity = props => {
  const dispatch = useDispatch();
  const [pairData, setPairData] = useState(props.route.params?.pairData || {});
  console.log(pairData, '=====pairData');
  const {
    symbolPair,
    balance,
    reserveA,
    reserveB,
    symbolA,
    symbolB,
    totalSupply,
  } = pairData;
  const [state, setState] = useSetState({
    inputS: '',
    inputA: '',
    inputB: '',
  });
  const getAccountAssets = useCallback(
    (pair, callBack) => dispatch(swapActions.getAccountAssets(pair, callBack)),
    [dispatch],
  );
  const removeLiquidity = useCallback(
    data => dispatch(swapActions.removeLiquidity(data)),
    [dispatch],
  );
  const {inputA, inputB, inputS} = state;
  const {tokenUSD} = useStateToProps(base => {
    const {user, swap} = base;
    return {
      tokenUSD: user.tokenUSD,
    };
  });
  useFocusEffect(
    useCallback(() => {
      getAccountAssets(symbolPair, (code, v) => {
        if (code === 1) {
          setPairData(v);
        }
      });
    }, [getAccountAssets, symbolPair]),
  );
  const rightElement = useCallback((item, type, hideMax) => {
    const {token} = item;
    if (token) {
      return (
        <View style={styles.rightBox}>
          {/* {hideMax ? null : (
              <MAXComponent
                onPress={() => {
                  setState({[type]: {...item, input: item.balance}});
                }}
              />
            )} */}
          <TextL>
            {token}
            {/* <Entypo size={pTd(30)} name="chevron-thin-down" /> */}
          </TextL>
        </View>
      );
    }
    return <ChooseToken />;
  }, []);
  const inputItem = useMemo(() => {
    return (
      <View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.input')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {balance}
          </TextM>
        </View>
        <Input
          keyboardType="numeric"
          value={inputS}
          onChangeText={v => {
            setState({
              inputS: v,
              inputA: swapUtils.getPoolToken(v, totalSupply, reserveA),
              inputB: swapUtils.getPoolToken(v, totalSupply, reserveB),
            });
          }}
          style={styles.inputStyle}
          rightElement={<TextL>{symbolPair}</TextL>}
          placeholder="0.0"
        />
      </View>
    );
  }, [balance, inputS, reserveA, reserveB, setState, symbolPair, totalSupply]);
  const firstItem = useMemo(() => {
    return (
      <View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.output')}</TextM>
          {/* <TextM>
            {i18n.t('mineModule.balance')}: {reserveA}
          </TextM> */}
        </View>
        <Input
          keyboardType="numeric"
          value={inputA}
          onChangeText={v => {
            setState({
              inputA: v,
              inputS: swapUtils.getPoolToken(v, reserveA, totalSupply),
              inputB: swapUtils.getPoolToken(v, reserveA, reserveB),
            });
          }}
          style={styles.inputStyle}
          rightElement={<TextL>{symbolA}</TextL>}
          placeholder="0.0"
        />
      </View>
    );
  }, [inputA, reserveA, reserveB, setState, symbolA, totalSupply]);
  const secondItem = useMemo(() => {
    return (
      <View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.output')}</TextM>
          {/* <TextM>
            {i18n.t('mineModule.balance')}: {reserveB}
          </TextM> */}
        </View>
        <Input
          keyboardType="numeric"
          value={inputB}
          onChangeText={v => {
            setState({
              inputB: v,
              inputS: swapUtils.getPoolToken(v, reserveB, totalSupply),
              inputA: swapUtils.getPoolToken(v, reserveB, reserveA),
            });
          }}
          style={styles.inputStyle}
          rightElement={<TextL>{symbolB}</TextL>}
          placeholder="0.0"
        />
      </View>
    );
  }, [inputB, symbolB, setState, reserveB, totalSupply, reserveA]);
  const onRemove = useCallback(() => {
    TransactionVerification.show(value => {
      if (!value) {
        return;
      }
      const amountAMin = reduxUtils.getDecimalTokenHigher(inputA, symbolA);
      const amountBMin = reduxUtils.getDecimalTokenHigher(inputB, symbolB);
      const data = {
        symbolA,
        symbolB,
        liquidityRemove: unitConverter.toDecimalHigher(inputS),
        amountAMin: swapUtils.getSwapMinFloat(amountAMin),
        amountBMin: swapUtils.getSwapMinFloat(amountBMin),
        deadline: swapUtils.getDeadline(),
      };
      removeLiquidity(data);
    });
  }, [inputA, inputB, inputS, removeLiquidity, symbolA, symbolB]);
  const remove = useMemo(() => {
    let disabled = true;
    if (inputS <= balance && inputA && inputB) {
      disabled = false;
    }
    return (
      <>
        <CommonButton
          disabled={disabled}
          onPress={onRemove}
          title={i18n.t('swap.removeLiquidity')}
          style={styles.buttonStyles}
        />
      </>
    );
  }, [balance, inputA, inputB, inputS, onRemove]);
  const secondTip = useMemo(() => {
    return (
      <TextM style={styles.grayColor}>{i18n.t('swap.addSecondTip')}</TextM>
    );
  }, []);
  const prices = useMemo(() => {
    return (
      <>
        <TextL style={[styles.themeColor, styles.mrginText]}>
          {i18n.t('swap.price')}
        </TextL>
        <View style={[styles.splitLine]} />
        <ListItem
          disabled
          title={symbolA}
          style={styles.itemBox}
          subtitle={`≈ ${swapUtils.detailsPrice(
            reserveA,
            reserveB,
          )} ${symbolB} ($ ${swapUtils.getUSD(symbolA, tokenUSD)})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
        <ListItem
          disabled
          title={symbolB}
          style={styles.itemBox}
          subtitle={`≈ ${swapUtils.detailsPrice(
            reserveB,
            reserveA,
          )} ${symbolA} ($ ${swapUtils.getUSD(symbolB, tokenUSD)})`}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
      </>
    );
  }, [reserveA, reserveB, symbolA, symbolB, tokenUSD]);
  const willReceive = useMemo(() => {
    return (
      <>
        <TextL style={[styles.themeColor, styles.mrginText]}>
          {i18n.t('swap.willRemove')}
        </TextL>
        <View style={[styles.splitLine]} />
        <ListItem
          disabled
          title={i18n.t('swap.sharePool')}
          style={styles.itemBox}
          subtitle={swapUtils.getPoolShare(inputS, balance)}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
      </>
    );
  }, [balance, inputS]);
  const myLiquidity = useMemo(() => {
    const List = [
      {title: `${i18n.t('swap.pooled')} ELF:`, subtitle: '0.948835'},
      {title: `${i18n.t('swap.pooled')} AEETH:`, subtitle: '0.948835'},
      {title: `${i18n.t('swap.myPoolTokens')}:`, subtitle: '0.948835'},
      {title: `${i18n.t('swap.myPoolShare')}:`, subtitle: '0.2%'},
    ];
    return (
      <View style={styles.myLiquidity}>
        <TextL style={styles.themeColor}>{i18n.t('swap.myLiquidity')}</TextL>
        {List.map((item, index) => {
          return (
            <View key={index} style={styles.myLiquidityItemBox}>
              <TextM>{item.title}</TextM>
              <TextM style={styles.rightText}>{item.subtitle}</TextM>
            </View>
          );
        })}
      </View>
    );
  }, []);
  const upPullRefresh = useCallback(
    callBack => {
      getAccountAssets(symbolPair, (code, v) => {
        if (code === 1) {
          setPairData(v);
        }
        callBack && callBack();
      });
    },
    [getAccountAssets, symbolPair],
  );
  return (
    <View style={GStyle.container}>
      <CommonHeader
        scrollViewProps={{upPullRefresh}}
        title={i18n.t('swap.removeLiquidity')}
        canBack>
        <View style={styles.container}>
          {inputItem}
          {firstItem}
          {secondItem}
          {prices}
          {willReceive}
          {secondTip}
          {remove}
          {/* {myLiquidity} */}
        </View>
      </CommonHeader>
    </View>
  );
};

export default memo(RemoveLiquidity);

const styles = StyleSheet.create({
  inputStyle: {
    paddingHorizontal: 0,
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: pTd(50),
  },
  inputTitleBox: {
    marginTop: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyles: {
    marginTop: pTd(30),
  },
  tipText: {
    marginTop: pTd(10),
    alignSelf: 'center',
  },
  themeColor: {
    color: Colors.primaryColor,
  },
  redColor: {
    marginTop: pTd(30),
    color: 'red',
  },
  mrginText: {
    marginVertical: pTd(15),
  },
  splitLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  subtitleStyle: {
    fontSize: pTd(28),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
  itemBox: {
    paddingHorizontal: 0,
  },
  grayColor: {
    color: Colors.fontGray,
    paddingTop: pTd(30),
  },
  myLiquidity: {
    marginTop: pTd(20),
    backgroundColor: '#e5e5e5',
    padding: pTd(20),
    borderRadius: pTd(15),
    marginBottom: pTd(30) + bottomBarHeigth,
  },
  myLiquidityItemBox: {
    marginTop: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightText: {
    flex: 1,
    textAlign: 'right',
  },
});
