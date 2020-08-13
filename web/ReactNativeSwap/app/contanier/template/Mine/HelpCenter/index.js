import React, {memo, useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {GStyle, Colors} from '../../../../assets/theme';
import {
  CommonHeader,
  Collapsible,
  Touchable,
} from '../../../../components/template';
import i18n from 'i18n-js';
import {pTd} from '../../../../utils/common';
import {TextL, TextM} from '../../../../components/template/CommonText';
import Entypo from 'react-native-vector-icons/Entypo';
const Item = props => {
  const {details, collapsed, title, onPress} = props;
  const Components = useMemo(() => {
    return (
      <Collapsible style={styles.collapsible} collapsed={collapsed}>
        <TextM style={styles.detailsText}>{details}</TextM>
      </Collapsible>
    );
  }, [details, collapsed]);
  return (
    <View style={styles.bottomBox}>
      <Touchable onPress={onPress} style={styles.titleBox}>
        <TextL style={styles.titleStyle}>{title}</TextL>
        {collapsed ? (
          <Entypo name="chevron-down" size={pTd(40)} />
        ) : (
          <Entypo color={Colors.fontColor} name="chevron-up" size={pTd(40)} />
        )}
      </Touchable>
      {Components}
    </View>
  );
};
const HelpCenter = () => {
  const [selected, setSelected] = useState(null);
  const list = [
    {
      title: i18n.t('mineModule.helpCenter.codeAccount'),
      details: i18n.t('mineModule.helpCenter.codeAccountE'),
    },
    {
      title: i18n.t('mineModule.helpCenter.qRCode'),
      details: i18n.t('mineModule.helpCenter.qRCodeE'),
    },
    {
      title: i18n.t('mineModule.helpCenter.backupQRCode'),
      details: i18n.t('mineModule.helpCenter.backupQRCodeE'),
    },
    {
      title: i18n.t('mineModule.helpCenter.forgetPwd'),
      details: i18n.t('mineModule.helpCenter.forgetPwdE'),
    },
    {
      title: i18n.t('mineModule.helpCenter.receiveTransfer'),
      details: i18n.t('mineModule.helpCenter.receiveTransferE'),
    },
    {
      title: i18n.t('mineModule.helpCenter.howBiometrics'),
      details: i18n.t('mineModule.helpCenter.howBiometricsE'),
    },
    {
      title: i18n.t('mineModule.helpCenter.howAuthorization'),
      details: i18n.t('mineModule.helpCenter.howAuthorizationE'),
    },
  ];
  return (
    <View style={GStyle.secondContainer}>
      <CommonHeader title={i18n.t('mineModule.helpCenterT')} canBack>
        <TextL style={styles.textMargin}>
          {i18n.t('mineModule.helpCenter.commonProblem')}
        </TextL>
        {list.map((item, index) => {
          return (
            <Item
              key={index}
              {...item}
              collapsed={!(selected === index)}
              onPress={() => setSelected(selected === index ? null : index)}
            />
          );
        })}
        {/* <TextL style={styles.textMargin}>
          {i18n.t('mineModule.helpCenter.feedback')}
        </TextL>
        <ListItem title={i18n.t('mineModule.helpCenter.submitFeedback')} /> */}
      </CommonHeader>
    </View>
  );
};

export default memo(HelpCenter);
const styles = StyleSheet.create({
  box: {
    padding: pTd(20),
    backgroundColor: 'white',
  },
  bottomBox: {
    padding: pTd(30),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    backgroundColor: 'white',
  },
  itemBox: {
    marginBottom: pTd(20),
    borderBottomWidth: 0,
  },
  textMargin: {
    marginLeft: pTd(20),
    marginTop: pTd(40),
    marginBottom: pTd(20),
    fontWeight: 'bold',
  },
  subtitleBox: {
    height: pTd(60),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
    overflow: 'hidden',
  },
  subtitleStyle: {
    color: Colors.fontGray,
  },
  textStyle: {
    marginTop: pTd(20),
    color: Colors.fontGray,
  },
  detailsText: {
    flex: 1,
    color: Colors.fontGray,
  },
  titleBox: {
    flexDirection: 'row',
    marginBottom: pTd(10),
  },
  titleStyle: {
    flex: 1,
  },
});
