/* ***********************************************************
 * A short word on how to use this automagically generated file.
 * We're often asked in the ignite glitter channel how to connect
 * to a to a third party api, so we thought we'd demonstrate - but
 * you should know you can use sagas for other flow control too.
 *
 * Other points:
 *  - You'll need to add this saga to sagas/index.js
 *  - This template uses the api declared in sagas/index.js, so
 *    you'll need to define a constant in that file.
 *************************************************************/

import {put, all, takeLatest, select, delay} from 'redux-saga/effects';
import userActions, {userTypes, userSelectors} from '../redux/userRedux';
import contractsActions from '../redux/contractsRedux';
import config from '../config';
import {removeDuplicates, isNumber} from '../utils/pages';
import {getContract, aelfInstance} from '../utils/common/aelfProvider';
import navigationService from '../utils/common/navigationService';
import {Loading, CommonToast} from '../components/template';
import unitConverter from '../utils/pages/unitConverter';
import aelfUtils from '../utils/pages/aelfUtils';
import {isIos} from '../utils/common/device';
import settingsActions from '../redux/settingsRedux';
import i18n from 'i18n-js';
import {Alert} from 'react-native';
import swapActions from '../redux/swapRedux';
import {getFetchRequest} from '../utils/common/networkRequest';
const {
  walletURL,
  tokenSymbol,
  contractAddresses,
  keystoreOptions,
  contractNameAddressSets,
} = config;
function* onRegisteredSaga(actios) {
  Loading.show();
  yield delay(500);
  const {pwd, userName, newWallet} = actios;
  try {
    const keystoreCustomOptions = isIos
      ? keystoreOptions.ios
      : keystoreOptions.android;
    const keyStore = aelfUtils.getKeystore(
      {
        mnemonic: newWallet.mnemonic,
        privateKey: newWallet.privateKey,
        address: newWallet.address,
        nickName: userName,
      },
      pwd,
      keystoreCustomOptions,
    );
    yield put(
      userActions.onLoginSuccess({
        address: newWallet.address,
        keystore: keyStore,
        userName: userName,
        balance: 0,
        privateKey: newWallet.privateKey,
        saveQRCode: false,
      }),
    );
    Loading.hide();
    CommonToast.success(i18n.t('userSaga.registrationSuccess'));
    yield delay(500);
    navigationService.reset([{name: 'Tab'}, {name: 'GenerateQRCode'}]);
  } catch (error) {
    Loading.hide();
    CommonToast.fail(i18n.t('userSaga.registrationFailed'));
    console.log(error, 'onRegisteredSaga');
    return false;
  }
}
function* onAppInitSaga({privateKey}) {
  try {
    const userInfo = yield select(userSelectors.getUserInfo);
    if (
      userInfo.address &&
      userInfo.contracts &&
      Object.keys(userInfo.contracts).length > 0
    ) {
      return;
    }
    privateKey = privateKey || userInfo.privateKey;
    console.log(privateKey, '=======privateKey');
    if (privateKey) {
      const contract = yield getContract(privateKey, contractNameAddressSets);
      console.log(contract, '======contract');
      if (contract && Object.keys(contract).length > 0) {
        console.log(yield contract.tokenContract.GetResourceTokenInfo.call());
        yield put(contractsActions.setContracts({contracts: contract}));
        yield put(userActions.getAllowanceList());
        yield put(userActions.getUserBalance());
        yield put(swapActions.getPairs());
      }
    }
  } catch (error) {
    console.log(error, 'appInitSaga');
    yield put(userActions.onAppInit());
  }
}
function* getUserBalanceSaga() {
  try {
    const userInfo = yield select(userSelectors.getUserInfo);
    const {address, contracts, privateKey} = userInfo;
    if (address && privateKey) {
      yield put(userActions.getUserBalances(address));
      yield put(userActions.getAllTokens());
      if (
        contracts &&
        contracts.tokenContract &&
        contracts.tokenContract.GetBalance
      ) {
        const {tokenContract} = contracts;
        const balance = yield tokenContract.GetBalance.call({
          symbol: tokenSymbol,
          owner: aelfUtils.formatRestoreAddress(address),
        });
        const confirmBlance = unitConverter.toLower(balance.balance);
        if (userInfo.balance !== confirmBlance) {
          yield put(
            userActions.setUserBalance(
              isNumber(confirmBlance) ? confirmBlance : 0,
            ),
          );
        }
      }
    }
  } catch (error) {
    console.log(error, 'getUserBalanceSaga');
  }
}
function* onLoginSuccessSaga({data}) {
  try {
    yield put(
      contractsActions.setContracts({
        contracts: {},
      }),
    );
    yield put(userActions.setAllowanceList([]));

    data.address = aelfUtils.formatAddress(data.address);
    let userList = [];
    const List = yield select(userSelectors.getUserList);
    if (Array.isArray(List)) {
      userList = [...List];
    }
    const userObj = {
      keystore: data.keystore,
      saveQRCode: data.saveQRCode,
      userName: data.userName,
      address: data.address,
      balance: data.balance,
      privateKey: data.privateKey,
    };
    userList.unshift(userObj);
    userList = removeDuplicates(userList);
    yield put(userActions.setUserData({...userObj, userList}));
    yield put(userActions.setAllowanceList([]));
  } catch (error) {
    console.log(error, 'onLoginSuccessSaga');
  }
}
function* deleteUserSaga({address}) {
  try {
    let List = [...(yield select(userSelectors.getUserList))];
    List.splice(List.findIndex(item => item.address === address), 1);
    yield put(userActions.setUserList(List));
  } catch (error) {
    console.log(error, 'deleteUserSaga');
  }
}
function* logOutSaga({address}) {
  try {
    const userObj = {
      keystore: null,
      saveQRCode: null,
      userName: null,
      address: null,
      balance: null,
      privateKey: null,
      userBalances: [],
    };
    const contractsObj = {
      contracts: {},
    };
    yield put(userActions.deleteUser(address));
    yield put(userActions.setUserData(userObj));
    yield put(contractsActions.setContracts(contractsObj));
    yield put(settingsActions.reSetSettings());
    yield put(userActions.setAllowanceList([]));
    yield put(swapActions.reSwap());
    navigationService.reset('Entrance');
  } catch (error) {
    console.log(error, 'logOutSaga');
  }
}
function* transferSaga({param}) {
  try {
    console.log(param);
    const {contracts} = yield select(userSelectors.getUserInfo);
    const transaction = yield contracts.tokenContract.Transfer(param);
    const result = yield aelfInstance.chain.getTxResult(
      transaction.TransactionId,
    );
    console.log(result, '=====result');
    yield delay(2000);
    Loading.hide();
    yield put(userActions.getUserBalance());
    navigationService.navigate('TransactionDetails', {
      TransactionId: transaction.TransactionId,
    });
  } catch (error) {
    yield delay(2000);
    Loading.hide();
    Alert.alert(
      i18n.t('userSaga.transferFailed'),
      JSON.stringify(error || {}),
      [{text: i18n.t('determine')}],
    );
    console.log(error, 'transferSaga');
  }
}
function* getAllowanceListSaga() {
  try {
    const userInfo = yield select(userSelectors.getUserInfo);
    const {contracts, address} = userInfo;
    const {tokenContract} = contracts;
    let allowanceList = [];
    const promises = contractAddresses.map(
      ({contractName, contractAdress, name}) => {
        return tokenContract.GetAllowance.call({
          symbol: tokenSymbol,
          owner: address,
          spender: contractAdress,
        }).then(value => {
          allowanceList.push({
            ...value,
            name,
            contractAdress,
            allowance: unitConverter.toLower(value.allowance),
          });
        });
      },
    );
    yield Promise.all(promises);
    yield put(userActions.setAllowanceList(allowanceList));
  } catch (error) {
    console.log(error, 'getAllowanceListSaga');
  }
}
function* onApproveSaga({amount, appContractAddress}) {
  Loading.show();
  try {
    const {
      contracts: {tokenContract},
    } = yield select(userSelectors.getUserInfo);
    const approve = yield tokenContract.Approve({
      symbol: tokenSymbol,
      spender: appContractAddress,
      amount: unitConverter.toHigher(amount),
    });
    const result = yield aelfInstance.chain.getTxResult(approve.TransactionId);
    yield delay(2000);
    Loading.hide();
    CommonToast.success(i18n.t('userSaga.authorizationSucceeded'));
    yield put(userActions.getAllowanceList());
    navigationService.navigate('ApproveDetails', {
      TransactionId: approve.TransactionId,
    });
  } catch (error) {
    Loading.hide();
    CommonToast.fail(i18n.t('userSaga.authorizationFailed'));
    console.log(error, 'onApproveSaga');
  }
}
const getUSD = data => {
  const promise = data.map(item => {
    return getFetchRequest(
      `https://wallet-test.aelf.io/api/token/price?fsym=${
        item.symbol
      }&tsyms=USD`,
    ).then(v => {
      const {USD} = v || {};
      if (USD) {
        return {
          ...item,
          USD,
        };
      } else {
        return {
          ...item,
          USD: 0,
        };
      }
    });
  });
  return Promise.all(promise);
};
function* getAllTokensSaga() {
  try {
    yield put(userActions.getTokenUsd());
    const result = yield getFetchRequest(
      `${walletURL}/api/viewer/getAllTokens?total=0&pageSize=100&pageNum=1`,
    );

    const {
      msg,
      data: {list},
    } = result;
    if (msg === 'success') {
      const allTokens = yield select(userSelectors.allTokens);
      if (
        list &&
        (!allTokens || !aelfUtils.compareAllTokens(allTokens, list, 'symbol'))
      ) {
        yield put(userActions.setAllTokens(list));
      }
    }
  } catch (error) {
    console.log(error, 'getAllTokensSaga');
  }
}
function* getUserBalancesSaga({address}) {
  try {
    let obj = {};
    const result = yield getFetchRequest(
      `${walletURL}/api/viewer/balances?address=${aelfUtils.formatRestoreAddress(
        address,
      )}`,
    );
    const {data, msg} = result;
    if (msg === 'success' && Array.isArray(data)) {
      data.forEach(item => {
        obj[item.symbol] = item.balance;
      });
      const userBalances = yield select(userSelectors.userBalances);
      if (JSON.stringify(userBalances) !== JSON.stringify(obj)) {
        yield put(userActions.setUserBalances(obj));
      }
      yield put(userActions.approve());
    }
  } catch (error) {
    console.log(error, 'getUserBalancesSaga');
  }
}
function* getTokenUsdSaga() {
  try {
    let obj = {};
    const allTokens = yield select(userSelectors.allTokens);
    if (Array.isArray(allTokens)) {
      const USDList = yield getUSD(allTokens);
      Array.isArray(USDList) &&
        USDList.forEach(item => {
          obj[item.symbol] = item;
        });
      const tokenUSD = yield select(userSelectors.tokenUSD);
      if (JSON.stringify(tokenUSD) !== JSON.stringify(obj)) {
        console.log(obj, '=====tokenUSD');
        yield put(userActions.setTokenUsd(obj));
      }
    }
  } catch (error) {
    console.log('getTokenUsdSaga', error);
  }
}
const getApprove = (userBalances, tokenContract, address, allTokens) => {
  const promise = Object.entries(userBalances).map(([symbol, balance]) => {
    return tokenContract.GetAllowance.call({
      symbol,
      owner: address,
      spender: contractNameAddressSets.swapContract,
    }).then(async v => {
      const {allowance} = v;
      if (Array.isArray(allTokens)) {
        const token = allTokens.find(item => {
          return item.symbol === symbol;
        });
        if (
          allowance !== -1 &&
          unitConverter.toDecimalLower(allowance, token.decimals) <
            Number(balance)
        ) {
          await tokenContract.Approve({
            symbol,
            spender: contractNameAddressSets.swapContract,
            amount: unitConverter.toDecimalHigher(balance, token.decimals),
          });
        }
      }
    });
  });
  return Promise.all(promise);
};
function* approveSaga() {
  try {
    const {contracts, address} = yield select(userSelectors.getUserInfo);
    const userBalances = yield select(userSelectors.userBalances);
    const allTokens = yield select(userSelectors.allTokens);
    const {tokenContract} = contracts || {};
    if (tokenContract) {
      yield getApprove(userBalances, tokenContract, address, allTokens);
    }
  } catch (error) {
    console.log('approveSaga', error);
  }
}
export default function* LoginSaga() {
  yield all([
    yield takeLatest(userTypes.ON_APP_INIT, onAppInitSaga),
    yield takeLatest(userTypes.ON_REGISTERED, onRegisteredSaga),
    yield takeLatest(userTypes.GET_USER_BALANCE, getUserBalanceSaga),
    yield takeLatest(userTypes.ON_LOGIN_SUCCESS, onLoginSuccessSaga),
    yield takeLatest(userTypes.DELETE_USER, deleteUserSaga),
    yield takeLatest(userTypes.LOG_OUT, logOutSaga),
    yield takeLatest(userTypes.TRANSFER, transferSaga),
    yield takeLatest(userTypes.GET_ALLOWANCE_LIST, getAllowanceListSaga),
    yield takeLatest(userTypes.ON_APPROVE, onApproveSaga),
    yield takeLatest(userTypes.GET_ALL_TOKENS, getAllTokensSaga),
    yield takeLatest(userTypes.GET_USER_BALANCES, getUserBalancesSaga),
    yield takeLatest(userTypes.GET_TOKEN_USD, getTokenUsdSaga),
    yield takeLatest(userTypes.APPROVE, approveSaga),
  ]);
}
