'use strict';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Touchable from '../Touchable';
import {TextL} from '../CommonText';
import {Colors} from '../../../assets/theme';
import {pTd} from '../../../utils/common';
import Spinner from 'react-native-spinkit';
const CommonButton = props => {
  const {title, onPress, style, textStyle, disabled, loading} = props;
  if (loading) {
    return (
      <View style={styles.spinnerBox}>
        <Spinner type={'Wave'} color={Colors.primaryColor} size={pTd(80)} />
      </View>
    );
  }
  return (
    <Touchable
      highlight
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.container,
        disabled && {backgroundColor: Colors.disabledColor},
        style,
      ]}
      underlayColor={Colors.bottonPressColor}>
      <TextL numberOfLines={1} style={[styles.textStyles, textStyle]}>
        {title || 'button'}
      </TextL>
    </Touchable>
  );
};

export default memo(CommonButton);
const styles = StyleSheet.create({
  container: {
    height: pTd(90),
    borderRadius: pTd(45),
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    alignSelf: 'center',
    backgroundColor: Colors.primaryColor,
  },
  textStyles: {
    fontWeight: 'bold',
    color: 'white',
  },
  spinnerStyle: {
    alignSelf: 'center',
  },
  spinnerBox: {
    height: pTd(100),
    alignItems: 'center',
    flexDirection: 'column-reverse',
  },
});
