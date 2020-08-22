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
const timeConversion = time => {
  let showTime = '';
  if (time) {
    showTime = moment(time).format(TIME_FORMAT);
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
};
