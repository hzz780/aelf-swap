import React, {memo, useMemo, useCallback, useRef} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  Input,
  Touchable,
  CommonButton,
  CommonToast,
  Loading,
  ActionSheet,
} from '../../../../components/template';
import i18n from 'i18n-js';
import {TextL, TextM} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import AntDesign from 'react-native-vector-icons/AntDesign';
import navigationService from '../../../../utils/common/navigationService';
import {useSetState, useStateToProps} from '../../../../utils/pages/hooks';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import config from '../../../../config';
import userActions from '../../../../redux/userRedux';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
import unitConverter from '../../../../utils/pages/unitConverter';
import aelfUtils from '../../../../utils/pages/aelfUtils';
import Entypo from 'react-native-vector-icons/Entypo';
const {tokenSymbol} = config;
const Transfer = props => {
  const input = useRef();
  const {params} = props.route || {};
  const [state, setState] = useSetState({
    address: '',
    amount: '',
    symbol: tokenSymbol,
  });
  const dispatch = useDispatch();
  const {userInfo, userBalances, allTokens} = useStateToProps(base => {
    const {user} = base;
    return {
      userInfo: {...(user || {})},
      userBalances: user.userBalances,
      allTokens: user.allTokens,
    };
  });
  useFocusEffect(
    useCallback(() => {
      const {address} = params || {};
      if (address) {
        setState({address: aelfUtils.formatAddress(address)});
      }
    }, [params, setState]),
  );
  const transfer = useCallback(value => dispatch(userActions.transfer(value)), [
    dispatch,
  ]);
  const {address, amount, symbol} = state;
  const balance = userBalances[symbol] || 0;
  const rightElement = useMemo(() => {
    return (
      <AntDesign
        onPress={() =>
          navigationService.navigate('QRCodeScan', {scanResult: true})
        }
        name="scan1"
        size={25}
        color={Colors.fontColor}
      />
    );
  }, []);
  const onTransfer = useCallback(() => {
    if (amount && address) {
      if (!(amount > 0)) {
        return CommonToast.text(
          i18n.t('mineModule.authorizeManagement.amountTip'),
        );
      }
      if (amount > balance) {
        return CommonToast.text(
          `${i18n.t(
            'mineModule.transferM.availableBalance',
          )}${balance} ${symbol}`,
        );
      }
      if (!aelfUtils.checkAddress(address)) {
        return CommonToast.text(
          i18n.t('mineModule.authorizeManagement.incorrectAddress'),
        );
      }
      if (
        aelfUtils.formatRestoreAddress(address) ===
        aelfUtils.formatRestoreAddress(userInfo.address)
      ) {
        return CommonToast.text(i18n.t('mineModule.transferM.transferSelfTip'));
      }
      TransactionVerification.show(value => {
        if (value) {
          Loading.show();
          transfer({
            symbol: symbol,
            to: address,
            amount: unitConverter.toHigher(amount),
            memo: input.current,
          });
        }
      });
    } else {
      CommonToast.text(i18n.t('mineModule.transferM.enterTip'));
    }
  }, [address, amount, balance, symbol, transfer, userInfo.address]);
  const onChangeAmount = useCallback(
    value => {
      if (value > balance) {
        CommonToast.text(
          `${i18n.t(
            'mineModule.transferM.availableBalance',
          )}${balance} ${symbol}`,
        );
      }
      setState({amount: value});
    },
    [balance, setState, symbol],
  );
  const onSelect = useCallback(
    item => {
      setState({symbol: item.symbol});
    },
    [setState],
  );
  const selectToken = useMemo(() => {
    const items = Array.isArray(allTokens)
      ? allTokens.map(item => {
          return {
            ...item,
            balance: userBalances[item.symbol] || '0',
            title: item.symbol,
            onPress: onSelect,
          };
        })
      : [];
    return (
      <View style={styles.tokenBox}>
        <Touchable
          onPress={() => {
            ActionSheet.show(items, {title: i18n.t('cancel')});
          }}
          style={styles.selectBox}>
          <TextL style={{color: Colors.primaryColor}}>{symbol}</TextL>
          <Entypo
            color={Colors.primaryColor}
            size={pTd(30)}
            name="chevron-thin-down"
          />
        </Touchable>
      </View>
    );
  }, [allTokens, onSelect, symbol, userBalances]);
  return (
    <Touchable
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('mineModule.transfer')} canBack>
        {selectToken}
        <View style={styles.box}>
          <TextL>{i18n.t('mineModule.transferM.payAddress')}</TextL>
          <Input
            value={address}
            onChangeText={value => setState({address: value})}
            rightElement={rightElement}
            placeholder={i18n.t('login.pleaseEnt')}
          />
        </View>
        <View style={styles.amountBox}>
          <View style={styles.rowBox}>
            <TextL>{i18n.t('mineModule.transferM.transferAmount')}</TextL>
            <TextM style={styles.colorStyle}>
              {i18n.t('mineModule.balance')}:{balance} {symbol}
            </TextM>
          </View>
          <Input
            keyboardType="numeric"
            value={amount}
            style={styles.inputStyle}
            onChangeText={onChangeAmount}
            placeholder={i18n.t('login.pleaseEnt')}
          />
          <Input
            leftTitle={i18n.t('mineModule.transferM.memo')}
            onChangeText={value => (input.current = value)}
            placeholder={i18n.t('mineModule.transferM.memoTip')}
          />
        </View>
        {/* <View style={[styles.amountBox, styles.rowBox]}>
          <TextL>{i18n.t('mineModule.transferM.fee')}</TextL>
          <TextM style={styles.colorStyle}>≈ 0.027 {symbol}</TextM>
        </View> */}
        <CommonButton
          disabled={!(balance && amount && Number(balance) >= Number(amount))}
          onPress={onTransfer}
          style={styles.buttonBox}
          title={i18n.t('mineModule.transfer')}
        />
      </CommonHeader>
    </Touchable>
  );
};

export default memo(Transfer);
const styles = StyleSheet.create({
  box: {
    padding: pTd(40),
    backgroundColor: Colors.bgColor2,
  },
  amountBox: {
    padding: pTd(40),
    backgroundColor: Colors.bgColor2,
    marginTop: pTd(20),
  },
  inputStyle: {
    paddingHorizontal: 0,
  },
  rowBox: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorStyle: {
    color: Colors.fontColor,
  },
  buttonBox: {
    marginTop: pTd(200),
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: pTd(25),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    alignItems: 'center',
  },
  tokenBox: {
    backgroundColor: Colors.bgColor2,
    paddingHorizontal: pTd(40),
  },
});
