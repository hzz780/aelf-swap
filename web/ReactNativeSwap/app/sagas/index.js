import {fork, all} from 'redux-saga/effects';
import userSaga from './userSaga';
import settingsSaga from './settingsSaga';
import swapSaga from './swapSaga';

/* ------------- Connect Types To Sagas ------------- */
export default function* root() {
  yield all([userSaga, settingsSaga, swapSaga].map(fork));
}
