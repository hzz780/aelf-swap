import React, {memo, useMemo, useState, useCallback} from 'react';
import {View, StyleSheet, LayoutAnimation} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  ListItem,
  ActionSheet,
  VerifyPassword,
  CommonToast,
} from '../../../../components/template';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {pTd} from '../../../../utils/common';
import userActions from '../../../../redux/userRedux';
import {useDispatch} from 'react-redux';
import {useStateToProps} from '../../../../utils/pages/hooks';
const AccountManagement = () => {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const rightElement = useMemo(
    () => <FontAwesome name="check" size={20} color={Colors.fontColor} />,
    [],
  );
  const deleteUser = useCallback(
    address => dispatch(userActions.deleteUser(address)),
    [dispatch],
  );
  const onLoginSuccess = useCallback(
    data => dispatch(userActions.onLoginSuccess(data)),
    [dispatch],
  );
  const logOut = useCallback(address => dispatch(userActions.logOut(address)), [
    dispatch,
  ]);
  const {userInfo} = useStateToProps(base => {
    const {settings, user} = base;
    return {
      userInfo: {...settings, ...user},
    };
  });
  const onDeletePress = useCallback(
    item => {
      const {address} = userInfo;
      const current = item.details === address;
      if (current) {
        ActionSheet.alert(
          i18n.t('mineModule.accountManagement.switchTip'),
          null,
          [{title: i18n.t('determine')}],
        );
      } else {
        ActionSheet.alert(
          i18n.t('mineModule.accountManagement.deleteTitle'),
          i18n.t('mineModule.accountManagement.deleteTip'),
          [
            {title: i18n.t('cancel'), type: 'cancel'},
            {
              title: i18n.t('delete'),
              onPress: () => {
                VerifyPassword.passwordShow(item.keystore, value => {
                  if (value) {
                    deleteUser(item.address);
                  }
                });
              },
            },
          ],
        );
      }
    },
    [deleteUser, userInfo],
  );
  const checkSaveQRCode = useCallback(() => {
    const {saveQRCode} = userInfo;
    if (saveQRCode) {
      return true;
    } else {
      ActionSheet.alert(
        i18n.t('safetyReminder'),
        i18n.t('mineModule.accountManagement.qRCodeNoSaveTip'),
        [
          {title: i18n.t('cancel'), type: 'cancel'},
          {
            title: i18n.t('determine'),
            onPress: () => {
              navigationService.navigate('MinePage');
              navigationService.navigate('PersonalCenter');
            },
          },
        ],
      );
      return false;
    }
  }, [userInfo]);
  const dropOut = useCallback(() => {
    const {address, keystore} = userInfo;
    if (!address) {
      logOut(address);
    }
    if (checkSaveQRCode()) {
      ActionSheet.alert(
        i18n.t('mineModule.accountManagement.logOut'),
        i18n.t('mineModule.accountManagement.logOutTip'),
        [
          {title: i18n.t('cancel'), type: 'cancel'},
          {
            title: i18n.t('determine'),
            onPress: () => {
              VerifyPassword.passwordShow(keystore, value => {
                if (value) {
                  logOut(address);
                }
              });
            },
          },
        ],
      );
    }
  }, [checkSaveQRCode, logOut, userInfo]);
  const onSwitchAccount = useCallback(
    item => {
      if (checkSaveQRCode()) {
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
      }
    },
    [checkSaveQRCode, onLoginSuccess],
  );
  const AccountComponents = useMemo(() => {
    const {userList, address} = userInfo;
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
          {edit && (
            <AntDesign
              onPress={() => onDeletePress(item)}
              name="minuscircle"
              size={20}
              color={Colors.red}
              style={styles.deleteStyle}
            />
          )}
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
  }, [edit, onDeletePress, onSwitchAccount, rightElement, userInfo]);
  const Components = useMemo(() => {
    return (
      <View style={GStyle.secondContainer}>
        <CommonHeader
          title={i18n.t('mineModule.accountManagementT')}
          canBack
          rightTitle={
            edit
              ? i18n.t('mineModule.accountManagement.complete')
              : i18n.t('mineModule.accountManagement.edit')
          }
          rightOnPress={() => {
            LayoutAnimation.easeInEaseOut();
            setEdit(!edit);
          }}>
          <View style={styles.container}>
            {AccountComponents}
            <ListItem
              onPress={() =>
                navigationService.navigate('Entrance', {addAccount: true})
              }
              title={i18n.t('mineModule.accountManagement.addAccount')}
            />
            <ListItem
              title={i18n.t('mineModule.accountManagement.logOut')}
              onPress={dropOut}
            />
          </View>
        </CommonHeader>
      </View>
    );
  }, [AccountComponents, dropOut, edit]);
  return Components;
};

export default memo(AccountManagement);
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
    backgroundColor: Colors.bgColor2,
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
