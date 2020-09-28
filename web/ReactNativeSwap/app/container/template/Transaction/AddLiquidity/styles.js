import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  inputStyle: {
    paddingHorizontal: 0,
  },
  rightBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: pTd(50),
  },
  inputTitleBox: {
    marginTop: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonStyles: {
    marginTop: pTd(30),
  },
  tipText: {
    marginTop: pTd(10),
    alignSelf: 'center',
  },
  themeColor: {
    fontWeight: 'bold',
    color: Colors.primaryColor,
  },
  redColor: {
    marginTop: pTd(30),
    color: Colors.red,
  },
  mrginText: {
    marginTop: pTd(40),
    marginVertical: pTd(15),
  },
  splitLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  subtitleStyle: {
    fontSize: pTd(28),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
  itemBox: {
    minHeight: 0,
    paddingHorizontal: 0,
    borderBottomWidth: 0,
    paddingVertical: pTd(10),
  },
  grayColor: {
    color: Colors.fontGray,
    paddingTop: pTd(10),
  },
});

export default styles;
