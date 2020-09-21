import {StyleSheet} from 'react-native';
import {pTd} from '../../../utils/common';
import {Colors} from '../../../assets/theme';
const styles = StyleSheet.create({
  topBox: {
    paddingVertical: pTd(20),
    minHeight: pTd(80),
  },
  grayColor: {
    color: Colors.fontGray,
  },
  itemBox: {
    paddingVertical: pTd(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  topTitle: {
    color: Colors.fontGray,
    fontSize: pTd(28),
  },
  topSubtitle: {
    fontSize: pTd(28),
    color: Colors.fontGray,
  },
  tokenTopSubtitle: {
    fontSize: pTd(26),
    color: Colors.fontGray,
  },
  subtitleStyle: {
    fontSize: pTd(26),
    fontWeight: 'bold',
    color: Colors.fontBlack,
  },
  overviewBox: {
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
    paddingLeft: pTd(30),
  },
  toolBarItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: pTd(20),
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  whiteColor: {
    color: 'white',
  },
  toolListTitile: {
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
    paddingLeft: pTd(30),
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  toolBarBox: {
    flexDirection: 'row',
  },
  titleStyle: {
    flex: 1,
    color: Colors.primaryColor,
  },
  listItemBox: {
    paddingHorizontal: pTd(30),
    paddingVertical: pTd(20),
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  listItem2Box: {
    paddingHorizontal: pTd(30),
    paddingVertical: pTd(30),
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  flexBox: {
    flex: 1,
    marginLeft: pTd(10),
  },
  marginGray: {
    marginTop: pTd(10),
    color: Colors.fontGray,
  },
  colorGray: {
    color: Colors.fontGray,
  },
  accountSubtitle: {
    textAlign: 'right',
  },
  accountTitleStyle: {
    flex: 2,
  },
  liquidityBox: {
    borderBottomWidth: 0,
    minHeight: 0,
    paddingBottom: 0,
  },
  poolToken: {
    paddingTop: pTd(10),
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'flex-end',
    paddingRight: pTd(30),
    height: pTd(110),
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingBottom: pTd(20),
  },
  subtitleDetailsStyle: {
    fontSize: pTd(26),
    color: Colors.kRed,
    fontWeight: 'bold',
  },
  NFlexBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
});

export default styles;
