import React, {memo, useCallback, useMemo, useState} from 'react';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  Input,
  CommonButton,
  ListItem,
} from '../../../../components/template';
import {View, StyleSheet} from 'react-native';
import {MAXComponent} from '../MAXComponent';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import {TextL, TextM} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import {bottomBarHeight} from '../../../../utils/common/device';
import i18n from 'i18n-js';
import swapActions from '../../../../redux/swapRedux';
import swapUtils from '../../../../utils/pages/swapUtils';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import reduxUtils from '../../../../utils/pages/reduxUtils';
import unitConverter from '../../../../utils/pages/unitConverter';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
import MySingleLiquidity from '../MySingleLiquidity';
const RemoveLiquidity = props => {
  const dispatch = useDispatch();
  const [pairData, setPairData] = useState(props.route.params?.pairData || {});
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
    const {user} = base;
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
  const rightElement = useCallback(
    symbol => {
      const sBalance = String(balance);
      return (
        <View style={styles.rightBox}>
          {inputS === sBalance ? null : (
            <MAXComponent
              onPress={() => {
                setState({
                  inputS: sBalance,
                  inputA: swapUtils.getPoolToken(
                    balance,
                    totalSupply,
                    reserveA,
                    reduxUtils.getTokenDecimals(symbolA),
                  ),
                  inputB: swapUtils.getPoolToken(
                    balance,
                    totalSupply,
                    reserveB,
                    reduxUtils.getTokenDecimals(symbolB),
                  ),
                });
              }}
            />
          )}
          <TextM>{symbol}</TextM>
        </View>
      );
    },
    [
      balance,
      inputS,
      reserveA,
      reserveB,
      setState,
      symbolA,
      symbolB,
      totalSupply,
    ],
  );
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
              inputA: swapUtils.getPoolToken(
                v,
                totalSupply,
                reserveA,
                reduxUtils.getTokenDecimals(symbolA),
              ),
              inputB: swapUtils.getPoolToken(
                v,
                totalSupply,
                reserveB,
                reduxUtils.getTokenDecimals(symbolB),
              ),
            });
          }}
          style={styles.inputStyle}
          rightElement={rightElement(symbolPair)}
          placeholder="0.0"
        />
      </View>
    );
  }, [
    balance,
    inputS,
    reserveA,
    reserveB,
    rightElement,
    setState,
    symbolA,
    symbolB,
    symbolPair,
    totalSupply,
  ]);
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
          decimals={reduxUtils.getTokenDecimals(symbolA)}
          value={inputA}
          onChangeText={v => {
            setState({
              inputA: v,
              inputS: swapUtils.getPoolToken(v, reserveA, totalSupply),
              inputB: swapUtils.getPoolToken(
                v,
                reserveA,
                reserveB,
                reduxUtils.getTokenDecimals(symbolB),
              ),
            });
          }}
          style={styles.inputStyle}
          rightElement={rightElement(symbolA)}
          placeholder="0.0"
        />
      </View>
    );
  }, [
    inputA,
    reserveA,
    reserveB,
    rightElement,
    setState,
    symbolA,
    symbolB,
    totalSupply,
  ]);
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
          decimals={reduxUtils.getTokenDecimals(symbolB)}
          keyboardType="numeric"
          value={inputB}
          onChangeText={v => {
            setState({
              inputB: v,
              inputS: swapUtils.getPoolToken(v, reserveB, totalSupply),
              inputA: swapUtils.getPoolToken(
                v,
                reserveB,
                reserveA,
                reduxUtils.getTokenDecimals(symbolA),
              ),
            });
          }}
          style={styles.inputStyle}
          rightElement={rightElement(symbolB)}
          placeholder="0.0"
        />
      </View>
    );
  }, [
    symbolB,
    inputB,
    rightElement,
    setState,
    reserveB,
    totalSupply,
    reserveA,
    symbolA,
  ]);
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
    if (
      inputS <= balance &&
      inputA &&
      inputB &&
      inputA > 0 &&
      inputB > 0 &&
      inputS > 0
    ) {
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
        <ListItem
          disabled
          title={i18n.t('swap.sharePool')}
          style={styles.itemBox}
          subtitle={swapUtils.getPoolShare(inputS, totalSupply)}
          rightElement={null}
          subtitleStyle={styles.subtitleStyle}
        />
      </>
    );
  }, [inputS, totalSupply]);
  const myLiquidity = useMemo(() => {
    return <MySingleLiquidity pair={pairData} />;
  }, [pairData]);
  const upPullRefresh = useCallback(
    callBack => {
      getAccountAssets(symbolPair, (code, v) => {
        if (code === 1) {
          setPairData(v);
        }
        callBack?.();
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
          {myLiquidity}
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
    marginTop: pTd(40),
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
    minHeight: 0,
    paddingHorizontal: 0,
    borderBottomWidth: 0,
    paddingVertical: pTd(10),
  },
  grayColor: {
    color: Colors.fontGray,
    paddingTop: pTd(10),
  },
  myLiquidity: {
    marginTop: pTd(20),
    backgroundColor: '#e5e5e5',
    padding: pTd(20),
    borderRadius: pTd(15),
    marginBottom: pTd(30) + bottomBarHeight,
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
