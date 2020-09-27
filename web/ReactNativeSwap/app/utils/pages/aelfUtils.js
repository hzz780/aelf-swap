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
const deepEqual = (x, y) => {
  if (x === y) {
    return true;
  }
  if (x == null || y == null) {
    return x === y;
  }

  if (
    //Object.prototype.toString.call
    toString.call(x) !== toString.call(y) ||
    typeof x !== 'object' ||
    typeof y !== 'object' ||
    Object.keys(x).length !== Object.keys(y).length
  ) {
    return false;
  }
  if (x.constructor !== y.constructor) {
    return false;
  }

  for (var p in x) {
    if (!y.hasOwnProperty(p)) {
      return false;
    }
    // If they have the same strict value or identity then they are equal
    if (x[p] === y[p]) {
      continue;
    }
    if (!deepEqual(x[p], y[p])) {
      return false;
    }
  }
  return true;
};
export default {
  webURLTx,
  deepEqual,
  getTxResult,
  getKeystore,
  checkAddress,
  checkPassword,
  webURLAddress,
  formatAddress,
  unlockKeystore,
  timeConversion,
  compareAllTokens,
  containsAllTokens,
  getTransactionFee,
  formatRestoreAddress,
};
