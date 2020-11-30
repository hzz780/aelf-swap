import {createReducer, createActions} from 'reduxsauce';
import Immutable from 'seamless-immutable';
import {createSelector} from 'reselect';
import i18n from 'i18n-js';
import {DEFAULT_CURRENCY} from '../config/constant';
/* ------------- Types and Action Creators ------------- */
const {Types, Creators} = createActions({
  changeLanguage: ['language'],
  changeBarStyle: ['barStyle'],
  changePayPw: ['payPw'],
  changeBiometrics: ['biometrics'],
  changeInform: ['inform'],
  changeCurrencyUnit: ['currencyUnit'],
  changeSecurityLock: ['securityLock'],
  reSetSettings: [],
  getLocation: [],
  changeCanUse: ['canUse'],
});

export const settingsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  language: null,
  barStyle: null,
  payPw: null,
  biometrics: null,
  inform: null,
  currencyUnit: DEFAULT_CURRENCY,
  securityLock: null,
  canUse: null,
});

/* ------------- Selectors ------------- */

const _baseSelector = state => state.settings;

export const settingsSelectors = {
  getLanguage: createSelector(_baseSelector, base => base.language),
  getBarStyle: createSelector(_baseSelector, base => base.barStyle),
  getPayPw: createSelector(_baseSelector, base => base.payPw),
  getBiometrics: createSelector(_baseSelector, base => base.biometrics),
  getInform: createSelector(_baseSelector, base => base.inform),
  getCurrencyUnit: createSelector(_baseSelector, base => base.currencyUnit),
  getSecurityLock: createSelector(_baseSelector, base => base.securityLock),
  getCanUse: createSelector(_baseSelector, base => base.canUse),
};

/* ------------- Reducers ------------- */
export const changeLanguage = (state, {language}) => {
  i18n.switchLanguage(language);
  return state.merge({language});
};
export const changeBarStyle = (state, {barStyle}) => {
  return state.merge({barStyle});
};
export const changePayPw = (state, {payPw}) => {
  return state.merge({payPw});
};
export const changeBiometrics = (state, {biometrics}) => {
  return state.merge({biometrics});
};
export const changeInform = (state, {inform}) => {
  return state.merge({inform});
};
export const changeCurrencyUnit = (state, {currencyUnit}) => {
  return state.merge({currencyUnit});
};
export const changeSecurityLock = (state, {securityLock}) => {
  return state.merge({securityLock});
};
export const reSetSettings = state => {
  return state.merge({
    payPw: null,
    biometrics: null,
    securityLock: null,
    canUse: null,
  });
};
export const getLocation = state => {
  return state.merge();
};
export const changeCanUse = (state, {canUse}) => {
  return state.merge({canUse});
};
/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_LANGUAGE]: changeLanguage,
  [Types.CHANGE_BAR_STYLE]: changeBarStyle,
  [Types.CHANGE_PAY_PW]: changePayPw,
  [Types.CHANGE_BIOMETRICS]: changeBiometrics,
  [Types.CHANGE_INFORM]: changeInform,
  [Types.CHANGE_CURRENCY_UNIT]: changeCurrencyUnit,
  [Types.CHANGE_SECURITY_LOCK]: changeSecurityLock,
  [Types.RE_SET_SETTINGS]: reSetSettings,
  [Types.GET_LOCATION]: getLocation,
  [Types.CHANGE_CAN_USE]: changeCanUse,
});
