import {Platform, PermissionsAndroid, Linking} from 'react-native';
import {download, saveFilePath} from './utilFs';
import {captureRef} from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Clipboard from '@react-native-community/clipboard';
import CommonToast from '../../components/template/CommonToast';
import ActionSheet from '../../components/template/ActionSheet';
import i18n from 'i18n-js';
import * as LocalAuthentication from 'expo-local-authentication';
import {isIos} from '../../utils/common/device';
import * as ImagePicker from 'expo-image-picker';
const sleep = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
//Is it a number
const isNumber = val => {
  try {
    var regPos = /^\d+(\.\d+)?$/; //Integer
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //Floating point
    return regPos.test(val) || regNeg.test(val);
  } catch (error) {
    return false;
  }
};
//Save pictures to album
const saveImagesToAlbum = async FilePath => {
  return new Promise((resolve, reject) => {
    CameraRoll.save(FilePath, {type: 'photo'})
      .then(() => {
        resolve(true);
        CommonToast.success(i18n.t('saveSuccess'));
      })
      .catch(err => {
        reject(err);
        CommonToast.fail(i18n.t('fail'));
      });
  });
};
//Check before saving pictures to album
const checkImageToAlbum = async url => {
  if (Platform.OS === 'android') {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ];
      const granteds = await PermissionsAndroid.requestMultiple(permissions);
      if (
        granteds['android.permission.CAMERA'] === 'granted' &&
        granteds['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      ) {
        if (typeof url === 'string' && url.includes('http')) {
          const downFilePath = saveFilePath(new Date().getTime() + '.png');
          return await await download(url, downFilePath).then(async () => {
            saveImagesToAlbum('file://' + downFilePath);
          });
        } else {
          return await saveImagesToAlbum('file://' + url);
        }
      } else {
        CommonToast.fail(i18n.t('permissionDen'));
      }
    } catch (err) {
      CommonToast.fail(i18n.t('fail'));
    }
  } else {
    return await saveImagesToAlbum(url);
  }
};
const screenshots = async saveView => {
  const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
  if (status !== 'granted') {
    permissionDenied(i18n.t('permission.cameraRoll'));
    return false;
  }
  return new Promise((resolve, reject) => {
    if (saveView) {
      captureRef(saveView, {format: 'jpg'})
        .then(async uri => {
          if (uri) {
            resolve(await checkImageToAlbum(uri));
          }
        })
        .catch(e => {
          reject();
          CommonToast.fail(i18n.t('fail'));
        });
    }
  });
};
/* Biometrics */
const touchAuth = () => {
  const options = {
    hintMessage: i18n.t('permission.verifyIdentity'),
    fallbackLabel: i18n.t('permission.usePwd'),
    promptMessage: i18n.t('permission.authenticate'),
  };
  return new Promise((resolve, reject) => {
    LocalAuthentication.isEnrolledAsync()
      .then(() => {
        LocalAuthentication.authenticateAsync(options)
          .then(suc => {
            const {success} = suc;
            if (success) {
              resolve();
            } else {
              reject();
            }
          })
          .catch(error => {
            reject();
          });
      })
      .catch(error => {
        reject();
      });
  });
};
/**
 * permissionDenied
 * @param {string} permissionType  permission type
 * @param {string} use   used for
 */
const permissionDenied = (type, use) => {
  if (isIos) {
    ActionSheet.alert(
      i18n.t('permission.denied'),
      `${i18n.t('permission.iosDeniedDetails', {type})}${use ? ',' + use : ''}`,
      [
        {
          title: i18n.t('permission.openSettings'),
          onPress: () =>
            Linking.openURL('app-settings:').catch(e => {
              ActionSheet.alert(
                i18n.t('permission.openFailed'),
                i18n.t('permission.failedDetails', {type}),
                [{title: i18n.t('determine')}],
              );
            }),
        },
      ],
    );
  } else {
    ActionSheet.alert(
      i18n.t('permission.denied'),
      `${i18n.t('permission.anDeniedDetails', {type})}${use ? ',' + use : ''}`,
      [{title: i18n.t('determine')}],
    );
  }
};
/**
 * @param {Array} list
 * @return Array
 */
const removeDuplicates = list => {
  let map = new Map();
  Array.isArray(list) &&
    list.forEach(item => {
      item && map.set(item.address, item);
    });
  return [...map.values()];
};
const onCopyText = text => {
  try {
    Clipboard.setString(text);
    CommonToast.success(i18n.t('copied'));
  } catch (error) {
    console.log('onCopyText', error);
  }
};
export {
  isNumber,
  screenshots,
  checkImageToAlbum,
  touchAuth,
  permissionDenied,
  removeDuplicates,
  onCopyText,
  sleep,
};
