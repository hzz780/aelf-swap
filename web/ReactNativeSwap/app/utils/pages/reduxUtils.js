import {store} from '../../redux';
import unitConverter from './unitConverter';
const getState = () => {
  return store.getState();
};
const getTokenDecimals = symbol => {
  let decimals = 8;
  if (store) {
    const {user} = store.getState() || {};
    const {allTokens} = user || {};
    if (Array.isArray(allTokens)) {
      const tokenO = allTokens.find(i => {
        return i.symbol === symbol;
      });
      if (tokenO) {
        decimals = tokenO.decimals || decimals;
      }
    }
  }
  return decimals;
};
const getDecimalTokenHigher = (token, symbol) => {
  let a = 0;
  if (store) {
    const {user} = store.getState() || {};
    const {tokenUSD} = user || {};
    if (tokenUSD) {
      const decimals = getTokenDecimals(symbol);
      if (decimals) {
        a = unitConverter.toDecimalHigher(token, decimals);
      }
    }
  }
  return parseInt(a, 10);
};
const getAddData = (firstToken, secondToken, currentPair) => {
  let symbolA = firstToken.token,
    symbolB = secondToken.token,
    amountADesired = getDecimalTokenHigher(firstToken.input, firstToken.token),
    amountBDesired = getDecimalTokenHigher(
      secondToken.input,
      secondToken.token,
    );
  console.log(currentPair.symbolA, symbolA, '-------');
  if (currentPair.symbolA !== symbolA) {
    symbolA = secondToken.token;
    symbolB = firstToken.token;
    amountADesired = getDecimalTokenHigher(
      secondToken.input,
      secondToken.token,
    );
    amountBDesired = getDecimalTokenHigher(firstToken.input, firstToken.token);
    console.log(amountADesired, amountBDesired);
  }
  return {symbolA, symbolB, amountADesired, amountBDesired};
};
export default {
  getState,
  getDecimalTokenHigher,
  getAddData,
  getTokenDecimals,
};
