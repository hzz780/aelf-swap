import config from '../../config';
const {tokenDecimalFormat} = config;
export default {
  toLower: number => {
    return number / tokenDecimalFormat;
  },
  toHigher: number => {
    return number * tokenDecimalFormat;
  },
};
