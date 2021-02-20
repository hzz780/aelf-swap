// We use keyStore to store the private key and use information
// You can custom your keyStore config for different device.
const keystoreOptions = {
  ios: {
    dklen: 32,
    n: 2048, // 2048 4096 8192 16384
    r: 8,
    p: 1,
    cipher: 'aes-128-ctr',
  },
  android: {
    dklen: 32,
    n: 2048, // 2048 4096 8192 16384
    r: 8,
    p: 1,
    cipher: 'aes-128-ctr',
  },
};

// const explorerURL = 'https://explorer-test-side01.aelf.io';
// const walletURL = 'https://tdvv-wallet-test.aelf.io';
// const swapURL = 'https://swap-test.aelf.io';
// test environment
const swapURL = 'http://192.168.197.55:8080';
const explorerURL = 'http://1.119.195.50:11107';
const walletURL = 'http://1.119.195.50:11109';
export default {
  commonPrivateKey:
    'b7a6b643f2a66848cb2229bf26c8330d5384e0eac325709a66f4baacc89d3108',
  // You can change the params for keyStore here
  keystoreOptions,
  httpProvider: `${walletURL}/chain`,
  explorerURL,
  walletURL,
  swapURL,
  webURL: explorerURL,
  // contractNames & contractAddresses will be init by appInit of `/common/utils/aelfProvider`;
  contractNames: {
    consensusContract: 'AElf.ContractNames.Consensus',
    tokenContract: 'AElf.ContractNames.Token',
  },
  // You want to init in the app
  contractAddresses: [
    {
      name: 'bingoGame',
      contractAdress: '2wRDbyVF28VBQoSPgdSEFaL4x7CaXz8TCBujYhgWc9qTMxBE3n',
      contractName: 'bingoGameContract',
    },
  ],
  contractNameAddressSets: {
    consensusContract: 'BNPFPPwQ3DE9rwxzdY61Q2utU9FZx9KYUnrYHQqCR6N4LLhUE',
    tokenContract: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
    // swapContract: 'RXcxgSXuagn8RrvhQAV81Z652EEYSwR6JLnqHYJ5UVpEptW8Y',
    swapContract: '2wRDbyVF28VBQoSPgdSEFaL4x7CaXz8TCBujYhgWc9qTMxBE3n',
    //test environment
    // swapContract: '2wRDbyVF28VBQoSPgdSEFaL4x7CaXz8TCBujYhgWc9qTMxBE3n',
  },
  address: {
    prefix: 'ELF',
    suffix: 'tDVV',
  },

  tokenSymbol: 'AEUSD',
  tokenDecimal: 3,
  tokenDecimalFormat: 10 ** 3,

  // test environment
  // tokenSymbol: 'ELF',
  // tokenDecimal: 8,
  // tokenDecimalFormat: 10 ** 8,

  fetchTimeout: 10000,
  /**
   * The country you want to remind him of Please enter the iSO country code and refer to the link below
   * https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements
   * Note that this is an array
   */
  // ISOCountryCodeBlackList: ['CN'],
  /**
   * safety lock time
   * 10 minutes by default
   * milliseconds as a unit
   */
  safeTime: 600000,

  //swap
  swapFloat: 0.005,
  swapDeadline: 20, //swap waiting time #second
  swapFee: 0.003,
};
