'use strict';
import React, {useCallback, useRef, useState, useMemo} from 'react';
import OverlayModal from '../OverlayModal';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Touchable from '../Touchable';
import {Colors, GStyle} from '../../../assets/theme';
import Password from '../Password';
import {pTd} from '../../../utils/common';
import {TextL, TextM} from '../CommonText';
import i18n from 'i18n-js';
import Input from '../Input';
import aelfUtils from '../../../utils/pages/aelfUtils';
import {sleep} from '../../../utils/pages';
import BounceSpinner from '../BounceSpinner';
import {isIos} from '../../../utils/common/device';
import {useStateToProps} from '../../../utils/pages/hooks';
import AntDesign from 'react-native-vector-icons/AntDesign';
const BottomView = props => {
  const {cancel, determine} = props;
  const Components = useMemo(
    () => (
      <View style={styles.buttonsBox}>
        <Touchable onPress={cancel} style={styles.buttonItem}>
          <Text style={styles.cancelText}>{i18n.t('cancel')}</Text>
        </Touchable>
        <Touchable onPress={determine} style={styles.rightButtonItem}>
          <Text style={styles.buttonText}>{i18n.t('determine')}</Text>
        </Touchable>
      </View>
    ),
    [cancel, determine],
  );
  return Components;
};
const PayComponents = props => {
  const [pwTip, setPwTip] = useState(false);
  const {payPw} = useStateToProps(base => {
    const {settings} = base;
    return {
      payPw: settings.payPw,
    };
  });
  const {callBack} = props;
  const intervalRef = useRef();
  const onChange = useCallback(
    value => {
      intervalRef.current = value;
      if (value.length === 6) {
        determine();
      }
    },
    [determine],
  );

  const determine = useCallback(() => {
    if (payPw === intervalRef.current) {
      callBack && callBack(true);
      OverlayModal.hide();
    } else {
      setPwTip(true);
    }
  }, [intervalRef, payPw, callBack]);

  const cancel = useCallback(() => {
    callBack && callBack(false);
    OverlayModal.hide();
  }, [callBack]);
  return (
    <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps="always">
      <View style={[styles.container]}>
        <View style={styles.pleasePayPwdBox}>
          <AntDesign color={'white'} size={pTd(40)} name="close" />
          <TextM style={styles.pleasePayPwd} numberOfLines={1}>
            {i18n.t('pleasePayPwd')}
          </TextM>
          <AntDesign
            color={Colors.fontGray}
            size={pTd(40)}
            name="close"
            onPress={() => OverlayModal.hide()}
          />
        </View>
        <Password
          maxLength={6}
          style={GStyle.marginArg(pTd(50), 0, pTd(30), 0)}
          onChange={value => onChange(value)}
        />
        <View style={styles.payTipsBox}>
          {pwTip ? (
            <TextM style={[GStyle.pwTip, styles.tips]}>
              {i18n.t('pwdErr')}
            </TextM>
          ) : null}
        </View>
        {/* <BottomView cancel={cancel} determine={determine} /> */}
        {/* {isIos ? <KeyboardSpace /> : null} */}
      </View>
    </ScrollView>
  );
};
const PasswordComponents = props => {
  const [pwTip, setPwTip] = useState(false);
  const [loading, setLoading] = useState(false);
  const {callBack, keystore} = props;
  const intervalRef = useRef();
  const onChange = useCallback(value => {
    intervalRef.current = value;
  }, []);

  const determine = useCallback(async () => {
    setLoading(true);
    await sleep(500);
    const checkResult = aelfUtils.checkPassword(keystore, intervalRef.current);
    setLoading(false);
    if (checkResult) {
      callBack && callBack(true);
      OverlayModal.hide();
    } else {
      setPwTip(true);
    }
  }, [callBack, keystore]);

  const cancel = useCallback(() => {
    callBack && callBack(false);
    OverlayModal.hide();
  }, [callBack]);
  return (
    <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        <TextL>{i18n.t('pleasePwd', {account: ''})}</TextL>
        <Input
          autoFocus
          secureTextEntry={true}
          leftTitleBox={styles.leftTitleBox}
          leftTextStyle={styles.leftTextStyle}
          leftTitle={i18n.t('login.pwd')}
          onChangeText={onChange}
          placeholder={i18n.t('login.pleaseEnt')}
        />
        {pwTip && (
          <TextM style={[GStyle.pwTip, styles.tips]}>
            {i18n.t('accountPwdErr')}
          </TextM>
        )}
        {loading ? (
          <BounceSpinner type="Wave" />
        ) : (
          <BottomView cancel={cancel} determine={determine} />
        )}
      </View>
    </ScrollView>
  );
};
const InputComponents = props => {
  const [errTip, setErrTip] = useState(false);
  const {
    callBack,
    errMessage,
    title,
    judgeFunc,
    inputTip,
    keyboardType,
    tip,
    rightElement,
  } = props;
  const intervalRef = useRef();
  const onChange = useCallback(value => {
    intervalRef.current = value;
  }, []);
  const defaultFun = useCallback(input => {
    return input > 0;
  }, []);
  const determine = useCallback(async () => {
    setErrTip(false);
    if (
      judgeFunc
        ? judgeFunc(intervalRef.current)
        : defaultFun(intervalRef.current)
    ) {
      OverlayModal.hide();
      callBack && callBack(true, intervalRef.current);
    } else {
      setErrTip(true);
    }
  }, [callBack, defaultFun, judgeFunc]);

  const cancel = useCallback(() => {
    OverlayModal.hide();
    callBack && callBack(false);
  }, [callBack]);
  return (
    <ScrollView alwaysBounceVertical={false} keyboardShouldPersistTaps="always">
      <View style={styles.container}>
        <TextL>{title}</TextL>
        {tip ? <TextM style={styles.inputTipStyle}>{tip}</TextM> : null}
        <Input
          autoFocus
          leftTitleBox={styles.leftTitleBox}
          leftTextStyle={styles.leftTextStyle}
          leftTitle={inputTip}
          onChangeText={onChange}
          keyboardType={keyboardType || 'numeric'}
          placeholder={i18n.t('login.pleaseEnt')}
          rightElement={rightElement}
        />
        {errTip && (
          <TextM style={[GStyle.pwTip, styles.tips]}>{errMessage}</TextM>
        )}
        <BottomView cancel={cancel} determine={determine} />
      </View>
    </ScrollView>
  );
};
const payShow = callBack => {
  OverlayModal.show(<PayComponents callBack={callBack} />, {
    style: styles.style,
    modal: true,
    autoKeyboardInsets: isIos ? true : false,
    containerStyle: styles.containerStyle,
  });
};
const passwordShow = (keystore, callBack) => {
  OverlayModal.show(
    <PasswordComponents keystore={keystore} callBack={callBack} />,
    {
      style: styles.style,
      modal: true,
      autoKeyboardInsets: isIos ? true : false,
      containerStyle: styles.containerStyle,
    },
  );
};
const inputShow = props => {
  OverlayModal.show(<InputComponents {...props} />, {
    style: styles.style,
    modal: true,
    autoKeyboardInsets: isIos ? true : false,
    containerStyle: styles.containerStyle,
  });
};
export default {
  payShow,
  passwordShow,
  inputShow,
};
const styles = StyleSheet.create({
  container: {
    paddingTop: pTd(50),
    width: '90%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: pTd(20),
    alignItems: 'center',
  },
  loadingBox: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  style: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  containerStyle: {},
  buttonItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.borderColor,
    overflow: 'hidden',
  },
  rightButtonItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  buttonsBox: {
    height: 60,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    overflow: 'hidden',
  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
  cancelText: {
    color: Colors.fontGray,
    fontSize: 16,
  },
  leftTextStyle: {
    width: 80,
  },
  leftTitleBox: {
    width: '80%',
    marginVertical: pTd(40),
    marginBottom: pTd(30),
  },
  tips: {
    flex: 1,
    marginBottom: pTd(20),
  },
  inputTipStyle: {
    marginTop: pTd(10),
    alignSelf: 'flex-end',
    color: Colors.fontColor,
    marginRight: pTd(60),
  },
  pleasePayPwd: {
    flex: 1,
    textAlign: 'center',
  },
  pleasePayPwdBox: {
    flexDirection: 'row',
    paddingHorizontal: pTd(30),
    alignItems: 'center',
  },
  payTipsBox: {
    height: pTd(70),
    alignItems: 'center',
  },
});
