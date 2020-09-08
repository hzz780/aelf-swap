'use strict';
import React, {memo} from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';
import {Colors} from '../../../assets/theme';

const Input = props => {
  const {
    leftElement,
    rightElement,
    leftTitle,
    leftTitleBox,
    leftTextStyle,
    placeholderTextColor,
    disabled,
    style,
    pointerEvents,
    opacity,
    value,
    keyboardType,
    decimals,
  } = props;
  let counts;
  if (value && keyboardType === 'numeric') {
    counts = value.split('.')[0].length;
  }
  if (leftTitle || leftElement || rightElement) {
    return (
      <View style={[styles.leftTitleBox, leftTitleBox]}>
        {leftElement ? (
          leftElement
        ) : (
          <Text style={[styles.leftTextStyle, leftTextStyle]}>{leftTitle}</Text>
        )}
        <TextInput
          maxLength={counts ? counts + decimals + 1 : undefined}
          placeholderTextColor={placeholderTextColor || '#999'}
          pointerEvents={disabled ? 'none' : pointerEvents}
          opacity={disabled ? 0.6 : opacity}
          {...props}
          style={[styles.leftTitleInput, style]}
        />
        {rightElement && rightElement}
      </View>
    );
  }
  return (
    <TextInput
      maxLength={counts ? counts + decimals + 1 : undefined}
      placeholderTextColor={placeholderTextColor || '#999'}
      pointerEvents={disabled ? 'none' : pointerEvents}
      opacity={disabled ? 0.6 : opacity}
      {...props}
      style={[styles.input, style]}
    />
  );
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
