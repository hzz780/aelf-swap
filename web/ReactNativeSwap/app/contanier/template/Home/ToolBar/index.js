import React, {memo} from 'react';
import i18n from 'i18n-js';
import {Touchable} from '../../../../components/template';
import {View, LayoutAnimation} from 'react-native';
import {Colors} from '../../../../assets/theme';
import {TextL, TextM, TextS} from '../../../../components/template/CommonText';
import styles from '../styles';
import TitleTool from '../TitleTool';
const ToolBar = memo(props => {
  const {index, setIndex} = props;
  const toolList = ['Tokens', 'Pairs', 'Accounts'];
  return (
    <>
      <View style={styles.toolBarBox}>
        {toolList.map((item, j) => {
          const current = j === index;
          return (
            <Touchable
              highlight
              underlayColor={Colors.bottonPressColor}
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
                setIndex && setIndex(j);
              }}
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
          titleList={[
            i18n.t('swap.pair'),
            i18n.t('swap.liquidity'),
            i18n.t('swap.volume'),
          ]}
        />
      ) : index === 2 ? (
        <TitleTool titleList={[i18n.t('account'), i18n.t('swap.volume')]} />
      ) : (
        <TitleTool
          titleList={[
            'Tokens',
            i18n.t('swap.liquidity'),
            'Price',
            'Price Change',
          ]}
        />
      )}
    </>
  );
});

export default ToolBar;
