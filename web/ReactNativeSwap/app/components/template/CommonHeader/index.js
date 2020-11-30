'use strict';
import React, {memo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import navigationService from '../../../utils/common/navigationService';
import {statusBarHeight, pixelSize} from '../../../utils/common/device';
import Icon from 'react-native-vector-icons/AntDesign';
import {pTd} from '../../../utils/common';
import {Colors} from '../../../assets/theme';
import Touchable from '../Touchable';
import {TextM} from '../CommonText';
import KeyboardScrollView from '../KeyboardScrollView';
const styles = StyleSheet.create({
  statusBarStyle: {
    paddingTop: statusBarHeight,
    backgroundColor: Colors.bgColor2,
  },
  headerWrap: {
    height: pTd(88),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: pixelSize,
    borderColor: Colors.borderColor,
  },
  leftStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  rightStyle: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  backWrapStyle: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: pTd(36),
    color: Colors.fontColor,
    fontWeight: '500',
  },
  leftBox: {
    height: '100%',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  titleBox: {
    flex: 2,
    alignItems: 'center',
  },
  leftTitleStyle: {
    fontSize: pTd(30),
    color: Colors.fontColor,
    marginLeft: 15,
  },
  rightTitleStyle: {
    fontSize: pTd(30),
    color: Colors.fontColor,
    marginRight: 15,
  },
  rightBox: {
    padding: 5,
  },
});
const Header = props => {
  const {
    canBack,
    leftElement,
    titleElement,
    title,
    rightElement,
    headerStyle,
    titleStyle,
    statusBar,
    rightTitle,
    rightOnPress,
    leftTitle,
    leftOnPress,
    titleBox,
  } = props;
  return (
    <View
      style={[
        styles.statusBarStyle,
        headerStyle?.backgroundColor && {
          backgroundColor: headerStyle.backgroundColor,
        },
      ]}>
      {statusBar && statusBar}
      <View style={[styles.headerWrap, headerStyle]}>
        <View style={styles.leftStyle}>
          {canBack ? (
            <TouchableOpacity
              style={styles.leftBox}
              activeOpacity={0.75}
              onPress={() => navigationService.goBack()}>
              <Icon name={'left'} size={24} color={Colors.fontColor} />
            </TouchableOpacity>
          ) : null}
          {leftElement ? (
            leftElement
          ) : leftTitle ? (
            <Touchable
              style={styles.rightBox}
              onPress={() => leftOnPress && leftOnPress()}>
              <TextM style={styles.leftTitleStyle}>{leftTitle}</TextM>
            </Touchable>
          ) : null}
        </View>
        {titleElement ? (
          titleElement
        ) : (
          <View
            style={[
              [styles.titleBox, {flex: rightElement || rightTitle ? 2 : 3}],
              titleBox,
            ]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styles.title, titleStyle]}>
              {title || ''}
            </Text>
          </View>
        )}

        <View style={styles.rightStyle}>
          {rightElement ? (
            rightElement
          ) : rightTitle ? (
            <Touchable
              style={styles.rightBox}
              onPress={() => rightOnPress && rightOnPress()}>
              <TextM style={styles.rightTitleStyle}>{rightTitle}</TextM>
            </Touchable>
          ) : null}
        </View>
      </View>
    </View>
  );
};
const CommonHeader = props => {
  const {children, scrollViewProps} = props;
  if (children) {
    return (
      <>
        <Header {...props} />
        <KeyboardScrollView {...scrollViewProps}>{children}</KeyboardScrollView>
      </>
    );
  }
  return <Header {...props} />;
};

CommonHeader.defaultProps = {
  rightElement: null,
};

export default memo(CommonHeader);
