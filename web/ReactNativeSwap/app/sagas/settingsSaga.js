/* ***********************************************************
 * A short word on how to use this automagically generated file.
 * We're often asked in the ignite glitter channel how to connect
 * to a to a third party api, so we thought we'd demonstrate - but
 * you should know you can use sagas for other flow control too.
 *
 * Other points:
 *  - You'll need to add this saga to sagas/index.js
 *  - This template uses the api declared in sagas/index.js, so
 *    you'll need to define a constant in that file.
 *************************************************************/

import {all, takeLatest, put, delay} from 'redux-saga/effects';
import settingsActions, {settingsTypes} from '../redux/settingsRedux';
import * as Location from 'expo-location';
import {permissionDenied} from '../utils/pages';
import i18n from 'i18n-js';
import config from '../config';
import {ActionSheet, Loading} from '../components/template';
function* getLocationSaga() {
  const blackList = config.ISOCountryCodeBlackList;
  if (!Array.isArray(blackList)) {
    yield put(settingsActions.changeCanUse(true));
    return;
  }
  try {
    yield delay(500);
    const {status} = yield Location.requestPermissionsAsync();
    if (status !== 'granted') {
      permissionDenied(i18n.t('permission.getLocation'));
      return;
    }
    Loading.show(i18n.t('userSaga.getLocationTip'));
    const location = yield Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    const {coords} = location;
    const geocode = yield Location.reverseGeocodeAsync(coords);
    const {isoCountryCode} = geocode[0] || {};
    console.log(geocode, '=====geocode');
    if (blackList.includes(isoCountryCode)) {
      ActionSheet.alert(
        i18n.t('safetyReminder'),
        i18n.t('alert.locationTips'),
        [{title: i18n.t('determine')}],
      );
    } else {
      yield put(settingsActions.changeCanUse(true));
    }
    Loading.destroy();
  } catch (error) {
    Loading.destroy();
    console.log('getLocationSaga', error);
  }
}
export default function* SettingsSaga() {
  yield all([yield takeLatest(settingsTypes.GET_LOCATION, getLocationSaga)]);
}
