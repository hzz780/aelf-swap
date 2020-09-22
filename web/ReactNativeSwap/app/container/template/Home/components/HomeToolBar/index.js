import React, {memo, useMemo} from 'react';
import i18n from 'i18n-js';
import {Touchable} from '../../../../../components/template';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../../../../assets/theme';
import {TextL} from '../../../../../components/template/CommonText';
import TitleTool from '../../components/TitleTool';
const HomeToolBar = memo(props => {
  const {index, setIndex} = props;
  const toolList = [
    i18n.t('swap.tokens'),
    i18n.t('swap.pairs'),
    i18n.t('swap.accounts'),
  ];
  const toolBarBox = useMemo(() => {
    return (
      <View style={styles.toolBarBox}>
        {toolList.map((item, j) => {
          const current = j === index;
          return (
            <Touchable
              key={j}
              highlight
              onPress={() => setIndex?.(j)}
              underlayColor={Colors.bottonPressColor}
              style={[
                styles.toolBarItem,
                current && {backgroundColor: Colors.primaryColor},
              ]}>
              <TextL style={[current && styles.whiteColor]}>{item}</TextL>
            </Touchable>
          );
        })}
      </View>
    );
  }, [index, setIndex, toolList]);
  const titleTool = useMemo(() => {
    let titleList = [i18n.t('swap.pair'), i18n.t('swap.liquidity')];
    if (index === 2) {
      titleList = [i18n.t('account'), i18n.t('swap.value')];
    } else if (index === 0) {
      titleList = [
        i18n.t('swap.tokenT'),
        i18n.t('swap.liquidity'),
        i18n.t('swap.price'),
        i18n.t('swap.priceChange'),
      ];
    }
    return <TitleTool titleList={titleList} />;
  }, [index]);
  return (
    <>
      {toolBarBox}
      {titleTool}
    </>
  );
});

export default HomeToolBar;
const styles = StyleSheet.create({
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
  toolBarBox: {
    flexDirection: 'row',
  },
});
