import React, {memo, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  ListComponent,
  ListItem,
  Touchable,
} from '../../../../components/template';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
import {TextL} from '../../../../components/template/CommonText';
import navigationService from '../../../../utils/common/navigationService';
import i18n from 'i18n-js';
const MeLiquidity = () => {
  const renderItem = useCallback(() => {
    const List = [
      {title: `${i18n.t('swap.pooled')} ELF:`, subtitle: '0.948835'},
      {title: `${i18n.t('swap.pooled')} AEETH:`, subtitle: '0.948835'},
      {title: `${i18n.t('swap.myPoolTokens')}:`, subtitle: '0.948835'},
      {title: `${i18n.t('swap.myPoolShare')}:`, subtitle: '0.2%'},
    ];
    return (
      <Touchable activeOpacity={1} style={styles.itemBox}>
        <ListItem
          onPress={() => navigationService.navigate('PairDetails')}
          titleStyle={styles.itemTitleStyle}
          style={styles.listItemBox}
          subtitleStyle={styles.itemSubtitleStyle}
          title="ELF-AEETH"
          subtitle={i18n.t('swap.more')}
        />
        {List.map((item, index) => {
          return (
            <ListItem
              disabled
              key={index}
              style={styles.listItemBox}
              {...item}
              rightElement={null}
            />
          );
        })}
        <View style={styles.toolBox}>
          <Touchable
            style={[styles.addTool, {backgroundColor: Colors.primaryColor}]}>
            <TextL style={styles.whiteText}>{i18n.t('swap.add')}</TextL>
          </Touchable>
          <Touchable
            onPress={() => navigationService.navigate('RemoveLiquidity')}
            style={styles.addTool}>
            <TextL>{i18n.t('swap.remove')}</TextL>
          </Touchable>
        </View>
      </Touchable>
    );
  }, []);
  return (
    <ListComponent
      pointerEvents="box-none"
      renderItem={renderItem}
      data={[1, 1, 1, 1, 1, 1]}
    />
  );
};

export default memo(MeLiquidity);

const styles = StyleSheet.create({
  itemBox: {
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: pTd(10),
  },
  whiteText: {
    color: 'white',
  },
});
