import AElf from 'aelf-sdk';
import config from '../../config';
import unitConverter from './unitConverter';
import moment from 'moment';
import {TIME_FORMAT} from '../../config/constant';
import {aelfInstance} from '../common/aelfProvider';
const {webURL, address} = config;
const {prefix, suffix} = address;

const unlockKeystore = (params, pwd) => {
  return AElf.wallet.keyStore.unlockKeystore(params, pwd);
};
const checkPassword = (keyStore, pwd) => {
  return AElf.wallet.keyStore.checkPassword(keyStore, pwd);
};
const getTransactionFee = Logs => {
  const free = AElf.pbUtils.getTransactionFee(Logs || []);
  let cost = 0;
  let symbol = '';
  Array.isArray(free) &&
    free.filter(item => {
      cost = cost + item.amount;
      symbol = item.symbol;
    });
  cost = unitConverter.toLower(cost);
  return {cost, symbol};
};
const getKeystore = (params, pwd, keystoreOptions) => {
  return AElf.wallet.keyStore.getKeystore(params, pwd, keystoreOptions);
};
const formatRestoreAddress = addressInput => {
  if (!addressInput) {
    return '';
  }
  const head = `${prefix}_`;
  const tail = `_${suffix}`;
  return addressInput
    .replace(new RegExp(head, 'g'), '')
    .replace(new RegExp(tail, 'g'), '');
};
const formatAddress = addressInput => {
  if (!addressInput) {
    return '';
  }
  addressInput = formatRestoreAddress(addressInput);
  return prefix + '_' + addressInput + '_' + suffix;
};
//checkAddress
const checkAddress = addressInput => {
  addressInput = formatRestoreAddress(addressInput);
  const length = addressInput.length;
  return length >= 47 && length <= 51;
};
const webURLAddress = addressInput => {
  if (!addressInput) {
    return;
  }
  addressInput = formatRestoreAddress(addressInput);
  return `${webURL}/address/${addressInput}`;
};

const webURLTx = addressInput => {
  if (!addressInput) {
    return;
  }
  addressInput = formatRestoreAddress(addressInput);
  return `${webURL}/tx/${addressInput}`;
};
const getMillisecond = time => {
  const {seconds} = time || {};
  let tim = seconds || time;
  if (String(tim).length <= 10) {
    return tim * 1000;
  }
  return tim;
};
const timeConversion = (time, format) => {
  let showTime = '';
  if (time) {
    showTime = moment(getMillisecond(time)).format(format || TIME_FORMAT);
  }
  return showTime;
};
const getTxResult = TransactionId => {
  return aelfInstance.chain.getTxResult(TransactionId);
};
const compareAllTokens = (first, second, type) => {
  if (
    Array.isArray(first) &&
    Array.isArray(second) &&
    first.length === second.length &&
    first.every((item, index) => item[type] === second[index][type])
  ) {
    return true;
  } else {
    return false;
  }
};
const containsAllTokens = (first, second, type) => {
  let contains = false;
  if (Array.isArray(first) && Array.isArray(second)) {
    contains = true;
    second.forEach(item => {
      const obj = first.find(i => {
        return i[type] === item[type];
      });
      if (!obj) {
        contains = false;
      }
    });
  }
  return contains;
};
const deepCompare = (x, y) => {
  let i, l, leftChain, rightChain;

  function compare2Objects(x, y) {
    let p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (
      isNaN(x) &&
      isNaN(y) &&
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if (
      (typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)
    ) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      } else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof x[p]) {
        case 'object':
        case 'function':
          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects(x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {
    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
};
export default {
  checkPassword,
  webURLAddress,
  formatAddress,
  formatRestoreAddress,
  webURLTx,
  getTransactionFee,
  getKeystore,
  unlockKeystore,
  checkAddress,
  timeConversion,
  getTxResult,
  compareAllTokens,
  containsAllTokens,
  deepCompare,
};
