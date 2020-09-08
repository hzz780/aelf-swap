import {createReducer, createActions} from 'reduxsauce';
import {createSelector} from 'reselect';
import Immutable from 'seamless-immutable';
/* ------------- Types and Action Creators ------------- */
const {Types, Creators} = createActions({
  getPairs: ['pair', 'callBack'],
  createPair: ['symbolPair'],
  setPairs: ['pairs'],
  addLiquidity: ['data'],
  getAccountAssets: ['pair', 'callBack'],
  swapToken: ['data', 'callBack'],
  setMyLiquidity: ['myLiquidity'],
  removeLiquidity: ['data'],
  reSwap: [],

  getPairCandleStick: ['symbolPair', 'interval'],
  setPairCandleStick: ['pairCandleStick'],

  getPairCharts: ['symbolPair', 'range'],
  setPairCharts: ['pairCharts'],

  getPairInfo: ['symbolPair'],
  getOverviewChart: [],
  setOverviewChart: ['overviewChart'],

  getTokenInfo: ['symbol', 'callBack'],
  setTokenInfo: ['tokenInfo'],

  getAccountInfo: ['address', 'callBack'],
  setAccountInfo: ['accountInfo'],
});

export const swapTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  pairs: null,
  myLiquidity: [],
  pairCandleStick: {},
  pairCharts: {},
  overviewChart: [],
  tokenInfo: {},
  accountInfo: {},
});

/* ------------- Selectors ------------- */

const _baseSelector = state => state.swap;

export const swapSelectors = {
  pairCandleStick: createSelector(
    _baseSelector,
    base => base.pairCandleStick,
  ),
  pairCharts: createSelector(
    _baseSelector,
    base => base.pairCharts,
  ),
};

/* ------------- Reducers ------------- */
export const getPairs = state => {
  return state.merge();
};
export const setPairs = (state, {pairs}) => {
  return state.merge({pairs});
};
export const createPair = state => {
  return state.merge();
};
export const addLiquidity = state => {
  return state.merge();
};
export const getAccountAssets = state => {
  return state.merge();
};
export const swapToken = state => {
  return state.merge();
};
export const setMyLiquidity = (state, {myLiquidity}) => {
  return state.merge({myLiquidity});
};
export const removeLiquidity = state => {
  return state.merge();
};
export const reSwap = state => {
  return state.merge({
    myLiquidity: [],
  });
};

export const getPairCandleStick = state => {
  return state.merge();
};
export const setPairCandleStick = (state, {pairCandleStick}) => {
  const {pairCandleStick: candleStick} = state;
  return state.merge({
    pairCandleStick: Object.assign(
      {},
      candleStick || {},
      pairCandleStick || {},
    ),
  });
};

export const getPairCharts = state => {
  return state.merge();
};
export const setPairCharts = (state, {pairCharts}) => {
  const {pairCharts: charts} = state;
  return state.merge({
    pairCharts: Object.assign({}, charts || {}, pairCharts || {}),
  });
};
export const getPairInfo = state => {
  return state.merge();
};
export const getOverviewChart = state => {
  return state.merge();
};
export const setOverviewChart = (state, {overviewChart}) => {
  return state.merge({overviewChart});
};
export const getTokenInfo = state => {
  return state.merge();
};
export const setTokenInfo = (state, {tokenInfo}) => {
  const {tokenInfo: token} = state;
  return state.merge({
    tokenInfo: Object.assign({}, token || {}, tokenInfo || {}),
  });
};
export const getAccountInfo = state => {
  return state.merge();
};
export const setAccountInfo = (state, {accountInfo}) => {
  const {accountInfo: account} = state;
  return state.merge({
    accountInfo: Object.assign({}, account || {}, accountInfo || {}),
  });
};
/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PAIRS]: getPairs,
  [Types.SET_PAIRS]: setPairs,
  [Types.CREATE_PAIR]: createPair,
  [Types.ADD_LIQUIDITY]: addLiquidity,
  [Types.GET_ACCOUNT_ASSETS]: getAccountAssets,
  [Types.SWAP_TOKEN]: swapToken,
  [Types.SET_MY_LIQUIDITY]: setMyLiquidity,
  [Types.REMOVE_LIQUIDITY]: removeLiquidity,
  [Types.RE_SWAP]: reSwap,

  [Types.GET_PAIR_CANDLE_STICK]: getPairCandleStick,
  [Types.SET_PAIR_CANDLE_STICK]: setPairCandleStick,

  [Types.GET_PAIR_CHARTS]: getPairCharts,
  [Types.SET_PAIR_CHARTS]: setPairCharts,

  [Types.GET_PAIR_INFO]: getPairInfo,
  [Types.GET_OVERVIEW_CHART]: getOverviewChart,
  [Types.SET_OVERVIEW_CHART]: setOverviewChart,

  [Types.GET_TOKEN_INFO]: getTokenInfo,
  [Types.SET_TOKEN_INFO]: setTokenInfo,

  [Types.GET_ACCOUNT_INFO]: getAccountInfo,
  [Types.SET_ACCOUNT_INFO]: setAccountInfo,
});
