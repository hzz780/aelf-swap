import {Dimensions, Platform, PixelRatio, UIManager} from 'react-native';
import Constants from 'expo-constants';
const X_WIDTH = 375;
const X_HEIGHT = 812;

const isIos = Platform.OS === 'ios';

//Turn on Android layout animation
if (!isIos && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const sreenWidth = Dimensions.get('screen').width;
const sreenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;

const pixelSize = (function() {
  let pixelRatio = PixelRatio.get();
  let size = 1;
  if (pixelRatio >= 3) {
    size = 0.333;
  } else if (pixelRatio >= 2) {
    size = 0.5;
  }
  return size;
})();

const isIphoneX = (function() {
  return (
    Platform.OS === 'ios' &&
    ((sreenHeight >= X_HEIGHT && sreenWidth >= X_WIDTH) ||
      (sreenHeight >= X_WIDTH && sreenWidth >= X_HEIGHT))
  );
})();

const statusBarHeight = (function() {
  let BarHeight = Constants.statusBarHeight;
  if (isIos && !BarHeight) {
    if (isIphoneX) {
      BarHeight = 44;
    } else {
      BarHeight = 20;
    }
  }
  return BarHeight;
})();
const bottomBarHeight = (function() {
  let Height = 0;
  if (isIos && isIphoneX) {
    Height = 34;
  }
  return Height;
})();
const getWindowWidth = () => {
  return Dimensions.get('window').width;
};
export {
  isIos,
  sreenWidth,
  sreenHeight,
  pixelSize,
  isIphoneX,
  windowHeight,
  statusBarHeight,
  bottomBarHeight,
  getWindowWidth,
};
