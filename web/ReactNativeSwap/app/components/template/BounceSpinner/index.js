'use strict';
import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import Spinner from 'react-native-spinkit';
import {Colors} from '../../../assets/theme';

const BounceSpinner = props => {
  return (
    <Spinner
      type={'Bounce'}
      color={Colors.primaryColor}
      size={45}
      {...props}
      style={[styles.style, props.style]}
    />
  );
};
export default memo(BounceSpinner);

const styles = StyleSheet.create({
  style: {
    alignSelf: 'center',
  },
});
