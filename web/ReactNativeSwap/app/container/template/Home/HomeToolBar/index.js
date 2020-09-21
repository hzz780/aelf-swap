import React, {memo} from 'react';
import i18n from 'i18n-js';
import {Touchable} from '../../../../components/template';
import {View} from 'react-native';
import {Colors} from '../../../../assets/theme';
import {TextL} from '../../../../components/template/CommonText';
import styles from '../styles';
import TitleTool from '../TitleTool';
const ToolBar = memo(props => {
  const {index, setIndex} = props;
  const toolList = [
    i18n.t('swap.tokens'),
    i18n.t('swap.pairs'),
    i18n.t('swap.accounts'),
  ];
  return (
    <>
      <View style={styles.toolBarBox}>
        {toolList.map((item, j) => {
          const current = j === index;
          return (
            <Touchable
              highlight
              underlayColor={Colors.bottonPressColor}
              onPress={() => setIndex?.(j)}
              key={j}
              style={[
                styles.toolBarItem,
                current && {backgroundColor: Colors.primaryColor},
              ]}>
              <TextL style={[current && styles.whiteColor]}>{item}</TextL>
            </Touchable>
          );
        })}
      </View>
      {index === 1 ? (
        <TitleTool
          titleList={[i18n.t('swap.pair'), i18n.t('swap.liquidity')]}
        />
      ) : index === 2 ? (
        <TitleTool titleList={[i18n.t('account'), i18n.t('swap.value')]} />
      ) : (
        <TitleTool
          titleList={[
            i18n.t('swap.tokenT'),
            i18n.t('swap.liquidity'),
            i18n.t('swap.price'),
            i18n.t('swap.priceChange'),
          ]}
        />
      )}
    </>
  );
});

export default ToolBar;
