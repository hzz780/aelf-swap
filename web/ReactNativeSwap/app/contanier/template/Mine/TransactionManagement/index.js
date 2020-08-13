import React, {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle} from '../../../../assets/theme';
import {CommonHeader, BounceSpinner} from '../../../../components/template';
import i18n from 'i18n-js';
import {WebView} from 'react-native-webview';
import aelfUtils from '../../../../utils/pages/aelfUtils';
import {useStateToProps} from '../../../../utils/pages/hooks';
const TransactionManagement = () => {
  const {address} = useStateToProps(base => {
    const {user} = base;
    return {
      address: user.address,
    };
  });
  const Components = useMemo(() => {
    const uri = aelfUtils.webURLAddress(address);
    return (
      <View style={GStyle.secondContainer}>
        <CommonHeader
          title={i18n.t('mineModule.transactionManagementT')}
          canBack
        />
        <WebView
          source={{uri}}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingBox}>
              <BounceSpinner type="Wave" />
            </View>
          )}
        />
      </View>
    );
  }, [address]);
  return Components;
};

export default memo(TransactionManagement);
const styles = StyleSheet.create({
  loadingBox: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: '50%',
  },
});
