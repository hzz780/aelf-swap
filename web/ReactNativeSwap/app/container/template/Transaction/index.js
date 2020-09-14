import React, {memo} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Keyboard} from 'react-native';
import {Colors, GStyle} from '../../../assets/theme';
import {Touchable} from '../../../components/template';
const Tab = createMaterialTopTabNavigator();
import Swap from './Swap';
import LiquidityList from './LiquidityList';
import {TextL} from '../../../components/template/CommonText';
const tabActiveColor = Colors.primaryColor;
import i18n from 'i18n-js';
import {useStateToProps} from '../../../utils/pages/hooks';
import {statusBarHeight, pixelSize} from '../../../utils/common/device';
import {pTd} from '../../../utils/common';
const Transaction = () => {
  useStateToProps(base => {
    const {settings} = base;
    return {
      language: settings.language,
    };
  });
  return (
    <Touchable
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={[GStyle.container, {paddingTop: statusBarHeight}]}>
      {/* <CommonHeader title={i18n.t('swap.transaction')} /> */}
      <Tab.Navigator
        initialRouteName="FiveDirectElection"
        tabBarOptions={{
          allowFontScaling: false,
          activeTintColor: tabActiveColor,
          inactiveTintColor: Colors.fontGray,
          indicatorStyle: {
            backgroundColor: tabActiveColor,
          },
          style: {
            marginHorizontal: pTd(80),
            elevation: 0,
            borderBottomWidth: pixelSize,
            borderColor: Colors.borderColor,
          },
        }}>
        <Tab.Screen
          name="Swap"
          component={Swap}
          options={{
            tabBarLabel: ({focused, color}) => {
              return <TextL style={{color}}>{i18n.t('swap.swap')}</TextL>;
            },
          }}
        />
        <Tab.Screen
          name="LiquidityList"
          component={LiquidityList}
          options={{
            tabBarLabel: ({focused, color}) => {
              return (
                <TextL style={{color}}>{i18n.t('swap.addLiquidity')}</TextL>
              );
            },
          }}
        />
      </Tab.Navigator>
    </Touchable>
  );
};

export default memo(Transaction);
