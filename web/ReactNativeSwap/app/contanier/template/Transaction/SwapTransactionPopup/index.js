import React, {memo} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
import {
  OverlayModal,
  Touchable,
  Communication,
} from '../../../../components/template';
import {TextL, CopyText} from '../../../../components/template/CommonText';
import i18n from 'i18n-js';
import {statusBarHeight} from '../../../../utils/common/device';
import aelfUtils from '../../../../utils/pages/aelfUtils';
const Components = memo(props => {
  const {txId} = props;
  return (
    <View style={styles.chooseTokenModal}>
      <TextL>Transaction Submitted</TextL>
      <CopyText
        style={styles.txIdStyle}
        copied={txId}
        iconColor={Colors.primaryColor}>
        TxId:{txId}
      </CopyText>
      <TextL
        onPress={() => {
          OverlayModal.hide();
          Communication.web(aelfUtils.webURLTx(txId));
        }}
        style={styles.explorer}>
        View on aelf Block Explorer
      </TextL>
      <Touchable onPress={() => OverlayModal.hide()} style={styles.okStyle}>
        <TextL style={styles.okText}>OK</TextL>
      </Touchable>
    </View>
  );
});
const show = props => {
  Keyboard.dismiss();
  OverlayModal.show(<Components {...props} />, {
    modal: true,
    type: 'zoomOut',
    style: styles.bgStyle,
    containerStyle: styles.containerStyle,
  });
};

export default {show};
const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerStyle: {
    width: '85%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginBottom: statusBarHeight,
    padding: 15,
  },
  chooseTokenModal: {
    width: '100%',
  },
  txIdStyle: {
    color: Colors.fontBlack,
    fontSize: pTd(28),
    marginTop: pTd(20),
  },
  explorer: {
    marginTop: pTd(20),
    color: Colors.primaryColor,
  },
  okStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    borderRadius: 5,
  },
  okText: {
    color: 'white',
  },
});
