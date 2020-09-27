import {StyleSheet} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';

export default StyleSheet.create({
  box: {
    marginTop: pTd(20),
  },
  topBox: {
    backgroundColor: Colors.bgColor2,
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
    backgroundColor: Colors.bgColor2,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonStyle: {
    marginTop: pTd(80),
    width: '70%',
  },
  addressBox: {
    borderTopColor: Colors.borderColor,
    borderTopWidth: 1,
    paddingHorizontal: pTd(50),
    width: '100%',
  },
  addressStyles: {
    marginTop: pTd(30),
  },
});
