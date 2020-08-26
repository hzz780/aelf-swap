import config from '../../config';
const {swapFee, swapDeadline, swapFloat} = config;
const digits = count => {
  const floatPart = String(count).split('.')[1];
  if (count && floatPart && floatPart.length > 8) {
    count = count.toFixed(8);
  }
  return count;
};
const detailsPrice = (reserveA, reserveB) => {
  if (reserveA && reserveB) {
    reserveB = Number(reserveB);
    reserveA = Number(reserveA);
    if (reserveA === 0 || reserveB === 0) {
      return 0;
    } else {
      return digits(parseFloat(reserveB / reserveA));
    }
  } else {
    return 0;
  }
};
const getUSD = (symbolA, USDS) => {
  if (USDS) {
    const {USD} = USDS[symbolA] || {};
    return USD;
  }
};

const getSwapUSD = (item, USDS) => {
  if (!item) {
    return;
  }
  let text = '$ 0';
  const USDA = getUSD(item.symbolA, USDS);
  const USDB = getUSD(item.symbolB, USDS);
  if (USDB || USDA) {
    let number = 0;
    if (USDA && USDB) {
      number = USDA * item.reserveA + USDB * item.reserveB;
    } else {
      if (USDA) {
        number = USDA * item.reserveA * 2;
      } else if (USDB) {
        number = USDB * item.reserveB * 2;
      }
      number = digits(number);
    }
    text = `$ ${number || '0'}`;
  }
  return text;
};
const getPairUSD = (item, USDS) => {
  let text = '$ 0';
  const USDA = getUSD(item.symbolA, USDS);
  const USDB = getUSD(item.symbolB, USDS);
  if (USDB || USDA) {
    let number = 0;
    if (USDA) {
      number = USDA;
    } else if (USDB) {
      number = USDB;
    }
    number = digits(number);
    text = `$ ${number || '0'}`;
  }
  return text;
};
/**
 * @param {Array} list
 * @return Array
 */
const removeDuplicates = (list, type) => {
  let map = new Map();
  Array.isArray(list) &&
    list.forEach(item => {
      item && map.set(item[type], item);
    });
  return [...map.values()];
};
const getTypeTokenList = (pairs, token, userBalances) => {
  return pairs.map(item => {
    if (item.symbolA === token?.token) {
      return {
        reserve: item.reserveB,
        token: item.symbolB,
        balance: userBalances[item.symbolB] || 0,
      };
    } else if (item.symbolB === token?.token) {
      return {
        reserve: item.reserveA,
        token: item.symbolA,
        balance: userBalances[item.symbolA] || 0,
      };
    }
  });
};
const getTokenList = (pairs, userBalances, type, token) => {
  let tokenList = [];
  if (Array.isArray(pairs)) {
    let arr = [];
    pairs.forEach(item => {
      arr.push({
        reserve: item.reserveA,
        token: item.symbolA,
        balance: userBalances[item.symbolA] || 0,
      });
      arr.push({
        reserve: item.reserveB,
        token: item.symbolB,
        balance: userBalances[item.symbolB] || 0,
      });
    });
    tokenList = arr;
    if (token?.token) {
      tokenList = getTypeTokenList(pairs, token, userBalances);
    }
  }
  tokenList = removeDuplicates(tokenList, 'token');
  return tokenList;
};
const judgmentNaN = s => {
  if (String(s) === 'NaN') {
    return '';
  }
  return s;
};
const getAmounB = (amountA, reserveA, reserveB) => {
  if (!amountA) {
    return '';
  }
  const a = (amountA * reserveB) / reserveA;
  let s = String(digits(a));
  return judgmentNaN(s);
};
const getOutInput = (rA, rB, aA) => {
  rA = Number(rA);
  rB = Number(rB);
  aA = Number(aA);
  if (!aA) {
    return '';
  }
  const a = rB - (rA * rB) / (rA + aA * (1 - swapFee));
  let s = String(digits(a));
  return judgmentNaN(s);
};
const getInInput = (rA, rB, aB) => {
  rA = Number(rA);
  rB = Number(rB);
  aB = Number(aB);
  if (!aB) {
    return '';
  }
  const k = rA * rB;
  const kb = rB - aB;
  const a = (k / kb - rA) / (1 - swapFee);
  let s = String(digits(a));

  return judgmentNaN(s);
};

