import {createReducer, createActions} from 'reduxsauce';
import {createSelector} from 'reselect';
import Immutable from 'seamless-immutable';
/* ------------- Types and Action Creators ------------- */
const {Types, Creators} = createActions({
  getPairs: ['pair', 'callBack'],
  setPairs: ['pairs'],
  createPair: ['symbolPair'],
  getTotalSupply: ['pairs'],
  setTotalSupply: ['totalSupplys'],

  getPairList: ['loadingPaging'],

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
  setPairInfo: ['pairInfos'],

  getOverviewChart: [],
  setOverviewChart: ['overviewChart'],

  getTokenInfo: ['symbol', 'callBack'],
  setTokenInfo: ['tokenInfo'],

  getAccountInfo: ['address', 'callBack'],
  setAccountInfo: ['accountInfo'],
  getAccountChart: ['address', 'range', 'symbolPair'],
  setAccountChart: ['accountChart'],

  getOverviewInfo: [],
  setOverviewInfo: ['overviewInfo'],

  getAccountList: ['loadingPaging', 'callBack'],
  setAccountList: ['accountList'],

  getTokenList: ['loadingPaging', 'callBack'],
  setTokenList: ['tokenList'],

  getTokenChart: ['symbol', 'range'],
  setTokenChart: ['tokenChart'],

  //pair list
  getPairSwapList: ['symbolPair', 'loadingPaging', 'callBack'],
  setPairSwap: ['pairSwap'],
  getPairAddLiquidityList: ['symbolPair', 'loadingPaging', 'callBack'],
  getPairRemoveLiquidityList: ['symbolPair', 'loadingPaging', 'callBack'],
  setPairAddLiquidity: ['pairAddLiquidity'],
  setPairRemoveLiquidity: ['pairRemoveLiquidity'],

  //symbol list
  getSymbolSwapList: ['symbol', 'loadingPaging', 'callBack'],
  setSymbolSwap: ['symbolSwap'],
  getSymbolAddLiquidityList: ['symbol', 'loadingPaging', 'callBack'],
  getSymbolRemoveLiquidityList: ['symbol', 'loadingPaging', 'callBack'],
  setSymbolAddLiquidity: ['symbolAddLiquidity'],
  setSymbolRemoveLiquidity: ['symbolRemoveLiquidity'],

  //address list
  getAddressSwapList: ['address', 'loadingPaging', 'callBack'],
  setAddressSwap: ['addressSwap'],
  getAddressAddLiquidityList: ['address', 'loadingPaging', 'callBack'],
  getAddressRemoveLiquidityList: ['address', 'loadingPaging', 'callBack'],
  setAddressAddLiquidity: ['addressAddLiquidity'],
  setAddressRemoveLiquidity: ['addressRemoveLiquidity'],
});

export const swapTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  pairs: null,
  totalSupplys: null,

  myLiquidity: [],
  pairCandleStick: {},
  pairCharts: {},
  overviewChart: [],
  pairInfos: {},
  tokenInfo: {},
  accountInfo: {},
  accountChart: {},
  overviewInfo: {},
  accountList: [],
  tokenList: [],
  tokenChart: {},

  pairSwap: {},
  pairAddLiquidity: {},
  pairRemoveLiquidity: {},

  symbolSwap: {},
  symbolAddLiquidity: {},
  symbolRemoveLiquidity: {},

  addressSwap: {},
  addressAddLiquidity: {},
  addressRemoveLiquidity: {},
});

/* ------------- Selectors ------------- */

const _baseSelector = state => state.swap;

