import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {BounceSpinner} from '../../../../../components/template';
import config from '../../../../../components/template/Charts/config';
const {chartsHeight} = config;
const LoadView = () => {
  return (
    <View style={styles.loadView}>
      <BounceSpinner type="Wave" />
    </View>
  );
};

export default memo(LoadView);
const styles = StyleSheet.create({
  loadView: {
    width: '100%',
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: chartsHeight,
  },
});