const judgmentToken = token => {
  if (
    token &&
    Number(token.input) > 0 &&
    Number(token.balance) >= Number(token.input)
  ) {
    return true;
  }
};
const getAmoun = (a, b) => {
  if (a && b) {
    return digits(a / b);
  } else {
    return '-';
  }
};
const getSwapFee = a => {
  if (!a) {
    return '-';
  }
  let s = String(digits(a * swapFee));
  return judgmentNaN(s);
};
const getSold = (t, f) => {
  let s = String(digits(t * f));
  return judgmentNaN(s);
};
const getDeadline = () => {
  return {
    seconds: parseInt(new Date().getTime() / 1000, 10) + swapDeadline,
    nanos: 0,
  };
};
const getPoolToken = (balance, totalSupply, reserve) => {
  let s = String(digits((balance / totalSupply) * reserve));
  return judgmentNaN(s);
};
const getPoolShare = (balance, totalSupply) => {
  let s = Math.round((balance / totalSupply) * 10000) / 100 + '%';
  return judgmentNaN(s);
};
const getReserve = (tA, tB, pairs) => {
  let sA = tA.token;
  let sB = tB.token;
  if (typeof tA === 'string') {
    sA = tA;
  }
  if (typeof tB === 'string') {
    sB = tB;
  }
  let obj = {rA: 0, rB: 0};
  if (Array.isArray(pairs)) {
    pairs.forEach(item => {
      const {reserveA, reserveB, symbolA, symbolB} = item;
      if (sA === symbolA && sB === symbolB) {
        obj = {rA: reserveA, rB: reserveB};
      }
      if (sB === symbolA && sA === symbolB) {
        obj = {rA: reserveB, rB: reserveA};
      }
    });
  }
  return obj;
};
const getSwapMinFloat = a => {
  return parseInt(a * (1 - swapFloat), 10);
};
const getWillPool = (a, r, to) => {
  const p = (a / r) * to;
  return p;
};
const willPoolTokens = (A, B, pair) => {
  let p;
  if (A?.input && B?.input && pair) {
    if (A.token === pair.symbolA) {
      const aP = getWillPool(A.input, pair.reserveA, pair.totalSupply);
      const bP = getWillPool(B.input, pair.reserveB, pair.totalSupply);
      p = aP > bP ? aP : bP;
    } else if (A.token === pair.symbolB) {
      const aP = getWillPool(A.input, pair.reserveB, pair.totalSupply);
      const bP = getWillPool(B.input, pair.reserveA, pair.totalSupply);
      p = aP > bP ? aP : bP;
    }
  }
  return digits(p);
};
const getPair = (A, B, pairs) => {
  if (A.token && B.token && Array.isArray(pairs)) {
    return pairs.find(item => {
      const {symbolA, symbolB} = item;
      if (
        (A.token === symbolA && B.token === symbolB) ||
        (B.token === symbolA && A.token === symbolB)
      ) {
        return true;
      }
    });
  }
};
const getSharePool = (willPoolToken, totalSupply) => {
  willPoolToken = Number(willPoolToken);
  if (willPoolToken && totalSupply) {
    return getPoolShare(willPoolToken, willPoolToken + totalSupply);
  }
};
export default {
  detailsPrice,
  getUSD,
  getSwapUSD,
  getPairUSD,
  removeDuplicates,
  getTokenList,
  getAmounB,
  getOutInput,
  getInInput,
  judgmentToken,
  getAmoun,
  getSwapFee,
  digits,
  getSold,
  getDeadline,
  getPoolToken,
  getPoolShare,
  getReserve,
  getSwapMinFloat,
  getPair,
  willPoolTokens,
  getSharePool,
};