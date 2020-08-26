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
  getPairCandleStick: ['symbolPair', 'range'],
});

export const swapTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  pairs: null,
  myLiquidity: [],
});

/* ------------- Selectors ------------- */

const _baseSelector = state => state.swap;

export const swapSelectors = {
  getContracts: createSelector(
    _baseSelector,
    base => base.contracts,
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
});
