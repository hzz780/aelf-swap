import {StyleSheet} from 'react-native';
import {Colors} from '../../../../assets/theme';
import {pTd} from '../../../../utils/common';

const styles = StyleSheet.create({
  shotView: {
    padding: pTd(30),
    backgroundColor: Colors.bgColor2,
    alignItems: 'center',
    alignSelf: 'center',
  },
  rightStyle: {
    color: Colors.fontColor,
    marginRight: 15,
  },
  rightBox: {
    padding: 5,
  },
  account: {
    color: Colors.fontColor,
  },
  address: {
    fontSize: pTd(30),
    marginTop: pTd(50),
  },
  nameBox: {
    paddingHorizontal: pTd(30),
    paddingVertical: pTd(50),
    paddingBottom: pTd(30),
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonBox: {
    marginTop: pTd(100),
  },
  tips: {
    marginTop: pTd(50),
    paddingHorizontal: pTd(50),
  },
  userNameStyle: {
    fontSize: 18,
    marginBottom: pTd(20),
  },
});
export default styles;
