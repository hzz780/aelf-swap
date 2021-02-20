import React, {memo} from 'react';
import {CommonHeader} from '../../../../components/template';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View} from 'react-native';
import {Colors, GStyle} from '../../../../assets/theme';
import {tabActiveColor} from './styles';
import i18n from 'i18n-js';
import {pTd} from '../../../../utils/common';
import {pixelSize} from '../../../../utils/common/device';

import PrivateKeyLogin from './PrivateKeyLogin';
import MnemonicLogin from './MnemonicLogin';
import KeyStoreLogin from './KeyStoreLogin';

const Tab = createMaterialTopTabNavigator();
const AdvancedLogin = ({navigation}) => {
  const tabNav = [
    {
      name: 'PrivateKeyLogin',
      component: PrivateKeyLogin,
      options: {title: i18n.t('login.advancedLogin.PrivateKey')},
    },
    {
      name: 'KeyStoreLogin',
      component: KeyStoreLogin,
      options: {title: 'KeyStore'},
    },
    {
      name: 'MnemonicLogin',
      component: MnemonicLogin,
      options: {title: i18n.t('login.advancedLogin.Mnemonic')},
    },
  ];
  return (
    <View style={GStyle.container}>
      <CommonHeader
        title={i18n.t('login.advancedLogin.title')}
        canBack
        canBackOnPress={() => navigation.goBack()}
      />
      <Tab.Navigator
        lazy
        tabBarOptions={{
          upperCaseLabel: false,
          allowFontScaling: false,
          activeTintColor: tabActiveColor,
          inactiveTintColor: Colors.fontGray,
          indicatorStyle: {
            backgroundColor: tabActiveColor,
          },
          labelStyle: {
            fontSize: pTd(25),
          },
          style: {
            // marginHorizontal: pTd(20),
            elevation: 0,
            borderBottomWidth: pixelSize,
            borderColor: Colors.borderColor,
          },
        }}>
        {tabNav.map((item, index) => {
          return <Tab.Screen key={index} {...item} />;
        })}
      </Tab.Navigator>
    </View>
  );
};
export default memo(AdvancedLogin);
