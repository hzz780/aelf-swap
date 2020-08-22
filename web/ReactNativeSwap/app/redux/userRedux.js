import {createReducer, createActions} from 'reduxsauce';
import {createSelector} from 'reselect';
/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  onAppInit: ['privateKey'],
  onRegistered: ['newWallet', 'pwd', 'userName'],
  onLoginSuccess: ['data'],
  setUserData: ['data'],
  getUserBalance: [],
  setUserBalance: ['balance'],
  deleteUser: ['address'],
  setUserList: ['userList'],
  logOut: ['address'],
  transfer: ['param'],
  setSaveQRCode: ['saveQRCode'],
  getAllowanceList: [],
  setAllowanceList: ['allowanceList'],
  onApprove: ['amount', 'appContractAddress'],
  getAllTokens: [],
  setAllTokens: ['allTokens'],

  getUserBalances: ['address'],
  setUserBalances: ['userBalances'],

  getTokenUsd: [],
  setTokenUsd: ['tokenUSD'],

  approve: [],
});

export const userTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  address: 0,
  balance: 0,
  userName: '',
  userList: [],
  saveQRCode: false,
  keystore: {},
  allowanceList: [],
  privateKey: null,
  allTokens: [],
  userBalances: {},
  tokenUSD: {},
};

/* ------------- Selectors ------------- */

const _baseSelector = state => state.user;

export const userSelectors = {
  getKeystore: createSelector(
    _baseSelector,
    base => base.keystore,
  ),
  getAddress: createSelector(
    _baseSelector,
    base => base.address,
  ),
  getUserList: createSelector(
    _baseSelector,
    base => base.userList,
  ),
  getUserName: createSelector(
    _baseSelector,
    base => base.userName,
  ),
  getUserInfo: createSelector(
    [state => state.user, state => state.contracts],
    (user, settings) => ({
      ...user,
      ...settings,
    }),
  ),
  allowanceList: createSelector(
    _baseSelector,
    base => base.allowanceList,
  ),
  getPrivateKey: createSelector(
    _baseSelector,
    base => base.privateKey,
  ),
  getBalance: createSelector(
    _baseSelector,
    base => base.balance,
  ),
  allTokens: createSelector(
    _baseSelector,
    base => base.allTokens,
  ),
  userBalances: createSelector(
    _baseSelector,
    base => base.userBalances,
  ),
  tokenUSD: createSelector(
    _baseSelector,
    base => base.tokenUSD,
  ),
};

/* ------------- Reducers ------------- */
export const onRegistered = state => {
  return state;
};
export const onAppInit = state => {
  return state;
};
export const onLoginSuccess = state => {
  return state;
};
export const setUserData = (state, {data}) => {
  return Object.assign({}, state, data);
};
export const getUserBalance = state => {
  return state;
};
export const setUserBalance = (state, {balance}) => {
  return Object.assign({}, state, {balance});
};
export const deleteUser = state => {
  return state;
};
export const logOut = state => {
  return state;
};
export const setUserList = (state, {userList}) => {
  return Object.assign({}, state, {userList});
};
export const transfer = state => {
  return state;
};
export const setSaveQRCode = (state, {saveQRCode}) => {
  return Object.assign({}, state, {saveQRCode});
};
export const getAllowanceList = state => {
  return state;
};
export const setAllowanceList = (state, {allowanceList}) => {
  return Object.assign({}, state, {allowanceList});
};
export const onApprove = state => {
  return state;
};
export const getAllTokens = state => {
  return state;
};
export const setAllTokens = (state, {allTokens}) => {
  return Object.assign({}, state, {allTokens});
};
export const getUserBalances = state => {
  return state;
};
export const setUserBalances = (state, {userBalances}) => {
  return Object.assign({}, state, {userBalances});
};
export const getTokenUsd = state => {
  return state;
};
export const setTokenUsd = (state, {tokenUSD}) => {
  return Object.assign({}, state, {tokenUSD});
};
export const approve = state => {
  return state;
};

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.ON_REGISTERED]: onRegistered,
  [Types.ON_APP_INIT]: onAppInit,
  [Types.ON_LOGIN_SUCCESS]: onLoginSuccess,
  [Types.SET_USER_DATA]: setUserData,
  [Types.GET_USER_BALANCE]: getUserBalance,
  [Types.SET_USER_BALANCE]: setUserBalance,
  [Types.DELETE_USER]: deleteUser,
  [Types.SET_USER_LIST]: setUserList,
  //logOut
  [Types.LOG_OUT]: logOut,
  //transfer
  [Types.TRANSFER]: transfer,
  [Types.SET_SAVE_QR_CODE]: setSaveQRCode,
  [Types.GET_ALLOWANCE_LIST]: getAllowanceList,
  [Types.SET_ALLOWANCE_LIST]: setAllowanceList,
  [Types.ON_APPROVE]: onApprove,

  //
  [Types.GET_ALL_TOKENS]: getAllTokens,
  [Types.SET_ALL_TOKENS]: setAllTokens,
  [Types.GET_USER_BALANCES]: getUserBalances,
  [Types.SET_USER_BALANCES]: setUserBalances,

  [Types.GET_TOKEN_USD]: getTokenUsd,
  [Types.SET_TOKEN_USD]: setTokenUsd,
  [Types.APPROVE]: approve,
});
