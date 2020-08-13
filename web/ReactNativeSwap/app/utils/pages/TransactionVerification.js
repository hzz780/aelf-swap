import {touchAuth} from '.';
import {VerifyPassword, CommonToast} from '../../components/template';
import reduxUtils from './reduxUtils';
import i18n from 'i18n-js';
const show = callBack => {
  const {settings} = reduxUtils.getState() || {};
  const {biometrics, payPw} = settings || {};
  if (!payPw || payPw.length !== 6) {
    CommonToast.fail(i18n.t('noTransactionPwdTip'));
    return;
  }
  if (biometrics) {
    touchAuth()
      .then(() => {
        callBack && callBack(true);
      })
      .catch(() => VerifyPassword.payShow(callBack));
  } else {
    VerifyPassword.payShow(callBack);
  }
};
export default {
  show,
};
