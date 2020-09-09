'use strict';
import React, {memo, useMemo} from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {Colors} from '../../../assets/theme';
const Input = props => {
  const {
    leftElement,
    rightElement,
    leftTitle,
    leftTitleBox,
    leftTextStyle,
    style,
    value,
    keyboardType,
  } = props;
  let counts;
  let contextMenuHidden = false;
  const tyNumeric = keyboardType === 'numeric';
  const boxInput = leftTitle || leftElement || rightElement;
  if (tyNumeric) {
    contextMenuHidden = true;
  }
  if (value && tyNumeric && typeof value === 'string') {
    counts = value.split('.')[0].length;
  }
  let inputStyle = [styles.input, style];
  if (boxInput) {
    inputStyle = [styles.leftTitleInput, style];
  }
  const input = useMemo(() => {
    const {
      placeholderTextColor,
      disabled,
      pointerEvents,
      opacity,
      decimals,
    } = props;
    return (
      <TextInput
        maxLength={counts ? counts + decimals + 1 : undefined}
        placeholderTextColor={placeholderTextColor || '#999'}
        pointerEvents={disabled ? 'none' : pointerEvents}
        opacity={disabled ? 0.6 : opacity}
        contextMenuHidden={contextMenuHidden}
        {...props}
        // placeholder={
        //   tyNumeric
        //     ? placeholder + i18n.t('swap.decimalTip', {decimals})
        //     : placeholder
        // }
        style={inputStyle}
      />
    );
  }, [contextMenuHidden, counts, inputStyle, props]);
  if (leftTitle || leftElement || rightElement) {
    return (
      <View style={[styles.leftTitleBox, leftTitleBox]}>
        {leftElement ? (
          leftElement
        ) : (
          <Text style={[styles.leftTextStyle, leftTextStyle]}>{leftTitle}</Text>
        )}
        {input}
        {rightElement && rightElement}
      </View>
    );
  }
  return input;
};
export default memo(Input);
Input.defaultProps = {
  decimals: 8,
};

const styles = StyleSheet.create({
  input: {
    color: Colors.fontBlack,
    width: '100%',
    // flex: 1,
    fontSize: 16,
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.borderColor,
    paddingHorizontal: 5,
  },
  leftTitleBox: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  leftTextStyle: {
    fontSize: 16,
  },
  leftTitleInput: {
    flex: 1,
    fontSize: 16,
    height: 50,
    paddingHorizontal: 5,
    color: Colors.fontBlack,
  },
});
