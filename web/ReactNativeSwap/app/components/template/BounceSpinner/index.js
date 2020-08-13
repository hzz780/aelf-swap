'use strict';
import React, {memo} from 'react';
import Spinner from 'react-native-spinkit';
import {Colors} from '../../../assets/theme';

const BounceSpinner = props => {
  return (
    <Spinner type={'Bounce'} color={Colors.primaryColor} size={45} {...props} />
  );
};
export default memo(BounceSpinner);
