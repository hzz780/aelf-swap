import {pTd} from '../../../../utils/common';
import {StyleSheet} from 'react-native';
import {Colors} from '../../../../assets/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: pTd(50),
    flexDirection: 'column',
    paddingHorizontal: pTd(50),
  },
  nickNameStyles: {
    color: Colors.fontColor,
  },
  leftTitleBox: {
    paddingTop: 15,
    height: 65,
  },
  leftTextStyle: {
    width: 80,
  },
  buttonStyles: {
    marginTop: pTd(50),
    width: '100%',
  },
});
