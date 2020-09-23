'use strict';
import React, {memo} from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

// Touchable hooks

const Touchable = props => {
  let time = null;

  const handleClickThrottled = pressProps => {
    const {onPressIn, onPress, onPressWithSecond} = props;
    let newTime = new Date().getTime();
    if (!time) {
      onPressIn ? onPressIn(pressProps) : onPress && onPress(pressProps);
    } else if (newTime - time > onPressWithSecond) {
      onPressIn ? onPressIn(pressProps) : onPress && onPress(pressProps);
    }
    time = newTime;
  };
  const {onPressIn, onPress, highlight, children, style} = props;
  if (highlight) {
    return (
      <TouchableHighlight
        style={style}
        {...props}
        onPressIn={onPressIn ? handleClickThrottled : null}
        onPress={onPress ? handleClickThrottled : null}>
        <View>{children}</View>
      </TouchableHighlight>
    );
  }
  return (
    <TouchableOpacity
      {...props}
      onPressIn={onPressIn ? handleClickThrottled : null}
      onPress={onPress ? handleClickThrottled : null}>
      {children}
    </TouchableOpacity>
  );
};
Touchable.propTypes = {
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  style: ViewPropTypes.style,
  onPressWithSecond: PropTypes.number, // Click once every few seconds
  highlight: PropTypes.bool, //use or not TouchableHighlight
};

Touchable.defaultProps = {
  onPressWithSecond: 1000,
};
export default memo(Touchable);
