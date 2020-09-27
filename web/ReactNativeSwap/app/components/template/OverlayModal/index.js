'use strict';
import React from 'react';
import Overlay from 'teaset/components/Overlay/Overlay';
import {sreenHeight, sreenWidth} from '../../../utils/common/device';
import {StyleSheet} from 'react-native';

let elements = [];
const customBounds = {
  x: 0,
  y: sreenHeight,
  width: sreenWidth,
  height: 0,
};
export default class OverlayModal extends React.Component {
  static show(component, overlayProps = {}) {
    let overlayView = (
      <Overlay.PopView
        modal={false}
        type="custom"
        ref={v => elements.push(v)}
        style={styles.bgStyle}
        containerStyle={styles.containerStyle}
        customBounds={customBounds}
        {...overlayProps}>
        {component}
      </Overlay.PopView>
    );
    Overlay.show(overlayView);
  }

  static hide() {
    elements = elements.filter(item => item); //Discard invalid data
    let key = elements.pop();
    key && key.close && key.close();
  }

  static destroy() {
    elements.forEach(item => {
      item && item.close && item.close();
    });
    elements = [];
  }

  componentWillUnmount() {
    OverlayModal.destroy();
  }
}
const styles = StyleSheet.create({
  bgStyle: {
    backgroundColor: Colors.bgColor2,
  },
  containerStyle: {
    flex: 1,
  },
});
