import config from '../../config';
const {tokenDecimalFormat} = config;
const digits = (count, d = 8) => {
  const floatPart = String(count).split('.')[1];
  if (count && floatPart && floatPart.length > d) {
    count = count.toFixed(d);
  }
  return Number(count);
};
export default {
  toLower: number => {
    return number / tokenDecimalFormat;
  },
  toHigher: number => {
    return number * tokenDecimalFormat;
  },
  toDecimalLower: (n = 0, d = 8) => {
    return digits(n / 10 ** d, d);
  },

  toDecimalHigher: (n, d = 8) => {
    return n * 10 ** d;
  },
};
