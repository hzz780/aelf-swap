'use strict';
import React, {memo} from 'react';
import QRCode from 'react-native-qrcode-svg';
import {QRCodeIcon} from '../../../assets/images';
import {sreenWidth} from '../../../utils/common/device';
import {View, StyleSheet} from 'react-native';
import BounceSpinner from '../BounceSpinner';
const MyQRCode = props => {
  const {value} = props;
  if (!value) {
    return (
      <View style={styles.loadingBox}>
        <BounceSpinner />
      </View>
    );
  }
  return (
    <QRCode
      logo={QRCodeIcon}
      logoSize={38}
      logoMargin={4}
      logoBackgroundColor={Colors.icon1}
      size={sreenWidth * 0.55}
      {...props}
      value={value}
    />
  );
};
export default memo(MyQRCode);
const styles = StyleSheet.create({
  loadingBox: {
    width: sreenWidth * 0.55,
    height: sreenWidth * 0.55,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
