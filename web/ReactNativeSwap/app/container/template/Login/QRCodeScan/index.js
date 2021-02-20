import React, {useEffect, memo, useCallback, useRef} from 'react';
import {
  Text,
  View,
  default as Easing,
  ImageBackground,
  Animated,
} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {GStyle} from '../../../../assets/theme';
import {CommonHeader, CommonToast} from '../../../../components/template';
import i18n from 'i18n-js';
import {iconScanRect} from '../../../../assets/images';
import styles, {scanHeight} from './styles';
import {useSetState} from '../../../../utils/pages/hooks';
import * as ImagePicker from 'expo-image-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import navigationService from '../../../../utils/common/navigationService';
import {permissionDenied} from '../../../../utils/pages';
import {isIos} from '../../../../utils/common/device';
const QRCodeLogin = props => {
  const {scanResult} = props.route.params || {};
  const intervalRef = useRef(null);
  const [state, setState] = useSetState({
    scanned: false,
    moveAnim: new Animated.Value(-2),
  });
  useEffect(() => {
    startAnimation();
    return () => {
      intervalRef.current && clearTimeout(intervalRef.current);
    };
  }, [setState, startAnimation]);
  const startAnimation = useCallback(() => {
    moveAnim.setValue(-2);
    Animated.sequence([
      Animated.timing(moveAnim, {
        toValue: scanHeight,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(moveAnim, {
        toValue: -1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => startAnimation());
  }, [moveAnim]);
  const {moveAnim, scanned} = state;
  /* 二维码扫描结果 */
  const onBarCodeRead = useCallback(
    result => {
      try {
        if (scanned) {
          return;
        }
        setState({scanned: true});
        intervalRef.current = setTimeout(() => {
          setState({scanned: false});
        }, 1000);
        const {data} = result; //Determine whether to log in the QR code
        if (data && typeof data === 'string' && data.includes('aelf')) {
          CommonToast.success(i18n.t('success'));
          if (scanResult) {
            navigationService.navigate('Transfer', JSON.parse(data));
          } else {
            navigationService.navigate('EnterPassword', JSON.parse(data));
          }
        } else {
          CommonToast.fail(i18n.t('login.qRCodeScan.QRCodeErr'));
        }
      } catch (error) {
        CommonToast.fail(i18n.t('login.qRCodeScan.QRCodeErr'));
      }
    },
    [scanResult, scanned, setState],
  );
  /* Identify QR code */
  const recognize = useCallback(
    async images => {
      try {
        const imageData = await BarCodeScanner.scanFromURLAsync(images.uri, [
          BarCodeScanner.Constants.BarCodeType.qr,
        ]);

        if (imageData.length) {
          onBarCodeRead(imageData[0]);
        } else {
          CommonToast.text(i18n.t('login.qRCodeScan.imageFailed'));
        }
      } catch (error) {
        const {message, stack} = error;
        const Error =
          typeof error === 'string'
            ? `Error:${error}`
            : `${message ? `Error: ${message}\n` : ''}${
                stack ? `Stack: ${stack}` : ''
              }`;
        CommonToast.text(Error);
      }
    },
    [onBarCodeRead],
  );
  /* Call album */
  const usePhotoAlbum = useCallback(async () => {
    try {
      const camera = await ImagePicker.requestCameraPermissionsAsync();
      const cameraRoll = await ImagePicker.requestCameraRollPermissionsAsync();
      if (camera.status !== 'granted' && cameraRoll.status !== 'granted') {
        permissionDenied(i18n.t('permission.cameraRoll'));
      } else {
        if (isIos) {
          const images = await ImagePicker.launchImageLibraryAsync({
            allowMultipleSelection: false,
          });
          if (images.cancelled) {
            CommonToast.text(i18n.t('login.qRCodeScan.UserCanceled'));
          } else if (images.uri) {
            recognize(images);
          } else {
            CommonToast.text(i18n.t('login.qRCodeScan.imageFailed'));
          }
        } else {
          launchImageLibrary({mediaType: 'photo'}, images => {
            if (images.didCancel) {
              CommonToast.text(i18n.t('login.qRCodeScan.UserCanceled'));
            } else if (images.uri) {
              recognize(images);
            } else {
              CommonToast.text(i18n.t('login.qRCodeScan.imageFailed'));
            }
          });
        }
      }
    } catch (error) {
      const {message, stack} = error;
      const Error =
        typeof error === 'string'
          ? `Error:${error}`
          : `${message ? `Error: ${message}\n` : ''}${
              stack ? `Stack: ${stack}` : ''
            }`;
      console.log(message, stack);
      CommonToast.text(Error);
    }
  }, [recognize]);

  return (
    <View style={GStyle.container}>
      <CommonHeader
        title={scanResult ? i18n.t('scan') : i18n.t('login.login')}
        canBack
        rightTitle={i18n.t('album')}
        rightOnPress={usePhotoAlbum}
      />
      <BarCodeScanner onBarCodeScanned={onBarCodeRead} style={styles.QRCodeBox}>
        <View style={styles.scanBox}>
          <ImageBackground source={iconScanRect} style={styles.scanBG}>
            <Animated.View
              style={[
                styles.border,
                {transform: [{translateY: state.moveAnim}]},
              ]}
            />
          </ImageBackground>
          <Text style={styles.rectangleText}>
            {i18n.t('login.qRCodeScan.scanQRCode')}
          </Text>
        </View>
      </BarCodeScanner>
    </View>
  );
};

export default memo(QRCodeLogin);
