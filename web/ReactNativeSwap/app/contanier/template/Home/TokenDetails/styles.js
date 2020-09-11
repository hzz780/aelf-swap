import {StyleSheet} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
import {bottomBarHeigth} from '../../../../utils/common/device';
const styles = StyleSheet.create({
  overviewBox: {
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
    paddingHorizontal: pTd(30),
  },
  preBox: {
    marginTop: pTd(20),
  },
  toolBarBox: {
    flexDirection: 'row',
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
  itemBox: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    paddingLeft: pTd(30),
    paddingVertical: pTd(20),
    backgroundColor: 'white',
  },
  timeStyle: {
    color: Colors.fontGray,
    marginTop: pTd(5),
  },
  toolListTitile: {
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
    paddingHorizontal: pTd(30),
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBox: {
    flexDirection: 'row',
    paddingHorizontal: pTd(30),
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingTop: pTd(30),
    paddingBottom: bottomBarHeigth || pTd(30),
    backgroundColor: 'white',
    borderTopWidth: 2,
    borderTopColor: Colors.borderColor,
  },
  bottomItem: {
    borderRadius: pTd(15),
    marginHorizontal: pTd(15),
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
  itemtitleBox: {
    flexDirection: 'row',
    paddingRight: pTd(30),
  },
  leftTitle: {
    color: Colors.fontGray,
    flex: 1,
  },
  subtitleDetailsStyle: {
    fontSize: pTd(26),
    color: Colors.kRed,
    fontWeight: 'bold',
  },
  flexBox: {
    flex: 1,
  },
  spinnerStyle: {
    alignSelf: 'center',
    marginTop: 100,
  },
});

export default styles;
