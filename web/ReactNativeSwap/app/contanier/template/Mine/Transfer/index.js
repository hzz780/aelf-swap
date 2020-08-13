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
const {tokenSymbol} = config;
const Transfer = props => {
  const input = useRef();
  const {params} = props.route || {};
  const [state, setState] = useSetState({
    address: '',
    amount: '',
  });
  const dispatch = useDispatch();
  const {userInfo} = useStateToProps(base => {
    const {user} = base;
    return {
      userInfo: {...user},
    };
  });
  const transfer = useCallback(value => dispatch(userActions.transfer(value)), [
    dispatch,
  ]);
  const {balance} = userInfo;
  useFocusEffect(
    useCallback(() => {
      const {address} = params || {};
      if (address) {
        setState({address: aelfUtils.formatAddress(address)});
      }
    }, [params, setState]),
  );
  const {address, amount} = state;
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
          )}${balance} ${tokenSymbol}`,
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
            symbol: tokenSymbol,
            to: address,
            amount: unitConverter.toHigher(amount),
            memo: input.current,
          });
        }
      });
    } else {
      CommonToast.text(i18n.t('mineModule.transferM.enterTip'));
    }
  }, [address, amount, balance, transfer, userInfo.address]);
  const onChangeAmount = useCallback(
    value => {
      if (value > balance) {
        CommonToast.text(
          `${i18n.t(
            'mineModule.transferM.availableBalance',
          )}${balance} ${tokenSymbol}`,
        );
        setState({amount: String(balance)});
      } else {
        setState({amount: value});
      }
    },
    [balance, setState],
  );
  return (
    <Touchable
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('mineModule.transfer')} canBack>
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
              {i18n.t('mineModule.balance')}:{balance} {tokenSymbol}
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
        <View style={[styles.amountBox, styles.rowBox]}>
          <TextL>{i18n.t('mineModule.transferM.fee')}</TextL>
          <TextM style={styles.colorStyle}>≈ 0.027 {tokenSymbol}</TextM>
        </View>
        <CommonButton
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
    backgroundColor: 'white',
  },
  amountBox: {
    padding: pTd(40),
    backgroundColor: 'white',
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
});
