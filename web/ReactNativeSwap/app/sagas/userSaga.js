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
const {
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
    if (userInfo.contracts && Object.keys(userInfo.contracts).length > 0) {
      return;
    }
    privateKey = privateKey || userInfo.privateKey;
    if (privateKey) {
      const contract = yield getContract(privateKey, contractNameAddressSets);
      if (contract && Object.keys(contract).length > 0) {
        yield put(contractsActions.setContracts({contracts: contract}));
        yield put(userActions.getAllowanceList());
        yield put(userActions.getUserBalance());
      }
    }
  } catch (error) {
    yield put(userActions.onAppInit());
    console.log(error, 'appInitSaga');
  }
}
function* getUserBalanceSaga() {
  try {
    const userInfo = yield select(userSelectors.getUserInfo);
    const {address, contracts, privateKey} = userInfo;
    if (address && privateKey) {
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
    };
    const contractsObj = {
      contracts: {},
    };
    yield put(userActions.deleteUser(address));
    yield put(userActions.setUserData(userObj));
    yield put(contractsActions.setContracts(contractsObj));
    yield put(settingsActions.reSetSettings());
    yield put(userActions.setAllowanceList([]));
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
    console.log(result, '=====result');
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
  ]);
}
