import React, {memo} from 'react';
import {Touchable} from '../../../../components/template';
import {StyleSheet} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
import {TextS} from '../../../../components/template/CommonText';
import Entypo from 'react-native-vector-icons/Entypo';
import i18n from 'i18n-js';
const MAXComponent = memo(props => {
  const {onPress} = props;
  return (
    <Touchable onPress={onPress} style={styles.maxBox}>
      <TextS style={styles.maxText}>{i18n.t('swap.max')}</TextS>
    </Touchable>
  );
});

const ChooseToken = memo(props => {
  const {onPress} = props;
  return (
    <Touchable onPress={onPress} style={styles.maxBox}>
      <TextS style={styles.maxText}>
        {i18n.t('swap.select')} Token{' '}
        <Entypo size={pTd(28)} name="chevron-down" />
      </TextS>
    </Touchable>
  );
});
export {MAXComponent, ChooseToken};

const styles = StyleSheet.create({
  maxBox: {
    marginRight: pTd(10),
    borderRadius: pTd(5),
    backgroundColor: Colors.primaryColor,
    padding: pTd(5),
    paddingHorizontal: pTd(10),
  },
  maxText: {
    fontWeight: 'bold',
    color: Colors.fontWhite,
  },
});
