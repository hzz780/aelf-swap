/* eslint-disable react-hooks/exhaustive-deps */
import React, {memo, useMemo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {Input, CommonButton} from '../../../../components/template';
import {TextM, TextL} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import Entypo from 'react-native-vector-icons/Entypo';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import ChooseTokenModal from '../ChooseTokenModal';
import {MAXComponent, ChooseToken} from '../MAXComponent';
import i18n from 'i18n-js';
const tokenList = [
  {token: 'ELF', balance: '234.123'},
  {token: 'BLF', balance: '204.123'},
  {token: 'CLF', balance: '2394.123'},
  {token: 'ALF', balance: '2341.123'},
];
const Swap = () => {
  const {language} = useStateToProps(base => {
    const {settings} = base;
    return {
      language: settings.language,
    };
  });
  const [state, setState] = useSetState({
    swapToken: {
      input: '',
      token: 'ELF',
      balance: '1000.3456',
    },
    toSwapToken: {
      input: '',
      token: '',
      balance: '0',
    },
  });
  const showTokenModal = useCallback(
    (list, type) => {
      ChooseTokenModal.show({
        tokenList: list,
        onPress: item => {
          setState({[type]: item});
        },
      });
    },
    [setState],
  );
  const {swapToken, toSwapToken} = state;
  const rightElement = useCallback(
    (item, type, hideMax) => {
      const {token} = item;
      if (token) {
        return (
          <View style={styles.rightBox}>
            {hideMax ? null : (
              <MAXComponent
                onPress={() => {
                  setState({[type]: {...item, input: item.balance}});
                }}
              />
            )}
            <TextL
              onPress={() => {
                showTokenModal(tokenList, type);
              }}>
              {token} <Entypo size={pTd(30)} name="chevron-thin-down" />
            </TextL>
          </View>
        );
      }
      return (
        <ChooseToken
          onPress={() => {
            showTokenModal(tokenList, type);
          }}
        />
      );
    },
    [setState, showTokenModal],
  );
  const Description = useMemo(() => {
    let color = 'green';
    return (
      <View style={styles.descriptionBox}>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.maximumSold')}</TextM>
          <TextM style={styles.rightText}>0.9488 ELF</TextM>
        </View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.priceImpact')}</TextM>
          <TextM style={[styles.rightText, {color}]}>0.01%</TextM>
        </View>
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.liquidityProviderFee')}</TextM>
          <TextM style={styles.rightText}>0.234 ELF</TextM>
        </View>
      </View>
    );
  }, [language]);
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
          onChangeText={v => setState({swapToken: {...swapToken, input: v}})}
          style={styles.inputStyle}
          rightElement={rightElement(swapToken, 'swapToken')}
          placeholder="0.0"
        />
      </View>
    );
  }, [rightElement, setState, swapToken, language]);
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
          onChangeText={v =>
            setState({toSwapToken: {...toSwapToken, input: v}})
          }
          style={styles.inputStyle}
          rightElement={rightElement(toSwapToken, 'toSwapToken', true)}
          placeholder="0.0"
        />
        <View style={styles.inputTitleBox}>
          <TextM>{i18n.t('swap.price')}</TextM>
          <TextM>
            0.12 ELF / AEETH{' '}
            <Entypo name="swap" size={pTd(30)} color={Colors.primaryColor} />
          </TextM>
        </View>
      </View>
    );
  }, [rightElement, setState, toSwapToken, language]);
  return (
    <View style={GStyle.container}>
      {SwapItem}
      {ToSwapItem}
      <CommonButton title={i18n.t('swap.swap')} style={styles.buttonStyles} />
      {Description}
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
