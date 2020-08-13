import React, {memo, useCallback, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  ListComponent,
  Touchable,
  VerifyPassword,
} from '../../../../components/template';
import i18n from 'i18n-js';
import {useDispatch} from 'react-redux';
import {TextL, TextM} from '../../../../components/template/CommonText';
import {pTd} from '../../../../utils/common';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {onCopyText} from '../../../../utils/pages';
import userActions from '../../../../redux/userRedux';
import TransactionVerification from '../../../../utils/pages/TransactionVerification';
import config from '../../../../config';
import {useStateToProps} from '../../../../utils/pages/hooks';
const {tokenSymbol} = config;
const AuthorizeManagement = () => {
  const dispatch = useDispatch();
  const getAllowanceList = useCallback(
    () => dispatch(userActions.getAllowanceList()),
    [dispatch],
  );
  const onApprove = useCallback(
    (amount, appContractAddress) =>
      dispatch(userActions.onApprove(amount, appContractAddress)),
    [dispatch],
  );
  useEffect(() => {
    getAllowanceList();
  }, [getAllowanceList]);
  const rightElement = useMemo(() => <TextL>{tokenSymbol}</TextL>, []);
  const {allowanceList, balance} = useStateToProps(base => {
    const {user} = base;
    return {
      allowanceList: user.allowanceList,
      balance: user.balance,
    };
  });
  const onAuthorize = useCallback(
    item => {
      VerifyPassword.inputShow({
        tip: `${i18n.t('mineModule.balance')}: ${balance} ${tokenSymbol}`,
        title: i18n.t('mineModule.authorizeManagement.title'),
        inputTip: i18n.t('mineModule.authorizeManagement.amount'),
        errMessage: i18n.t('mineModule.authorizeManagement.amountTip'),
        rightElement,
        callBack: (value, input) => {
          value &&
            TransactionVerification.show(suc => {
              if (suc) {
                onApprove(input, item.contractAdress);
              }
            });
        },
      });
    },
    [balance, onApprove, rightElement],
  );
  const renderItem = ({item}) => {
    return (
      <View style={styles.itemBox}>
        <View style={styles.rowItem}>
          <TextL style={styles.name} numberOfLines={1}>
            {i18n.t('mineModule.authorizeManagement.appName')}
          </TextL>
          <View style={styles.rightBox}>
            <TextL>{item.name}</TextL>
          </View>
        </View>
        <View style={styles.rowItem}>
          <TextL style={styles.name} numberOfLines={1}>
            {i18n.t('mineModule.authorizeManagement.contractAddress')}
          </TextL>
          <View style={styles.rightBox}>
            <TextL
              onPress={() => onCopyText(item.contractAdress)}
              style={styles.addressStyle}>
              {item.contractAdress} <AntDesign name="copy1" size={pTd(32)} />
            </TextL>
          </View>
        </View>
        <View style={styles.rowItem}>
          <TextL style={styles.name} numberOfLines={1}>
            {i18n.t('mineModule.authorizeManagement.authorizedBalance')}
          </TextL>
          <View style={styles.rightBox}>
            <TextL>
              {item.allowance} {item.symbol}
            </TextL>
          </View>
        </View>
        <Touchable
          onPress={() => onAuthorize(item)}
          style={styles.authorizeBox}>
          <TextM style={styles.authorizeText}>
            {i18n.t('mineModule.authorizeManagement.deauthorize')}
          </TextM>
        </Touchable>
      </View>
    );
  };
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('mineModule.authorizeManagementT')} canBack />
      <ListComponent renderItem={renderItem} data={allowanceList} />
    </View>
  );
};

export default memo(AuthorizeManagement);
const styles = StyleSheet.create({
  name: {
    color: Colors.fontGray,
    marginRight: pTd(50),
  },
  itemBox: {
    width: '100%',
    marginTop: pTd(10),
    paddingHorizontal: pTd(50),
    backgroundColor: 'white',
  },
  rowItem: {
    width: '100%',
    paddingVertical: pTd(30),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    borderBottomColor: Colors.borderColor,
  },
  rightStyle: {},
  rightBox: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  addressStyle: {
    color: Colors.fontColor,
  },
  authorizeBox: {
    marginVertical: pTd(20),
    alignSelf: 'flex-end',
    height: pTd(60),
    borderRadius: pTd(30),
    paddingHorizontal: pTd(20),
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
  },
  authorizeText: {
    color: 'white',
  },
});
