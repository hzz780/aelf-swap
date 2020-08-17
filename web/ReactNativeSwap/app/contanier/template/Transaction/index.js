import React, {memo} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Keyboard} from 'react-native';
import {Colors, GStyle} from '../../../assets/theme';
import {CommonHeader, Touchable} from '../../../components/template';
const Tab = createMaterialTopTabNavigator();
import Swap from './Swap';
import LiquidityList from './LiquidityList';
import {TextL} from '../../../components/template/CommonText';
const tabActiveColor = Colors.primaryColor;

const Transaction = () => {
  return (
    <Touchable
      activeOpacity={1}
      onPress={() => Keyboard.dismiss()}
      style={GStyle.container}>
      <CommonHeader title={'Transaction'} />
      <Tab.Navigator
        initialRouteName="FiveDirectElection"
        tabBarOptions={{
          allowFontScaling: false,
          activeTintColor: 'white',
          inactiveTintColor: tabActiveColor,
          indicatorStyle: {
            backgroundColor: tabActiveColor,
            height: '100%',
            alignSelf: 'center',
          },
          style: {
            backgroundColor: 'white',
            borderColor: tabActiveColor,
            elevation: 0,
            borderWidth: 1,
          },
        }}>
        <Tab.Screen
          name="Swap"
          component={Swap}
          options={{
            tabBarLabel: ({focused, color}) => {
              return <TextL style={{color}}>Swap</TextL>;
            },
          }}
        />
        <Tab.Screen
          name="LiquidityList"
          component={LiquidityList}
          options={{
            tabBarLabel: ({focused, color}) => {
              return <TextL style={{color}}>Add Liquidity</TextL>;
            },
          }}
        />
      </Tab.Navigator>
    </Touchable>
  );
};

export default memo(Transaction);
