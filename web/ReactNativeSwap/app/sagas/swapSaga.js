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

import {all, takeLatest, put, delay, select} from 'redux-saga/effects';
import swapActions, {swapTypes, swapSelectors} from '../redux/swapRedux';
import {contractsSelectors} from '../redux/contractsRedux';
import i18n from 'i18n-js';
import aelfUtils from '../utils/pages/aelfUtils';
import {CommonToast, Loading} from '../components/template';
import navigationService from '../utils/common/navigationService';
import unitConverter from '../utils/pages/unitConverter';
import {userSelectors} from '../redux/userRedux';
import {getFetchRequest} from '../utils/common/networkRequest';
import config from '../config';
import swapUtils from '../utils/pages/swapUtils';
import SwapTransactionPopup from '../contanier/template/Transaction/SwapTransactionPopup';
const {swapURL} = config;
const Success = result => {
  if (result.Status === 'PENDING' || result.Status === 'MINED') {
    return true;
  }
};
function* getPairsSaga({pair, callBack}) {
  try {
    yield put(swapActions.getOverviewChart());
    yield put(swapActions.getAccountAssets());
    const contracts = yield select(contractsSelectors.getContracts);
    const {swapContract} = contracts || {};
    if (swapContract) {
      let pairs;
      if (pair) {
        pairs = {symbolPair: [pair]};
      } else {
        pairs = yield swapContract.GetPairs.call();
      }
      console.log(pairs, swapContract, '=====pairs');
      const reserves = yield swapContract.GetReserves.call(pairs);
      const {results: supplyResults} = yield swapContract.GetTotalSupply.call(
        pairs,
      );
      console.log(supplyResults, '=====supply');
      console.log(reserves, '======GetReserves');
      const {results} = reserves;
      if (Array.isArray(results)) {
        const allTokens = yield select(userSelectors.allTokens);
        const pairArr = results.map((item, index) => {
          let tokenA, tokenB;
          if (Array.isArray(allTokens)) {
            tokenA = allTokens.find(i => {
              return i.symbol === item.symbolA;
            });
            tokenB = allTokens.find(i => {
              return i.symbol === item.symbolB;
            });
          }
          return {
            ...item,
            totalSupply: unitConverter.toDecimalLower(
              (supplyResults[index] || {}).totalSupply,
            ),
            reserveA: unitConverter.toDecimalLower(
              item.reserveA,
              tokenA?.decimals,
            ),
            reserveB: unitConverter.toDecimalLower(
              item.reserveB,
              tokenB?.decimals,
            ),
          };
        });
        console.log(pairArr, '=====pairArr');
        if (pair) {
          callBack && callBack(1, pairArr[0]);
        } else {
          callBack && callBack(1);
          yield put(swapActions.setPairs(pairArr));
        }
      }
    } else {
      callBack && callBack(-1);
    }
  } catch (error) {
    yield delay(500);
    callBack && callBack(-1);
    console.log(error, '======getPairsSaga');
  }
}
function* createPairSaga({symbolPair}) {
  try {
    Loading.show();
    const contracts = yield select(contractsSelectors.getContracts);
    const {swapContract} = contracts || {};
    const createPair = yield swapContract.CreatePair({
      symbolPair,
    });
    yield delay(3000);
    const result = yield aelfUtils.getTxResult(createPair.TransactionId);
    console.log(result, '=======result');
    Loading.destroy();
    if (Success(result)) {
      SwapTransactionPopup.show({txId: createPair.TransactionId});
    } else {
      CommonToast.fail(i18n.t('swap.tryAgain'));
    }
    navigationService.goBack();
  } catch (error) {
    Loading.destroy();
    CommonToast.fail(i18n.t('swap.tryAgain'));
    console.log(error, '======createPairSaga');
  }
}
function* addLiquiditySaga({data}) {
  try {
    Loading.show();
    console.log(data, '======data');
    const contracts = yield select(contractsSelectors.getContracts);
    const {swapContract} = contracts || {};
    const add = yield swapContract.AddLiquidity({...data});
    yield delay(3000);
    const result = yield aelfUtils.getTxResult(add.TransactionId);
    console.log(result, '=======result');
    Loading.destroy();
    if (Success(result)) {
      SwapTransactionPopup.show({txId: add.TransactionId});
    } else {
      CommonToast.fail(i18n.t('swap.tryAgain'));
    }
    navigationService.goBack();
  } catch (error) {
    yield delay(500);
    Loading.destroy();
    CommonToast.fail(i18n.t('swap.tryAgain'));
    console.log(error, '======addLiquiditySaga');
  }
}
function* getAccountAssetsSaga({pair, callBack}) {
  try {
    const contracts = yield select(contractsSelectors.getContracts);
    const {swapContract} = contracts || {};
    if (!swapContract) {
      return;
    }
    let pairs;
    if (pair) {
      pairs = {symbolPair: [pair]};
    } else {
      pairs = yield swapContract.GetAccountAssets.call();
      if (pairs === null) {
        yield put(swapActions.setMyLiquidity([]));
        return;
      }
    }
    console.log(pairs, '=====symbolPair');
    const liquidity = yield swapContract.GetLiquidityTokenBalance.call(pairs);
    const {results: supplyResults} = yield swapContract.GetTotalSupply.call(
      pairs,
    );
    const {results: reservesResults} = yield swapContract.GetReserves.call(
      pairs,
    );
    console.log(supplyResults, '====supplyResults');
    const {results} = liquidity || {};
    if (Array.isArray(results)) {
      const allTokens = yield select(userSelectors.allTokens);
      const list = results.map((item, index) => {
        console.log(item, 'liquidity');
        const reserves = reservesResults[index];
        let tokenA, tokenB;
        if (Array.isArray(allTokens)) {
          tokenA = allTokens.find(i => {
            return i.symbol === reserves.symbolA;
          });
          tokenB = allTokens.find(i => {
            return i.symbol === reserves.symbolB;
          });
        }
        return {
          totalSupply: unitConverter.toDecimalLower(
            (supplyResults[index] || {}).totalSupply,
          ),
          ...(reserves || {}),
          ...item,
          balance: unitConverter.toDecimalLower(item.balance),
          reserveA: unitConverter.toDecimalLower(
            reserves.reserveA,
            tokenA?.decimals,
          ),
          reserveB: unitConverter.toDecimalLower(
            reserves.reserveB,
            tokenB?.decimals,
          ),
        };
      });
      if (pair) {
        callBack && callBack(1, list[0]);
      } else {
        callBack && callBack(1);
        yield put(swapActions.setMyLiquidity(list));
      }
    } else {
      callBack && callBack(-1);
    }
    console.log(liquidity, '=====getAccountAssetsSaga');
  } catch (error) {
    callBack && callBack(-1);
    console.log('getAccountAssetsSaga', error);
  }
}
function* swapTokenSaga({data, callBack}) {
  try {
    Loading.show();
    const contracts = yield select(contractsSelectors.getContracts);
    const {swapContract} = contracts || {};
    let request;
    if (data.amountInMax) {
      request = swapContract.SwapTokenForExactToken;
    } else {
      request = swapContract.SwapExactTokenForToken;
    }
    const swap = yield request(data);
    yield delay(3000);
    const result = yield aelfUtils.getTxResult(swap.TransactionId);
    console.log(result, '=======result');
    if (Success(result)) {
      SwapTransactionPopup.show({txId: swap.TransactionId});
    } else {
      CommonToast.fail(i18n.t('swap.tryAgain'));
    }
    Loading.destroy();
    callBack && callBack();
  } catch (error) {
    callBack && callBack();
    yield delay(500);
    Loading.destroy();
    CommonToast.fail(i18n.t('swap.tryAgain'));
    console.log('getAccountAssetsSaga', error);
  }
}
function* removeLiquiditySaga({data}) {
  try {
    Loading.show();
    console.log(data, '======data');
    const contracts = yield select(contractsSelectors.getContracts);
    const {swapContract} = contracts || {};
    const remove = yield swapContract.RemoveLiquidity({...data});
    yield delay(3000);
    const result = yield aelfUtils.getTxResult(remove.TransactionId);
    console.log(result, '=======result');
    Loading.destroy();
    if (Success(result)) {
      SwapTransactionPopup.show({txId: remove.TransactionId});
    } else {
      CommonToast.fail(i18n.t('swap.tryAgain'));
    }
    navigationService.goBack();
  } catch (error) {
    yield delay(500);
    Loading.destroy();
    CommonToast.fail(i18n.t('swap.tryAgain'));
    console.log(error, '======removeLiquiditySaga');
  }
}
function* getPairCandleStickSaga({symbolPair, interval}) {
  try {
    const utcOffset = swapUtils.getUTCOffset();
    const result = yield getFetchRequest(
      `${swapURL}/api/swap/pairCandleStick?symbolPair=${symbolPair}&interval=${interval}&utcOffset=${utcOffset}`,
    );
    if (result.msg === 'success') {
      let obj;
      const candleStick = yield select(swapSelectors.pairCandleStick);
      let pairCandleStick;
      if (candleStick) {
        pairCandleStick = candleStick[symbolPair];
      }
      obj = {
        [symbolPair]: {...(pairCandleStick || {}), [interval]: result.data},
      };
      console.log(obj, '=======obj');
      yield put(swapActions.setPairCandleStick(obj));
    }
  } catch (error) {
    console.log(error, '======getPairCandleStickSaga');
  }
}
function* getPairChartsSaga({symbolPair, range}) {
  try {
    const utcOffset = swapUtils.getUTCOffset();
    const result = yield getFetchRequest(
      `${swapURL}/api/swap/pairChart?symbolPair=${symbolPair}&range=${range}&utcOffset=${utcOffset}`,
    );
    console.log(
      `${swapURL}/api/swap/pairChart?symbolPair=${symbolPair}&range=${range}&utcOffset=${utcOffset}`,
    );
    console.log(result, '======result');
    if (result.msg === 'success') {
      let obj;
      const pairCharts = yield select(swapSelectors.pairCharts);
      let charts;
      if (pairCharts) {
        charts = pairCharts[symbolPair];
      }
      obj = {
        [symbolPair]: {...(charts || {}), [range]: result.data},
      };
      console.log(obj, '=======onGetPairCharts');
      yield put(swapActions.setPairCharts(obj));
    }
  } catch (error) {
    console.log(error, '======getPairChartsSaga');
  }
}
function* getPairInfoSaga({symbolPair}) {
  try {
    console.log(`${swapURL}/api/swap/pairInfo?symbolPair=${symbolPair}`);
    const result = yield getFetchRequest(
      `${swapURL}/api/swap/pairInfo?symbolPair=${symbolPair}`,
    );
    console.log(result, '======result');
  } catch (error) {
    console.log(error, '=getPairInfoSagagetPairInfoSaga');
  }
}
function* getOverviewChartSaga() {
  try {
    const utcOffset = swapUtils.getUTCOffset();
    console.log(`${swapURL}/api/swap/overviewChart?utcOffset=${utcOffset}`);
    const result = yield getFetchRequest(
      `${swapURL}/api/swap/overviewChart?utcOffset=${utcOffset}`,
    );
    if (result.msg === 'success') {
      yield put(swapActions.setOverviewChart(result.data));
    }
    console.log(result, '======getOverviewChartSaga');
  } catch (error) {
    console.log(error, '=getOverviewChartSaga');
  }
}
export default function* SwapSaga() {
  yield all([
    yield takeLatest(swapTypes.GET_PAIRS, getPairsSaga),
    yield takeLatest(swapTypes.CREATE_PAIR, createPairSaga),
    yield takeLatest(swapTypes.ADD_LIQUIDITY, addLiquiditySaga),
    yield takeLatest(swapTypes.GET_ACCOUNT_ASSETS, getAccountAssetsSaga),
    yield takeLatest(swapTypes.SWAP_TOKEN, swapTokenSaga),
    yield takeLatest(swapTypes.REMOVE_LIQUIDITY, removeLiquiditySaga),
    yield takeLatest(swapTypes.GET_PAIR_CANDLE_STICK, getPairCandleStickSaga),
    yield takeLatest(swapTypes.GET_PAIR_CHARTS, getPairChartsSaga),
    yield takeLatest(swapTypes.GET_PAIR_INFO, getPairInfoSaga),
    yield takeLatest(swapTypes.GET_OVERVIEW_CHART, getOverviewChartSaga),
  ]);
}
