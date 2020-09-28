import {StyleSheet} from 'react-native';
import {pTd} from '../../../../../utils/common';
import {Colors} from '../../../../../assets/theme';

export default StyleSheet.create({
  input: {
    paddingHorizontal: pTd(20),
    marginTop: pTd(20),
    backgroundColor: Colors.bgColor2,
    borderBottomWidth: 0,
  },
  tips: {
    padding: pTd(20),
    marginBottom: pTd(30),
    color: Colors.fontGray,
  },
});
