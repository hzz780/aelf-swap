import {createReducer, createActions} from 'reduxsauce';
import {createSelector} from 'reselect';

/* ------------- Types and Action Creators ------------- */

const {Types, Creators} = createActions({
  setContracts: ['data'],
});

export const contractsTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = {
  contracts: null,
};

/* ------------- Selectors ------------- */

const _baseSelector = state => state.contracts;

export const contractsSelectors = {
  getContracts: createSelector(_baseSelector, base => base.contracts),
};

/* ------------- Reducers ------------- */
export const setContracts = (state, {data}) => {
  return Object.assign({}, state, data);
};
/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_CONTRACTS]: setContracts,
});
