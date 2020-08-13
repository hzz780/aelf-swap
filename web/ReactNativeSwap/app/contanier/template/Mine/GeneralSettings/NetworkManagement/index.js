import React, {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle} from '../../../../../assets/theme';
import {CommonHeader} from '../../../../../components/template';
import {pTd} from '../../../../../utils/common';
import i18n from 'i18n-js';
const NetworkManagement = () => {
  const Element = useMemo(() => {
    return <View style={styles.itemBox} />;
  }, []);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader
        title={i18n.t('mineModule.generalSettings.networkManagement')}
        canBack
      />
      {Element}
    </View>
  );
};

export default memo(NetworkManagement);
const styles = StyleSheet.create({
  itemBox: {
    marginTop: pTd(15),
  },
});
