import {store} from '../../redux';
import unitConverter from './unitConverter';
const getState = () => {
  return store.getState();
};
const getDecimalTokenHigher = (token, symbol) => {
  let a = 0;
  if (store) {
    const {user} = store.getState() || {};
    const {tokenUSD} = user || {};
    if (tokenUSD) {
      const {decimals} = tokenUSD[symbol] || {};
      if (decimals) {
        a = unitConverter.toDecimalHigher(token, decimals);
      }
      console.log(tokenUSD);
    }
  }
  return a;
};
export default {
  getState,
  getDecimalTokenHigher,
};
