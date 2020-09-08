/* eslint-disable react-hooks/exhaustive-deps */
import React, {memo, useMemo, useCallback, useEffect} from 'react';
import {View, StyleSheet, Keyboard, DeviceEventEmitter} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  Input,
  CommonButton,
  CommonToast,
  KeyboardScrollView,
  Touchable,
} from '../../../../components/template';
import {TextM, TextL} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import ChooseTokenModal from '../ChooseTokenModal';
import {MAXComponent, ChooseToken} from '../MAXComponent';
import i18n from 'i18n-js';
import swapUtils from '../../../../utils/pages/swapUtils';
import config from '../../../../config';
import {useDispatch} from 'react-redux';
import swapActions from '../../../../redux/swapRedux';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
import reduxUtils from '../../../../utils/pages/reduxUtils';
const defaultState = {
  conversion: false,
  tType: '',
  swapToken: {
    input: '',
    token: '',
  },
  toSwapToken: {
    input: '',
    token: '',
  },
};
const {swapFloat} = config;
const Swap = props => {
  const dispatch = useDispatch();
  const dispatchSwapToken = useCallback(
    (data, callBack) => dispatch(swapActions.swapToken(data, callBack)),
    [dispatch],
  );
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('SWAP_DATA', pair => {
      getPItem(pair);
    });
    return () => {
      subscription.remove();
    };
  }, [getPItem]);
  const {language, pairs, userBalances} = useStateToProps(base => {
    const {settings, swap, user} = base;
    return {
      language: settings.language,
      pairs: swap.pairs,
      userBalances: user.userBalances,
    };
  });
  const {pairData} = props.route.params || {};
  const [state, setState] = useSetState({
    conversion: false,
    tType: '',
    swapToken: {
      input: '',
      token: pairData?.symbolA,
    },
    toSwapToken: {
      input: '',
      token: pairData?.symbolB,
    },
  });
  const {swapToken, toSwapToken, tType, conversion} = state;
  const swapBalance = userBalances[(swapToken?.token)] || 0;
  const toSwapBalance = userBalances[(toSwapToken?.token)] || 0;
  const currentPair = swapUtils.getPair(swapToken, toSwapToken, pairs);
  const onModal = useCallback(
    (item, type) => {
      let obj = {[type]: item};
      if (type === 'swapToken' && toSwapToken?.token) {
        if (toSwapToken.token === item.token) {
          obj = {
            ...obj,
            toSwapToken: {
              input: '',
              token: '',
            },
          };
        } else if (toSwapToken?.input) {
          const Pair = swapUtils.getPair(item, toSwapToken, pairs);
          const t = swapUtils.getInInput(
            item?.token,
            toSwapToken?.token,
            Pair,
            toSwapToken?.input,
            reduxUtils.getTokenDecimals(item?.token),
          );
          obj = {
            swapToken: {
              ...item,
              input: t,
            },
          };
        }
      } else if (swapToken?.token) {
        if (swapToken.token === item.token) {
          obj = {
            ...obj,
            swapToken: {
              input: '',
              token: '',
            },
          };
        } else if (swapToken?.input) {
          const Pair = swapUtils.getPair(swapToken, item, pairs);
          const t = swapUtils.getOutInput(
            swapToken?.token,
            item?.token,
            Pair,
            swapToken?.input,
            reduxUtils.getTokenDecimals(item?.token),
          );
          obj = {
            toSwapToken: {
              ...item,
              input: t,
            },
          };
        }
      }
      setState(obj);
    },
    [pairs, setState, swapToken, toSwapToken],
  );
  const showTokenModal = useCallback(
    type => {
      const tokenList = swapUtils.getTokenList(pairs, userBalances);
      ChooseTokenModal.show({
        tokenList,
        onPress: item => onModal(item, type),
      });
    },
    [pairs, userBalances, onModal],
  );
  const getPItem = useCallback(
    pair => {
      if (pair) {
        setState({
          swapToken: {
            input: '',
            token: pair.symbolA,
          },
          toSwapToken: {
            input: '',
            token: pair.symbolB,
          },
        });
      }
    },
    [setState],
  );
  const rightElement = useCallback(
    (item, type, hideMax) => {
      const {token} = item;
      if (token) {
        return (
          <View style={styles.rightBox}>
            {hideMax ? null : (
              <MAXComponent
                onPress={() => {
                  let obj = {};
                  let t;
                  if (currentPair) {
                    t = swapUtils.getOutInput(
                      swapToken?.token,
                      toSwapToken?.token,
                      currentPair,
                      item.balance,
                      reduxUtils.getTokenDecimals(toSwapToken?.token),
                    );
                    obj = {
                      ...obj,
                      [type]: {...item, input: item.balance},
                      toSwapToken: {
                        ...toSwapToken,
                        input: t,
                      },
                    };
                  } else {
                    obj = {...obj, [type]: {...item, input: item.balance}};
                  }
                  obj = {
                    ...obj,
                    tType: type,
                  };
                  setState(obj);
                }}
              />
            )}
            <TextM
              onPress={() => {
                showTokenModal(type);
              }}>
              {token} <Entypo size={pTd(30)} name="chevron-thin-down" />
            </TextM>
          </View>
        );
      }
      return (
        <ChooseToken
          onPress={() => {
            showTokenModal(type);
          }}
        />
      );
    },
    [currentPair, setState, showTokenModal, swapToken, toSwapToken],
  );
  const Description = useMemo(() => {
    let color = 'green';
    return (
      <View style={styles.descriptionBox}>
        {tType === 'swapToken' ? (
          <View style={styles.inputTitleBox}>
            <TextM>{i18n.t('swap.minimumReceived')}</TextM>
            <TextM style={styles.rightText}>
              {swapUtils.getSold(toSwapToken?.input, 1 - swapFloat)}
            </TextM>
          </View>
        ) : (
          <View style={styles.inputTitleBox}>
            <TextM>{i18n.t('swap.maximumSold')}</TextM>
            <TextM style={styles.rightText}>
              {swapUtils.getSold(swapToken?.input, 1 + swapFloat)}
            </TextM>
          </View>
        )}
        {/* <View style={styles.inputTitleBox}>
          {tType === 'swapToken' ? (
            <TextM>{i18n.t('swap.maximumSold')}</TextM>
          ) : (
            <TextM>{'Minimum received'}</TextM>
          )}
          <TextM style={styles.rightText}>
            {swapUtils.getSold(swapToken?.input, 1 + swapFloat)}
          </TextM>
        </View> */}
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.priceImpact')}</TextM>
          <TextM style={[styles.rightText, {color}]}>-</TextM>
        </View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.liquidityProviderFee')}</TextM>
          <TextM style={styles.rightText}>
            {swapUtils.getSwapFee(swapToken?.input)} {swapToken?.token}
          </TextM>
        </View>
      </View>
    );
  }, [language, swapToken, tType, toSwapToken]);
  const onChangeSwap = useCallback(
    v => {
      let obj = {};
      let t;
      if (currentPair) {
        t = swapUtils.getOutInput(
          swapToken?.token,
          toSwapToken?.token,
          currentPair,
          v,
          reduxUtils.getTokenDecimals(toSwapToken?.token),
        );
        obj = {
          ...obj,
          swapToken: {...swapToken, input: v},
          toSwapToken: {
            ...toSwapToken,
            input: t,
          },
        };
      } else {
        obj = {...obj, swapToken: {...swapToken, input: v}};
      }
      obj = {
        ...obj,
        tType: 'swapToken',
      };
      setState(obj);
    },
    [currentPair, setState, swapToken, toSwapToken],
  );
  const SwapItem = useMemo(() => {
    return (
      <View style={styles.inputItem}>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.swap')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {swapBalance}
          </TextM>
        </View>
        <Input
          keyboardType="numeric"
          decimals={reduxUtils.getTokenDecimals(swapToken?.token)}
          value={swapToken?.input}
          onChangeText={onChangeSwap}
          style={styles.inputStyle}
          rightElement={rightElement(
            {...swapToken, balance: String(swapBalance)},
            'swapToken',
          )}
          placeholder="0.0"
        />
      </View>
    );
  }, [language, swapBalance, swapToken, onChangeSwap, rightElement]);
  const onChangeToSwap = useCallback(
    v => {
      let obj = {};
      if (v > swapUtils.getCurrentReserve(toSwapToken?.token, currentPair)) {
        obj = {
          ...obj,
          toSwapToken: {
            ...toSwapToken,
            input: v,
          },
          swapToken: {
            ...swapToken,
            input: '',
          },
        };
      } else {
        if (currentPair) {
          obj = {
            ...obj,
            toSwapToken: {...toSwapToken, input: v},
            swapToken: {
              ...swapToken,
              input: swapUtils.getInInput(
                swapToken?.token,
                toSwapToken?.token,
                currentPair,
                v,
                reduxUtils.getTokenDecimals(swapToken?.token),
              ),
            },
          };
        } else {
          obj = {toSwapToken: {...toSwapToken, input: v}};
        }
      }
      obj = {
        ...obj,
        tType: 'toSwapToken',
      };
      setState(obj);
    },
    [currentPair, setState, swapToken, toSwapToken],
  );
  const PriceMemo = useMemo(() => {
    let f = swapToken,
      s = toSwapToken;
    if (conversion) {
      f = toSwapToken;
      s = swapToken;
    }
    return (
      <View style={styles.inputTitleBox}>
        <TextM>{i18n.t('swap.price')}</TextM>
        <TextM
          onPress={() => {
            setState({conversion: !conversion});
          }}>
          {swapUtils.getAmoun(
            swapUtils.getCurrentReserve(f?.token, currentPair),
            swapUtils.getCurrentReserve(s?.token, currentPair),
          )}
          {f?.token} / {s?.token}{' '}
          <Entypo name="swap" size={pTd(30)} color={Colors.primaryColor} />
        </TextM>
      </View>
    );
  }, [language, swapToken, toSwapToken, conversion, currentPair, setState]);
  const ToSwapItem = useMemo(() => {
    return (
      <View style={styles.inputItem}>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.take')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {toSwapBalance}
          </TextM>
        </View>
        <Input
          keyboardType="numeric"
          decimals={reduxUtils.getTokenDecimals(toSwapToken?.token)}
          value={toSwapToken?.input}
          onChangeText={onChangeToSwap}
          style={styles.inputStyle}
          rightElement={rightElement(
            {...toSwapToken, balance: String(toSwapBalance)},
            'toSwapToken',
            true,
          )}
          placeholder="0.0"
        />
        {PriceMemo}
      </View>
    );
  }, [
    language,
    toSwapBalance,
    toSwapToken,
    onChangeToSwap,
    rightElement,
    PriceMemo,
  ]);
  let disabled = true;
  if (
    swapUtils.judgmentToken({
      ...swapToken,
      balance: swapBalance,
    }) &&
    toSwapToken?.input &&
    toSwapToken?.input > 0
  ) {
    disabled = false;
  }
  const onSwap = useCallback(() => {
    if (
      swapUtils.judgmentToken({
        ...swapToken,
        balance: swapBalance,
      })
    ) {
      TransactionVerification.show(value => {
        if (!value) {
          return;
        }
        let obj = {
          symbolIn: swapToken?.token,
          symbolOut: toSwapToken?.token,
          deadline: swapUtils.getDeadline(),
        };
        if (tType === 'swapToken') {
          const amountIn = reduxUtils.getDecimalTokenHigher(
            swapToken?.input,
            swapToken?.token,
          );
          const amountOutMin = reduxUtils.getDecimalTokenHigher(
            swapUtils.getSold(toSwapToken?.input, 1 - swapFloat),
            toSwapToken?.token,
          );
          obj = {
            ...obj,
            amountIn,
            amountOutMin,
          };
        } else {
          const amountOut = reduxUtils.getDecimalTokenHigher(
            toSwapToken?.input,
            toSwapToken?.token,
          );
          const amountInMax = reduxUtils.getDecimalTokenHigher(
            swapUtils.getSold(swapToken?.input, 1 + swapFloat),
            swapToken?.token,
          );
          obj = {
            ...obj,
            amountOut,
            amountInMax,
          };
        }
        dispatchSwapToken(obj, () => {
          setState(defaultState);
        });
      });
    } else {
      CommonToast.fail(i18n.t('swap.inputError'));
    }
  }, [dispatchSwapToken, setState, swapBalance, swapToken, tType, toSwapToken]);
  const upPullRefresh = useCallback(
    callBack => {
      getPairs(undefined, () => {
        callBack && callBack();
      });
    },
    [getPairs],
  );
  return (
    <View style={GStyle.container}>
      <KeyboardScrollView upPullRefresh={upPullRefresh}>
        <Touchable
          onPress={() => Keyboard.dismiss()}
          activeOpacity={1}
          style={GStyle.container}>
          {SwapItem}
          {ToSwapItem}
          <CommonButton
            disabled={disabled}
            onPress={onSwap}
            title={
              currentPair &&
              Number(toSwapToken?.input) >
                Number(
                  swapUtils.getCurrentReserve(toSwapToken?.token, currentPair),
                )
                ? i18n.t('swap.insufficientLiquidity')
                : i18n.t('swap.swap')
            }
            style={styles.buttonStyles}
          />
          {Description}
        </Touchable>
      </KeyboardScrollView>
    </View>
  );
};

export default memo(Swap);

const styles = StyleSheet.create({
  inputItem: {
    paddingHorizontal: pTd(50),
  },
  inputTitleBox: {
    marginTop: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputStyle: {
    paddingHorizontal: 0,
  },
  buttonStyles: {
    marginTop: pTd(50),
  },
  descriptionBox: {
    marginTop: pTd(30),
    paddingHorizontal: pTd(50),
  },
  rightText: {
    flex: 1,
    textAlign: 'right',
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
