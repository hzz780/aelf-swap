import {StyleSheet} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';

export default StyleSheet.create({
  box: {
    marginTop: pTd(20),
  },
  topBox: {
    backgroundColor: 'white',
    padding: pTd(50),
    paddingTop: pTd(30),
    alignItems: 'center',
  },
  userNameStyle: {
    fontSize: 18,
    marginBottom: pTd(20),
  },
  shotView: {
    justifyContent: 'center',
    padding: pTd(30),
    backgroundColor: 'white',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonStyle: {
    marginTop: 5,
    width: '70%',
  },
  addressBox: {
    width: '100%',
  },
  addressTips: {
    marginTop: pTd(30),
    color: Colors.fontGray,
  },
  premium: {
    marginTop: pTd(20),
  },
  authentication: {
    borderBottomWidth: 0,
    marginTop: pTd(20),
  },
  tips: {
    color: Colors.fontGray,
  },
  tipsBox: {
    backgroundColor: 'white',
    paddingHorizontal: pTd(30),
    paddingBottom: pTd(30),
  },
  subtitleStyle: {
    color: 'red',
  },
});
