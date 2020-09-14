import React, {memo, useCallback, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle} from '../../../../../assets/theme';
import {CommonHeader, ListItem} from '../../../../../components/template';
import {pTd} from '../../../../../utils/common';
import i18n from 'i18n-js';
import {localLanguage} from '../../../../../i18n/config';
import {useDispatch} from 'react-redux';
import settingsActions from '../../../../../redux/settingsRedux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useStateToProps} from '../../../../../utils/pages/hooks';
const Language = () => {
  const dispatch = useDispatch();
  const changeLanguage = useCallback(
    language => dispatch(settingsActions.changeLanguage(language)),
    [dispatch],
  );
  const {language} = useStateToProps(base => {
    const {settings} = base;
    return {
      language: settings.language,
    };
  });
  const rightElement = useMemo(
    () => <FontAwesome name="check" size={20} />,
    [],
  );
  const onPress = useCallback(
    value => {
      changeLanguage(value.language);
    },
    [changeLanguage],
  );
  const Element = useMemo(() => {
    return (
      <View style={styles.itemBox}>
        {localLanguage.map((item, index) => {
          const current = item.language === language;
          return (
            <ListItem
              {...item}
              key={index}
              disabled={current}
              onPress={() => onPress(item)}
              rightElement={current ? rightElement : null}
            />
          );
        })}
      </View>
    );
  }, [language, onPress, rightElement]);
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('language')} canBack />
      {Element}
    </View>
  );
};

export default memo(Language);
const styles = StyleSheet.create({
  itemBox: {
    marginTop: pTd(15),
  },
});
