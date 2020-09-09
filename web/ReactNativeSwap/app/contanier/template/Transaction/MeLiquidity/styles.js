import {StyleSheet} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';

const styles = StyleSheet.create({
  itemBox: {
    backgroundColor: 'white',
    paddingVertical: pTd(20),
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  listItemBox: {
    minHeight: 0,
    paddingVertical: pTd(10),
    borderBottomWidth: 0,
  },
  itemTitleStyle: {
    color: Colors.primaryColor,
    fontWeight: 'bold',
  },
  itemSubtitleStyle: {
    color: Colors.primaryColor,
  },
  toolBox: {
    marginTop: pTd(10),
    flexDirection: 'row',
  },
  addTool: {
    flex: 1,
    marginHorizontal: pTd(30),
    paddingVertical: pTd(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: pTd(10),
  },
  whiteText: {
    color: 'white',
  },
});

export default styles;
