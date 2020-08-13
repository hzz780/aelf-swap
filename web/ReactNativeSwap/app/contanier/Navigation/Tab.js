import React, {useEffect, useCallback} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../template/Home';
import MineScreen from '../template/Mine';
import {pixelSize} from '../../utils/common/device';
import i18n from 'i18n-js';
import {Colors} from '../../assets/theme';
import {AppState} from 'react-native';
import navigationService from '../../utils/common/navigationService';
import config from '../../config';
import {useStateToProps} from '../../utils/pages/hooks';
const {safeTime} = config;
let timer = null;
const Tab = createBottomTabNavigator();
const TabNavigatorStack = () => {
  const {address, securityLock} = useStateToProps(state => {
    const {user, settings} = state;
    return {
      address: user.address,
      securityLock: settings.securityLock,
      language: settings.language,
    };
  });
  const appStateChange = useCallback(
    appState => {
      if (securityLock && safeTime) {
        if (
          appState === 'active' &&
          timer &&
          new Date().getTime() > timer + safeTime
        ) {
          timer = null;
          navigationService.navigate('SecurityLock');
        }
        if (appState === 'background') {
          timer = new Date().getTime();
        }
      }
    },
    [securityLock],
  );
  useEffect(() => {
    AppState.addEventListener('change', appStateChange);
    return () => {
      AppState.removeEventListener('change', appStateChange);
    };
  }, [appStateChange]);
  const listeners = useCallback(
    ({navigation, route}) => ({
      tabPress: e => {
        e.preventDefault();
        const {name} = route;
        if (address) {
          navigation.navigate(name);
          //not logged in
        } else {
          navigationService.reset('Entrance');
        }
      },
    }),
    [address],
  );
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      lazy={false}
      tabBarOptions={{
        activeTintColor: Colors.fontColor,
        inactiveTintColor: Colors.fontBlack,
        style: {
          borderTopColor: '#ececec',
          borderWidth: pixelSize,
        },
        keyboardHidesTabBar: true, //hide tab
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomeScreen}
        options={{
          tabBarLabel: i18n.t('home'),
          tabBarIcon: ({color}) => <Icon name="home" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="MinePage"
        component={MineScreen}
        listeners={listeners}
        options={{
          tabBarLabel: i18n.t('my'),
          tabBarIcon: ({color}) => <Icon name="user" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigatorStack;
