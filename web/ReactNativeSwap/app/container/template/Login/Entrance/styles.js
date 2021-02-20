import {pTd} from '../../../../utils/common';
import {
  statusBarHeight,
  bottomBarHeight,
} from '../../../../utils/common/device';
import {StyleSheet} from 'react-native';
import {Colors} from '../../../../assets/theme';
const offset = pTd(500);
export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  headerStyle: {
    marginTop: offset,
  },
  bgStyle: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.bgColor2,
    marginTop: -offset,
  },
  loginButton: {
    marginBottom: pTd(50),
  },
  BottomBox: {
    marginBottom: bottomBarHeight + pTd(100),
  },
  premium: {
    alignSelf: 'center',
    color: Colors.fontColor,
  },
  premiumAccountBox: {
    marginTop: pTd(20),
  },
  loginAccountBox: {
    marginTop: pTd(20),
    marginLeft: pTd(20),
    // paddingLeft: pTd(20),
    // borderLeftWidth: 1,
    borderLeftColor: Colors.borderColor,
  },
  loginAccount: {
    alignSelf: 'center',
    color: Colors.fontColor,
  },
  topTool: {
    paddingHorizontal: pTd(50),
    position: 'absolute',
    zIndex: 999,
    top: statusBarHeight + pTd(80) + offset,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  language: {
    marginTop: pTd(200),
    alignSelf: 'center',
    color: Colors.fontColor,
  },
  hideLanguage: {
    color: Colors.fontWhite,
  },
  jLooking: {
    color: Colors.fontColor,
  },
  premiumBox: {
    marginHorizontal: pTd(10),
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: pTd(50),
    flexWrap: 'wrap',
  },
});
