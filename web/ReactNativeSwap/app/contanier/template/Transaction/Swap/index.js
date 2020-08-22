/* eslint-disable react-hooks/exhaustive-deps */
import React, {memo, useMemo, useCallback} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
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
  tType: '',
  swapToken: {
    input: '',
    token: '',
    balance: '0',
  },
  toSwapToken: {
    input: '',
    token: '',
    balance: '0',
  },
};
const {swapFloat} = config;
const Swap = () => {
  const dispatch = useDispatch();
  const dispatchSwapToken = useCallback(
    (data, callBack) => dispatch(swapActions.swapToken(data, callBack)),
    [dispatch],
  );
  const getPairs = useCallback(
    (pair, callBack) => dispatch(swapActions.getPairs(pair, callBack)),
    [dispatch],
  );
  const {language, pairs, userBalances} = useStateToProps(base => {
    const {settings, swap, user} = base;
    return {
      language: settings.language,
      pairs: swap.pairs,
      userBalances: user.userBalances,
    };
  });
  const [state, setState] = useSetState(defaultState);
  const {swapToken, toSwapToken, tType} = state;
  const onModal = useCallback(
    (item, type) => {
      let obj = {[type]: item};
      if (type === 'swapToken' && toSwapToken?.token) {
        const {rA, rB} = swapUtils.getReserve(item, toSwapToken, pairs);
        obj = {
          ...obj,
          swapToken: {
            ...item,
            reserve: rA,
          },
          toSwapToken: {
            ...toSwapToken,
            reserve: rB,
          },
        };
      } else if (swapToken?.token) {
        const {rA, rB} = swapUtils.getReserve(item, swapToken, pairs);
        obj = {
          ...obj,
          toSwapToken: {
            ...item,
            reserve: rA,
          },
          swapToken: {
            ...swapToken,
            reserve: rB,
          },
        };
      }
      setState(obj);
    },
    [pairs, setState, swapToken, toSwapToken],
  );
  const showTokenModal = useCallback(
    type => {
      const tokenList = swapUtils.getTokenList(
        pairs,
        userBalances,
        type,
        type === 'swapToken' ? toSwapToken : swapToken,
      );
      ChooseTokenModal.show({
        tokenList,
        onPress: item => onModal(item, type),
      });
    },
    [pairs, userBalances, toSwapToken, swapToken, onModal],
  );
  const NonInitial = swapToken?.reserve && toSwapToken?.reserve;
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
                  if (NonInitial) {
                    t = swapUtils.getOutInput(
                      swapToken?.reserve,
                      toSwapToken?.reserve,
                      item.balance,
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
            <TextL
              onPress={() => {
                showTokenModal(type);
              }}>
              {token} <Entypo size={pTd(30)} name="chevron-thin-down" />
            </TextL>
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
    [NonInitial, setState, showTokenModal, swapToken, toSwapToken],
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
  const SwapItem = useMemo(() => {
    return (
      <View style={styles.inputItem}>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.swap')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {swapToken?.balance}
          </TextM>
        </View>
        <Input
          keyboardType="numeric"
          value={swapToken?.input}
          onChangeText={v => {
            let obj = {};
            let t;
            if (NonInitial) {
              t = swapUtils.getOutInput(
                swapToken?.reserve,
                toSwapToken?.reserve,
                v,
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
          }}
          style={styles.inputStyle}
          rightElement={rightElement(swapToken, 'swapToken')}
          placeholder="0.0"
        />
      </View>
    );
  }, [language, swapToken, rightElement, NonInitial, setState, toSwapToken]);
  const ToSwapItem = useMemo(() => {
    return (
      <View style={styles.inputItem}>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.take')}</TextM>
          <TextM>
            {i18n.t('mineModule.balance')}: {toSwapToken?.balance}
          </TextM>
        </View>
        <Input
          keyboardType="numeric"
          value={toSwapToken?.input}
          onChangeText={v => {
            console.log(NonInitial, v, 'onChangeText');
            let obj = {};
            if (v > toSwapToken?.reserve) {
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
              if (NonInitial) {
                obj = {
                  ...obj,
                  toSwapToken: {...toSwapToken, input: v},
                  swapToken: {
                    ...swapToken,
                    input: swapUtils.getInInput(
                      swapToken?.reserve,
                      toSwapToken?.reserve,
                      v,
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
          }}
          style={styles.inputStyle}
          rightElement={rightElement(toSwapToken, 'toSwapToken', true)}
          placeholder="0.0"
        />
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.price')}</TextM>
          <TextM>
            {swapUtils.getAmoun(swapToken?.input, toSwapToken?.input)}
            {swapToken?.token} / {toSwapToken?.token}{' '}
            <Entypo
              onPress={() => {
                setState({
                  swapToken: {...toSwapToken, input: ''},
                  toSwapToken: {...swapToken, input: ''},
                });
              }}
              name="swap"
              size={pTd(30)}
              color={Colors.primaryColor}
            />
          </TextM>
        </View>
      </View>
    );
  }, [language, toSwapToken, rightElement, swapToken, NonInitial, setState]);
  let disabled = true;
  if (swapUtils.judgmentToken(swapToken) && toSwapToken?.input) {
    disabled = false;
  }
  const onSwap = useCallback(() => {
    if (swapUtils.judgmentToken(swapToken)) {
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
            swapUtils.getSold(swapToken?.input, 1 - swapFloat),
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
  }, [dispatchSwapToken, setState, swapToken, tType, toSwapToken]);
  const upPullRefresh = useCallback(
    callBack => {
      getPairs(undefined, () => {
        setState(defaultState);
        callBack && callBack();
      });
    },
    [getPairs, setState],
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
              Number(toSwapToken?.input) > Number(toSwapToken.reserve)
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
