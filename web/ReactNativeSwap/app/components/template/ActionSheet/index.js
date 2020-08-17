// ActionSheet.js

'use strict';

import React from 'react';
import OverlayModal from '../OverlayModal';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  bottomBarHeigth,
  statusBarHeight,
  getWindowWidth,
} from '../../../utils/common/device';
import Touchable from '../Touchable';
import {Colors} from '../../../assets/theme';
/**
 * show
 * @param  {Array}   items      [Menu array]
 * @param  {object}  cancelItem [cancel]
 */
const show = (items, cancelItem) => {
  OverlayModal.show(
    <>
      <ScrollView>
        <View style={styles.sheetBox}>
          {items &&
            items.map((item, index) => {
              const {title, onPress} = item;
              return (
                <Touchable
                  key={index}
                  style={styles.itemBox}
                  onPress={() => {
                    OverlayModal.hide();
                    onPress && onPress(item);
                  }}>
                  <Text style={styles.itemText}>{title}</Text>
                </Touchable>
              );
            })}
        </View>
      </ScrollView>
      {cancelItem && (
        <Touchable onPress={() => OverlayModal.hide()} style={styles.cancelBox}>
          <Text style={styles.concelText}>{cancelItem.title}</Text>
        </Touchable>
      )}
    </>,
    {
      style: styles.bgStyle,
      containerStyle: styles.containerStyle,
    },
  );
};
/**
 * alert
 * @param  {string}  title   [title]
 * @param  {string}  message [message]
 * @param  {object}  buttons [buttons]
 */
const alert = (title, message, buttons) => {
  OverlayModal.show(
    <View style={styles.alertBox}>
      {title ? <Text style={styles.alertTitle}>{title}</Text> : null}
      {message ? <Text style={styles.alertMessage}>{message}</Text> : null}
      <View style={styles.buttonsBox}>
        {Array.isArray(buttons) &&
          buttons.map((item, index) => (
            <Touchable
              onPress={() => {
                OverlayModal.hide();
                item.onPress && item.onPress();
              }}
              key={index}
              style={styles.buttonItem}>
              <Text
                style={[
                  styles.buttonText,
                  item.type === 'cancel' && styles.cancelText,
                ]}>
                {item.title}
              </Text>
            </Touchable>
          ))}
      </View>
    </View>,
    {
      modal: true,
      type: 'zoomOut',
      style: styles.alertBgstyle,
      containerStyle: styles.alertContainerStyle,
    },
  );
};
export default {
  show,
  alert,
};
const styles = StyleSheet.create({
  alertBgstyle: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgStyle: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    flexDirection: 'column-reverse',
  },
  containerStyle: {
    marginTop: getWindowWidth() * 0.4,
    paddingHorizontal: 20,
    marginBottom: bottomBarHeigth + 50,
  },
  sheetBox: {
    overflow: 'hidden',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  itemText: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
  itemBox: {
    width: '100%',
    paddingVertical: 15,
    overflow: 'hidden',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: Colors.borderColor,
  },
  concelText: {
    fontSize: 16,
  },
  cancelBox: {
    width: '100%',
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  alertBox: {
    overflow: 'hidden',
    borderRadius: 10,
    alignItems: 'center',
    width: '85%',
    backgroundColor: 'white',
  },
  alertContainerStyle: {
    marginBottom: statusBarHeight,
  },
  alertTitle: {
    marginTop: 20,
    fontSize: 18,
    marginBottom: 20,
  },
  alertMessage: {
    marginHorizontal: 20,
    fontSize: 14,
    color: Colors.fontGray,
    marginBottom: 20,
  },
  buttonItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.borderColor,
    overflow: 'hidden',
  },
  buttonsBox: {
    height: 50,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
  },
  buttonText: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
  cancelText: {
    color: Colors.fontGray,
  },
});
