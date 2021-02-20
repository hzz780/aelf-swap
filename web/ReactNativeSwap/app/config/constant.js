const ADVANCED = true; // Whether to enable the advanced account function
const PASSWORD_REG = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{12,}/;
const USERNAME_REG = /^[A-Za-z0-9]{1,30}$/;
const PRIVATE_KEY_REG = /^[a-zA-Z0-9]{60,70}$/;
const DEFAULT_CURRENCY = 'CNY';
const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const EXIT_TIME = 2000;
export {
  ADVANCED,
  EXIT_TIME,
  PASSWORD_REG,
  USERNAME_REG,
  DEFAULT_CURRENCY,
  TIME_FORMAT,
  PRIVATE_KEY_REG,
};