export const swapSelectors = {
  totalSupplys: createSelector(
    _baseSelector,
    base => base.totalSupplys,
  ),
  pairCandleStick: createSelector(
    _baseSelector,
    base => base.pairCandleStick,
  ),
  pairCharts: createSelector(
    _baseSelector,
    base => base.pairCharts,
  ),
  overviewInfo: createSelector(
    _baseSelector,
    base => base.overviewInfo,
  ),
  accountList: createSelector(
    _baseSelector,
    base => base.accountList,
  ),
  tokenList: createSelector(
    _baseSelector,
    base => base.tokenList,
  ),
  tokenChart: createSelector(
    _baseSelector,
    base => base.tokenChart,
  ),

  pairSwap: createSelector(
    _baseSelector,
    base => base.pairSwap,
  ),
  pairAddLiquidity: createSelector(
    _baseSelector,
    base => base.pairAddLiquidity,
  ),
  pairRemoveLiquidity: createSelector(
    _baseSelector,
    base => base.pairRemoveLiquidity,
  ),

  symbolSwap: createSelector(
    _baseSelector,
    base => base.symbolSwap,
  ),
  symbolAddLiquidity: createSelector(
    _baseSelector,
    base => base.symbolAddLiquidity,
  ),
  symbolRemoveLiquidity: createSelector(
    _baseSelector,
    base => base.symbolRemoveLiquidity,
  ),
  accountChart: createSelector(
    _baseSelector,
    base => base.accountChart,
  ),
  addressSwap: createSelector(
    _baseSelector,
    base => base.addressSwap,
  ),
  addressAddLiquidity: createSelector(
    _baseSelector,
    base => base.addressAddLiquidity,
  ),
  addressRemoveLiquidity: createSelector(
    _baseSelector,
    base => base.addressRemoveLiquidity,
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
export const getTotalSupply = state => {
  return state.merge();
};
export const setTotalSupply = (state, {totalSupplys}) => {
  return state.merge({totalSupplys});
};

export const getPairList = state => {
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
export const setAccountChart = (state, {accountChart}) => {
  const {accountChart: account} = state;
  return state.merge({
    accountChart: Object.assign({}, account || {}, accountChart || {}),
  });
};
export const getAccountChart = state => {
  return state.merge();
};

export const getOverviewInfo = state => {
  return state.merge();
};
export const setOverviewInfo = (state, {overviewInfo}) => {
  return state.merge({overviewInfo});
};
export const setPairInfo = (state, {pairInfos}) => {
  const {pairInfos: pair} = state;
  return state.merge({
    pairInfos: Object.assign({}, pair || {}, pairInfos || {}),
  });
};
export const getAccountList = state => {
  return state.merge();
};
export const setAccountList = (state, {accountList}) => {
  return state.merge({accountList});
};

export const getTokenList = state => {
  return state.merge();
};
export const setTokenList = (state, {tokenList}) => {
  return state.merge({tokenList});
};

export const getTokenChart = state => {
  return state.merge();
};
export const setTokenChart = (state, {tokenChart}) => {
  const {tokenChart: charts} = state;
  return state.merge({
    tokenChart: Object.assign({}, charts || {}, tokenChart || {}),
  });
};

export const getPairSwapList = state => {
  return state.merge();
};
export const setPairSwap = (state, {pairSwap}) => {
  const {pairSwap: swap} = state;
  return state.merge({
    pairSwap: Object.assign({}, swap || {}, pairSwap || {}),
  });
};
export const getPairAddLiquidityList = state => {
  return state.merge();
};
export const getPairRemoveLiquidityList = state => {
  return state.merge();
};
export const setPairAddLiquidity = (state, {pairAddLiquidity}) => {
  const {pairAddLiquidity: add} = state;
  return state.merge({
    pairAddLiquidity: Object.assign({}, add || {}, pairAddLiquidity || {}),
  });
};
export const setPairRemoveLiquidity = (state, {pairRemoveLiquidity}) => {
  const {pairRemoveLiquidity: remove} = state;
  return state.merge({
    pairRemoveLiquidity: Object.assign(
      {},
      remove || {},
      pairRemoveLiquidity || {},
    ),
  });
};

export const getSymbolSwapList = state => {
  return state.merge();
};
export const setSymbolSwap = (state, {symbolSwap}) => {
  const {symbolSwap: swap} = state;
  return state.merge({
    symbolSwap: Object.assign({}, swap || {}, symbolSwap || {}),
  });
};
export const getSymbolAddLiquidityList = state => {
  return state.merge();
};
export const getSymbolRemoveLiquidityList = state => {
  return state.merge();
};
export const setSymbolAddLiquidity = (state, {symbolAddLiquidity}) => {
  const {symbolAddLiquidity: add} = state;
  return state.merge({
    symbolAddLiquidity: Object.assign({}, add || {}, symbolAddLiquidity || {}),
  });
};
export const setSymbolRemoveLiquidity = (state, {symbolRemoveLiquidity}) => {
  const {symbolRemoveLiquidity: remove} = state;
  return state.merge({
    symbolRemoveLiquidity: Object.assign(
      {},
      remove || {},
      symbolRemoveLiquidity || {},
    ),
  });
};
export const getAddressSwapList = state => {
  return state.merge();
};
export const setAddressSwap = (state, {addressSwap}) => {
  const {addressSwap: swap} = state;
  return state.merge({
    addressSwap: Object.assign({}, swap || {}, addressSwap || {}),
  });
};
export const getAddressAddLiquidityList = state => {
  return state.merge();
};
export const getAddressRemoveLiquidityList = state => {
  return state.merge();
};
export const setAddressAddLiquidity = (state, {addressAddLiquidity}) => {
  const {addressAddLiquidity: add} = state;
  return state.merge({
    addressAddLiquidity: Object.assign(
      {},
      add || {},
      addressAddLiquidity || {},
    ),
  });
};
export const setAddressRemoveLiquidity = (state, {addressRemoveLiquidity}) => {
  const {addressRemoveLiquidity: remove} = state;
  return state.merge({
    addressRemoveLiquidity: Object.assign(
      {},
      remove || {},
      addressRemoveLiquidity || {},
    ),
  });
};
/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.GET_PAIRS]: getPairs,
  [Types.SET_PAIRS]: setPairs,
  [Types.CREATE_PAIR]: createPair,
  [Types.GET_TOTAL_SUPPLY]: getTotalSupply,
  [Types.SET_TOTAL_SUPPLY]: setTotalSupply,

  [Types.GET_PAIR_LIST]: getPairList,

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
  [Types.SET_PAIR_INFO]: setPairInfo,

  [Types.GET_OVERVIEW_CHART]: getOverviewChart,
  [Types.SET_OVERVIEW_CHART]: setOverviewChart,

  [Types.GET_TOKEN_INFO]: getTokenInfo,
  [Types.SET_TOKEN_INFO]: setTokenInfo,

  [Types.GET_ACCOUNT_INFO]: getAccountInfo,
  [Types.SET_ACCOUNT_INFO]: setAccountInfo,
  [Types.GET_ACCOUNT_CHART]: getAccountChart,
  [Types.SET_ACCOUNT_CHART]: setAccountChart,

  [Types.GET_OVERVIEW_INFO]: getOverviewInfo,
  [Types.SET_OVERVIEW_INFO]: setOverviewInfo,

  [Types.GET_ACCOUNT_LIST]: getAccountList,
  [Types.SET_ACCOUNT_LIST]: setAccountList,

  [Types.GET_TOKEN_LIST]: getTokenList,
  [Types.SET_TOKEN_LIST]: setTokenList,

  [Types.GET_TOKEN_CHART]: getTokenChart,
  [Types.SET_TOKEN_CHART]: setTokenChart,

  [Types.GET_PAIR_SWAP_LIST]: getPairSwapList,
  [Types.SET_PAIR_SWAP]: setPairSwap,
  [Types.GET_PAIR_ADD_LIQUIDITY_LIST]: getPairAddLiquidityList,
  [Types.GET_PAIR_REMOVE_LIQUIDITY_LIST]: getPairRemoveLiquidityList,
  [Types.SET_PAIR_ADD_LIQUIDITY]: setPairAddLiquidity,
  [Types.SET_PAIR_REMOVE_LIQUIDITY]: setPairRemoveLiquidity,

  [Types.GET_SYMBOL_SWAP_LIST]: getSymbolSwapList,
  [Types.SET_SYMBOL_SWAP]: setSymbolSwap,
  [Types.GET_SYMBOL_ADD_LIQUIDITY_LIST]: getSymbolAddLiquidityList,
  [Types.GET_SYMBOL_REMOVE_LIQUIDITY_LIST]: getSymbolRemoveLiquidityList,
  [Types.SET_SYMBOL_ADD_LIQUIDITY]: setSymbolAddLiquidity,
  [Types.SET_SYMBOL_REMOVE_LIQUIDITY]: setSymbolRemoveLiquidity,

  [Types.GET_ADDRESS_SWAP_LIST]: getAddressSwapList,
  [Types.SET_ADDRESS_SWAP]: setAddressSwap,
  [Types.GET_ADDRESS_ADD_LIQUIDITY_LIST]: getAddressAddLiquidityList,
  [Types.GET_ADDRESS_REMOVE_LIQUIDITY_LIST]: getAddressRemoveLiquidityList,
  [Types.SET_ADDRESS_ADD_LIQUIDITY]: setAddressAddLiquidity,
  [Types.SET_ADDRESS_REMOVE_LIQUIDITY]: setAddressRemoveLiquidity,
});
