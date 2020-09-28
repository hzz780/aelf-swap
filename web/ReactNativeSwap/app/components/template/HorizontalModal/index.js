import React from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import {StatusBar, StyleSheet} from 'react-native';
import {isIos, statusBarHeight} from '../../../utils/common/device';
import OverlayModal from '../OverlayModal';
const show = component => {
  try {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
    );
    OverlayModal.show(
      isIos ? (
        component
      ) : (
        // Android hide StatusBar
        <>
          <StatusBar hidden={true} />
          {component}
        </>
      ),
      {
        modal: true,
        animated: false,
        style: styles.bgStyle,
        containerStyle: styles.container,
      },
    );
  } catch (error) {
    console.log(error, 'HorizontalShow');
  }
};
const hide = async () => {
  try {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );
  } catch (error) {
    console.log(error, 'HorizontalHide');
  }
  OverlayModal.hide();
};
export default {show, hide};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    paddingRight: pTd(15),
    backgroundColor: Colors.bgColor2,
    marginLeft: isIos ? statusBarHeight : 0,
  },
  bgStyle: {
    backgroundColor: 'black',
    flexDirection: 'column-reverse',
  },
});
