import {StyleSheet} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
export const tabActiveColor = Colors.primaryColor;
export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: pTd(50),
  },
  labelStyle: {
    fontSize: pTd(32),
  },
  indicatorStyle: {
    backgroundColor: tabActiveColor,
    height: '100%',
    alignSelf: 'center',
  },
  style: {
    backgroundColor: Colors.bgColor2,
    borderColor: tabActiveColor,
    elevation: 0,
    borderWidth: 2,
  },
  leftTitleBox: {
    paddingTop: 15,
    height: 65,
  },
  buttonStyles: {
    width: '100%',
    marginTop: pTd(100),
  },
  leftTextStyle: {
    width: 80,
  },
  input: {
    textAlignVertical: 'top',
    marginTop: pTd(50),
    height: pTd(250),
    borderRadius: 5,
    borderWidth: 1,
  },
});
