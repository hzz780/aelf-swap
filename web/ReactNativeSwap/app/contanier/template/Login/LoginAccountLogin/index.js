import React, {memo, useMemo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  VerifyPassword,
  CommonToast,
} from '../../../../components/template';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import {useDispatch} from 'react-redux';
import userActions from '../../../../redux/userRedux';
import {pTd} from '../../../../utils/common';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useStateToProps} from '../../../../utils/pages/hooks';
const LoginAccountLogin = () => {
  const {userList, address} = useStateToProps(base => {
    const {user} = base;
    return {
      userList: user.userList,
      address: user.address,
    };
  });
  const dispatch = useDispatch();
  const onLoginSuccess = useCallback(
    data => dispatch(userActions.onLoginSuccess(data)),
    [dispatch],
  );
  const rightElement = useMemo(
    () => <FontAwesome name="check" size={20} color={Colors.fontColor} />,
    [],
  );
  const onSwitchAccount = useCallback(
    item => {
      const {keystore, privateKey, address, userName} = item;
      VerifyPassword.passwordShow(keystore, async value => {
        if (value) {
          onLoginSuccess({
            address,
            keystore,
            userName,
            balance: 0,
            saveQRCode: true,
            privateKey,
          });
          CommonToast.success(i18n.t('switchSuccess'));
          navigationService.reset('Tab');
        }
      });
    },
    [onLoginSuccess],
  );
  const AccountComponents = useMemo(() => {
    const accountList = Array.isArray(userList)
      ? userList.map(item => ({
          ...item,
          title: item.userName,
          details: item.address,
        }))
      : [];
    return accountList.map((item, index) => {
      const current = item.details === address;
      return (
        <View
          key={index}
          style={[
            styles.accountBox,
            index === accountList.length - 1 && styles.bottomAccountBox,
          ]}>
          <ListItem
            disabled={current}
            onPress={() => onSwitchAccount(item)}
            style={styles.itemBox}
            detailsStyle={styles.detailsStyle}
            rightElement={current ? rightElement : null}
            {...item}
          />
        </View>
      );
    });
  }, [address, onSwitchAccount, rightElement, userList]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('login.loginAccountLogin')} canBack>
        <View style={styles.container}>{AccountComponents}</View>
      </CommonHeader>
    </View>
  );
};

export default memo(LoginAccountLogin);
const styles = StyleSheet.create({
  container: {
    marginTop: pTd(20),
  },
  itemBox: {
    flex: 1,
    borderBottomWidth: 0,
  },
  detailsStyle: {
    paddingRight: pTd(20),
  },
  accountBox: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  bottomAccountBox: {
    borderBottomWidth: 0,
    marginBottom: pTd(20),
  },
  deleteStyle: {
    marginLeft: pTd(20),
  },
});
