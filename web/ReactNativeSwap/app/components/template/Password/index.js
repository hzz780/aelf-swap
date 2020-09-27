'use strict';
import React, {useRef, useState, memo, useCallback} from 'react';
import {StyleSheet, View, TextInput, TouchableHighlight} from 'react-native';
import {sreenWidth} from '../../../utils/common/device';

const PasswordInput = props => {
  const input = useRef();
  const [text, setText] = useState('');
  const onPress = useCallback(() => {
    input.current && input.current.focus();
  }, [input]);
  const getInputItem = () => {
    const {maxLength, inputItemStyle, iconStyle} = props;
    let inputItem = [];
    for (let i = 0; i < maxLength; i++) {
      if (i === 0) {
        inputItem.push(
          <View key={i} style={[styles.inputItem, inputItemStyle]}>
            {i < text.length ? (
              <View style={[styles.iconStyle, iconStyle]} />
            ) : null}
          </View>,
        );
      } else {
        inputItem.push(
          <View
            key={i}
            style={[
              styles.inputItem,
              styles.inputItemBorderLeftWidth,
              inputItemStyle,
            ]}>
            {i < text.length ? (
              <View style={[styles.iconStyle, iconStyle]} />
            ) : null}
          </View>,
        );
      }
    }
    return inputItem;
  };
  const {onChange, maxLength, style} = props;
  return (
    <TouchableHighlight
      onPress={onPress}
      activeOpacity={1}
      underlayColor="transparent">
      <View style={[styles.container, style]}>
        <TextInput
          style={styles.inputStyle}
          ref={input}
          maxLength={maxLength}
          autoFocus={true}
          keyboardType="numeric"
          onChangeText={value => {
            setText(value);
            onChange && onChange(value);
          }}
        />
        {getInputItem()}
      </View>
    </TouchableHighlight>
  );
};
export default memo(PasswordInput);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: Colors.bgColor2,
  },
  inputItem: {
    height: sreenWidth / 8,
    width: sreenWidth / 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItemBorderLeftWidth: {
    borderLeftWidth: 1,
    borderColor: '#ccc',
  },
  iconStyle: {
    width: 16,
    height: 16,
    backgroundColor: '#222',
    borderRadius: 8,
  },
  inputStyle: {
    height: 45,
    zIndex: 99,
    position: 'absolute',
    width: (sreenWidth / 8) * 6,
    opacity: 0,
  },
});
