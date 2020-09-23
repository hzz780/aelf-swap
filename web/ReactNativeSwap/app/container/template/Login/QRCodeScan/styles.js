import {StyleSheet} from 'react-native';
import {sreenWidth, isIos} from '../../../../utils/common/device';
import {pTd} from '../../../../utils/common';
import {Colors} from '../../../../assets/theme';
//Android BarCodeScanner will not display full screen, distinguish platform style
export const scanHeight = isIos ? 196 : sreenWidth * 0.67;
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  spinnerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerStyle: {
    alignSelf: 'center',
  },
  border: {
    alignSelf: 'center',
    width: scanHeight,
    height: 2,
    backgroundColor: Colors.primaryColor,
    borderRadius: 50,
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10,
  },
  ...(isIos
    ? {
        QRCodeBox: {
          flex: 1,
        },
        scanBox: {
          alignItems: 'center',
          marginTop: pTd(260),
        },
        scanBG: {
          width: 200,
          height: 200,
        },
      }
    : {
        QRCodeBox: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000', // the rock-solid workaround
        },
        scanBox: {
          alignItems: 'center',
        },
        scanBG: {
          width: sreenWidth * 0.7,
          height: sreenWidth * 0.7,
        },
      }),
});
