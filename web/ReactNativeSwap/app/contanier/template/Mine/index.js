import React, {useEffect, memo, useMemo} from 'react';
import {View, StatusBar, ScrollView} from 'react-native';
import {GStyle, Colors} from '../../../assets/theme';
import styles from './styles';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Constants from 'expo-constants';
import settingsActions from '../../../redux/settingsRedux';
import {pTd} from '../../../utils/common';
import {TextL, TextM} from '../../../components/template/CommonText';
import {Touchable, ListItem} from '../../../components/template';
import navigationService from '../../../utils/common/navigationService';
import i18n from 'i18n-js';
import userActions from '../../../redux/userRedux';
import config from '../../../config';
import {useStateToProps} from '../../../utils/pages/hooks';
const {tokenSymbol} = config;
const Tool = () => {
  const {language} = useStateToProps(base => {
    const {settings} = base;
    return {
      language: settings.language,
    };
  });
  const Element = useMemo(() => {
    const List = [
      {
        title: i18n.t('mineModule.transactionManagementT'),
        onPress: () => navigationService.navigate('TransactionManagement'),
      },
      // {
      //   title: i18n.t('mineModule.authorizeManagementT'),
      //   onPress: () => navigationService.navigate('AuthorizeManagement'),
      // },
      {
        title: i18n.t('mineModule.securityCenterT'),
        onPress: () => navigationService.navigate('SecurityCenter'),
      },
      {
        title: i18n.t('mineModule.generalSettingT'),
        onPress: () => navigationService.navigate('GeneralSettings'),
        style: {marginTop: 10},
      },
      {
        title: i18n.t('mineModule.helpCenterT'),
        onPress: () => navigationService.navigate('HelpCenter'),
      },
      {
        title: i18n.t('mineModule.aboutUsT'),
        onPress: () => navigationService.navigate('AboutUs'),
        subtitle: i18n.t('mineModule.version', {
          number: Constants.nativeAppVersion,
        }),
      },
      {
        title: i18n.t('mineModule.accountManagementT'),
        onPress: () => navigationService.navigate('AccountManagement'),
        style: {marginTop: 10},
      },
    ];
    return (
      <ScrollView>
        <View style={GStyle.secondContainer}>
          <View style={styles.toolBox}>
            <Touchable
              onPress={() => navigationService.navigate('Receive')}
              style={styles.toolItem}>
              <FontAwesome5
                name="arrow-circle-down"
                size={30}
                color={Colors.primaryColor}
              />
              <TextM>{i18n.t('mineModule.collect')}</TextM>
            </Touchable>
            <Touchable
              onPress={() => navigationService.navigate('Transfer')}
              style={styles.toolItem}>
              <FontAwesome5
                name="arrow-circle-up"
                size={30}
                color={Colors.primaryColor}
              />
              <TextM>{i18n.t('mineModule.transfer')}</TextM>
            </Touchable>
            <Touchable
              onPress={() => navigationService.navigate('MyLiquidity')}
              style={styles.toolItem}>
              <FontAwesome5
                name="exchange-alt"
                size={30}
                color={Colors.primaryColor}
              />
              <TextM>{i18n.t('swap.liquidity')}</TextM>
            </Touchable>
          </View>
          {List.map((item, index) => (
            <ListItem key={index} {...item} />
          ))}
        </View>
      </ScrollView>
    );
    //We need to know when we switch languages
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);
  return Element;
};
const Mine = props => {
  const {balance, userName} = useStateToProps(base => {
    const {settings, user} = base;
    return {
      balance: user.balance,
      userName: user.userName,
      language: settings.language,
      barStyle: settings.barStyle,
    };
  });
  const {navigation, changeBarStyle, getUserBalance, onAppInit} = props;
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      changeBarStyle('light-content');
      StatusBar.setBarStyle('light-content');
    });
    const blurUnsubscribe = navigation.addListener('blur', () => {
      changeBarStyle('dark-content');
      StatusBar.setBarStyle('dark-content');
    });
    onAppInit();
    getUserBalance();
    const timer = setInterval(() => {
      getUserBalance();
    }, 10000);
    const initTimer = setInterval(() => {
      onAppInit();
    }, 20000);
    return () => {
      timer && clearTimeout(timer);
      initTimer && clearTimeout(initTimer);
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation, changeBarStyle, getUserBalance, onAppInit]);
  return (
    <View style={GStyle.container}>
      <Touchable
        activeOpacity={1}
        onPress={() => navigationService.navigate('PersonalCenter')}
        style={styles.topBGStyles}>
        <TextL style={styles.textTitle}>
          {i18n.t('mineModule.username')}: {userName}
        </TextL>
        <Icon name="qrcode" size={pTd(180)} color="#fff" />
      </Touchable>
      <View style={styles.balanceBox}>
        <TextL style={styles.textTitle}>
          {i18n.t('mineModule.balance')}:{balance} {tokenSymbol}
        </TextL>
      </View>
      <Tool />
    </View>
  );
};
const mapDispatchToProps = {
  changeBarStyle: settingsActions.changeBarStyle,
  getUserBalance: userActions.getUserBalance,
  onAppInit: userActions.onAppInit,
};
export default connect(
  null,
  mapDispatchToProps,
)(memo(Mine));
