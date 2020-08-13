import React, {memo, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle} from '../../../../assets/theme';
import {CommonHeader, ListItem} from '../../../../components/template';
import {pTd} from '../../../../utils/common';
import i18n from 'i18n-js';
import navigationService from '../../../../utils/common/navigationService';
import settingsActions from '../../../../redux/settingsRedux';
import {useDispatch} from 'react-redux';
import {useStateToProps} from '../../../../utils/pages/hooks';
// import {DEFAULT_CURRENCY} from '../../../../config/constant';
const GeneralSettings = () => {
  const dispatch = useDispatch();
  const changeInform = useCallback(
    inform => dispatch(settingsActions.changeInform(inform)),
    [dispatch],
  );
  const {inform} = useStateToProps(base => {
    const {settings} = base;
    return {
      language: settings.language,
      inform: settings.inform,
    };
  });
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('mineModule.generalSettingT')} canBack />
      <ListItem
        disabled
        switching
        value={inform}
        style={styles.itemBox}
        title={i18n.t('mineModule.generalSettings.inform')}
        details={i18n.t('mineModule.generalSettings.informTip')}
        onValueChange={changeInform}
      />
      <ListItem
        onPress={() => navigationService.navigate('Language')}
        title={i18n.t('language')}
        subtitle={i18n.t('currentLanguage')}
      />
      {/* <ListItem
        onPress={() => navigationService.navigate('CurrencyUnit')}
        title={i18n.t('mineModule.generalSettings.currencyUnit')}
        subtitle={currencyUnit || DEFAULT_CURRENCY}
      />
      <ListItem
        onPress={() => navigationService.navigate('NetworkManagement')}
        title={i18n.t('mineModule.generalSettings.networkManagement')}
      /> */}
    </View>
  );
};

export default memo(GeneralSettings);
const styles = StyleSheet.create({
  itemBox: {
    borderBottomWidth: 0,
    marginVertical: pTd(15),
  },
});
