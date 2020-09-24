import {StyleSheet} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
const styles = StyleSheet.create({
  overviewBox: {
    paddingTop: pTd(15),
    paddingBottom: pTd(10),
    paddingHorizontal: pTd(30),
  },
  subtitleStyle: {
    maxWidth: '70%',
    fontSize: pTd(28),
    fontWeight: 'bold',
    color: Colors.fontBlack,
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
  flexBox: {
    flex: 1,
  },
  spinnerStyle: {
    alignSelf: 'center',
    marginTop: 100,
  },
  allPairsStyle: {
    marginVertical: pTd(20),
  },
});

export default styles;
