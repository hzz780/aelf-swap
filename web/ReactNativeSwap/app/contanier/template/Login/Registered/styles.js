import {pTd} from '../../../../utils/common';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: pTd(200),
    paddingHorizontal: pTd(50),
    justifyContent: 'center',
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
});
