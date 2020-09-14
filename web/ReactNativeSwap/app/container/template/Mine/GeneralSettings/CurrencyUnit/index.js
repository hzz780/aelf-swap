import React, {memo, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle} from '../../../../../assets/theme';
import {CommonHeader, ListItem} from '../../../../../components/template';
import {pTd} from '../../../../../utils/common';
import i18n from 'i18n-js';
import {useDispatch} from 'react-redux';
import settingsActions from '../../../../../redux/settingsRedux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {DEFAULT_CURRENCY} from '../../../../../config/constant';
import {useStateToProps} from '../../../../../utils/pages/hooks';
const CurrencyUnit = () => {
  const dispatch = useDispatch();
  const changeCurrencyUnit = useCallback(
    currencyUnit => dispatch(settingsActions.changeCurrencyUnit(currencyUnit)),
    [dispatch],
  );
  const {currencyUnit} = useStateToProps(base => {
    const {settings} = base;
    return {
      currencyUnit: settings.currencyUnit,
    };
  });
  const rightElement = useMemo(
    () => <FontAwesome name="check" size={20} />,
    [],
  );
  const onPress = useCallback(
    item => {
      changeCurrencyUnit(item.title);
    },
    [changeCurrencyUnit],
  );
  const Element = useMemo(() => {
    const itemList = [{title: 'USD'}, {title: 'CNY'}, {title: 'KRW'}];
    return (
      <View style={styles.itemBox}>
        {itemList.map((item, index) => {
          const current = item.title === (currencyUnit || DEFAULT_CURRENCY);
          return (
            <ListItem
              {...item}
              disabled={current}
              onPress={() => onPress(item)}
              key={index}
              rightElement={current ? rightElement : null}
            />
          );
        })}
      </View>
    );
  }, [currencyUnit, onPress, rightElement]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader
        title={i18n.t('mineModule.generalSettings.currencyUnit')}
        canBack
      />
      {Element}
    </View>
  );
};

export default memo(CurrencyUnit);
const styles = StyleSheet.create({
  itemBox: {
    marginTop: pTd(15),
  },
});
