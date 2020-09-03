import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {pTd} from '../../../utils/common';
import {Colors} from '../../../assets/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {onCopyText} from '../../../utils/pages';
const styles = StyleSheet.create({
  textS: {
    fontSize: pTd(24),
  },
  textM: {
    fontSize: pTd(28),
  },
  textL: {
    fontSize: pTd(32),
  },
  textTitle: {
    fontSize: pTd(38),
    fontWeight: '500',
  },
  mutilText: {
    lineHeight: pTd(36),
    fontSize: pTd(28),
  },
  copyText: {
    fontSize: pTd(30),
    color: Colors.fontColor,
  },
});

export const TextS = props => {
  return (
    <Text {...props} style={[styles.textS, props.style]}>
      {props.children}
    </Text>
  );
};

export const TextM = props => {
  return (
    <Text {...props} style={[styles.textM, props.style]}>
      {props.children}
    </Text>
  );
};

export const TextL = props => {
  return (
    <Text {...props} style={[styles.textL, props.style]}>
      {props.children}
    </Text>
  );
};

export const TextTitle = props => {
  return (
    <Text {...props} style={[styles.textTitle, props.style]}>
      {props.children}
    </Text>
  );
};

export const MutilText = props => {
  return (
    <Text {...props} style={[styles.mutilText, props.style]}>
      {props.children}
    </Text>
  );
};

export const CopyText = props => {
  return (
    <Text
      onPress={() => onCopyText(props.copied)}
      {...props}
      style={[styles.copyText, props.style]}>
      {props.children}
      <AntDesign name="copy1" color={props.iconColor} />
    </Text>
  );
};
