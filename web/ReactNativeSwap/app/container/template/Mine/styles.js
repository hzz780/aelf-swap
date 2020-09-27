import {StyleSheet} from 'react-native';
import {Colors} from '../../../assets/theme';
import {pTd} from '../../../utils/common';
import {statusBarHeight} from '../../../utils/common/device';

export default StyleSheet.create({
  topBGStyles: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    height: statusBarHeight + pTd(300),
    backgroundColor: Colors.primaryColor,
    paddingBottom: pTd(30),
  },
  textTitle: {
    color: Colors.fontWhite,
  },
  balanceBox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: pTd(80),
    backgroundColor: Colors.blanceBG,
  },
  toolBox: {
    backgroundColor: Colors.bgColor2,
    paddingVertical: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: pTd(20),
  },
  toolItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
