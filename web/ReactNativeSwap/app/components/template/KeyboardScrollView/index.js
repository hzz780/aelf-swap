import React, {memo, useState, useCallback} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RefreshControl} from 'react-native';
import {Colors} from '../../../assets/theme';

const KeyboardScrollView = props => {
  const [refreshing, setRefreshing] = useState(false);
  const {children, upPullRefresh} = props;
  const endRefreshing = useCallback(() => {
    const timer = setTimeout(() => {
      setRefreshing(false);
    }, 1000);
    return () => {
      timer && clearTimeout(timer);
    };
  }, []);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    upPullRefresh(endRefreshing);
  }, [endRefreshing, upPullRefresh]);
  return (
    <KeyboardAwareScrollView
      refreshControl={
        upPullRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            colors={[Colors.primaryColor]}
            tintColor={Colors.primaryColor}
            onRefresh={onRefresh}
          />
        ) : null
      }
      {...props}
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={0}
      extraHeight={50}>
      {children}
    </KeyboardAwareScrollView>
  );
};

export default memo(KeyboardScrollView);
