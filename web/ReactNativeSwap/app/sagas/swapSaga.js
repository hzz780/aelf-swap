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
import unitConverter from '../utils/pages/unitConverter';
import {userSelectors} from '../redux/userRedux';
import {getFetchRequest} from '../utils/common/networkRequest';
import config from '../config';
import swapUtils from '../utils/pages/swapUtils';
import SwapTransactionPopup from '../container/template/Transaction/SwapTransactionPopup';
import {SWAP_PAGE_SIZE} from '../config/swapConstant';
const {swapURL} = config;
const swapRoute = '/api/test';
const swapPath = swapURL + swapRoute;
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
      yield put(swapActions.getTotalSupply(pairs));
      const reserves = yield swapContract.GetReserves.call(pairs);
      const {results} = reserves;
      if (Array.isArray(results)) {
        const allTokens = yield select(userSelectors.allTokens);
        const pairArr = results.map(item => {
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
          callBack?.(1, pairArr[0]);
        } else {
          callBack?.(1);
          yield put(swapActions.setPairs(pairArr));
        }
      }
    } else {
      callBack?.(-1);
    }
  } catch (error) {
    yield delay(500);
    callBack?.(-1);
    console.log(error, '======getPairsSaga');
  }
}
function* getTotalSupplySaga({pairs}) {
  try {
    const contracts = yield select(contractsSelectors.getContracts);
    const {swapContract} = contracts || {};
    if (swapContract) {
      const {results} = yield swapContract.GetTotalSupply.call(pairs);
      if (Array.isArray(results)) {
        const totalSupplys = yield select(swapSelectors.totalSupplys);
        let obj = {};
        for (let i = 0, j = results.length; i < j; i++) {
          const element = results[i];
          obj[element.symbolPair] = unitConverter.toDecimalLower(
            element.totalSupply,
          );
        }
        console.log(totalSupplys, '=====totalSupplys');
        if (JSON.stringify(totalSupplys) !== JSON.stringify(obj)) {
          console.log(obj, '======obj');
          yield put(swapActions.setTotalSupply(obj));
        }
      }
      console.log(results, '=====getTotalSupplySaga');
    }
  } catch (error) {
    console.log(error, 'getTotalSupplySaga');
  }
}
function* getPairListSaga({}) {
  try {
    const result = yield getFetchRequest(
      `${swapPath}/pairList?pageNum=${1}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    console.log(result, '======getPairListSaga');
  } catch (error) {
    console.log(error, 'getPairListSaga');
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
      SwapTransactionPopup.show({txId: createPair.TransactionId, goBack: true});
    } else {
      CommonToast.fail(i18n.t('swap.tryAgain'));
    }
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
      SwapTransactionPopup.show({txId: add.TransactionId, goBack: true});
    } else {
      CommonToast.fail(i18n.t('swap.tryAgain'));
    }
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
    const liquidity = yield swapContract.GetLiquidityTokenBalance.call(pairs);
    const {results: supplyResults} = yield swapContract.GetTotalSupply.call(
      pairs,
    );
    const {results: reservesResults} = yield swapContract.GetReserves.call(
      pairs,
    );
    const {results} = liquidity || {};
    if (Array.isArray(results)) {
      const allTokens = yield select(userSelectors.allTokens);
      const list = results.map((item, index) => {
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
        callBack?.(1, list[0]);
      } else {
        callBack?.(1);
        yield put(swapActions.setMyLiquidity(list));
      }
    } else {
      callBack?.(-1);
    }
    console.log(liquidity, '=====getAccountAssetsSaga');
  } catch (error) {
    callBack?.(-1);
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
    callBack?.();
  } catch (error) {
    callBack?.();
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
      SwapTransactionPopup.show({txId: remove.TransactionId, goBack: true});
    } else {
      CommonToast.fail(i18n.t('swap.tryAgain'));
    }
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
function* getPriceCandleStickSaga({symbol, interval}) {
  try {
    const utcOffset = swapUtils.getUTCOffset();
    const result = yield getFetchRequest(
      `${swapPath}/priceChart?symbol=${symbol}&interval=${interval}&utcOffset=${utcOffset}`,
    );
    if (result.msg === 'success') {
      let obj;
      const candleStick = yield select(swapSelectors.priceCandleStick);
      let priceCandleStick;
      if (candleStick) {
        priceCandleStick = candleStick[symbol];
      }
      obj = {
        [symbol]: {...(priceCandleStick || {}), [interval]: result.data},
      };
      console.log(obj, '=======getPriceCandleStick');
      yield put(swapActions.setPriceCandleStick(obj));
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
    const result = yield getFetchRequest(
      `${swapPath}/pairInfo?symbolPair=${symbolPair}`,
    );
    if (result.msg === 'success') {
      yield put(swapActions.setPairInfo({[symbolPair]: result.data}));
    }
    console.log(result, '======result');
  } catch (error) {
    console.log(error, '=getPairInfoSagagetPairInfoSaga');
  }
}
function* getOverviewChartSaga() {
  try {
    const utcOffset = swapUtils.getUTCOffset();
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
function* getTokenInfoSaga({symbol, callBack}) {
  try {
    console.log(`${swapPath}/tokenInfo?symbol=${symbol}`);
    const result = yield getFetchRequest(
      `${swapPath}/tokenInfo?symbol=${symbol}`,
    );
    console.log(result, '========result');
    if (result.msg === 'success') {
      callBack?.(1);
      yield put(swapActions.setTokenInfo({[symbol]: result.data}));
    } else {
      callBack?.(-1);
    }
  } catch (error) {
    callBack?.(-1);
  }
}

function* getAccountInfoSaga({address, callBack}) {
  try {
    yield put(swapActions.getAccountChart(address));
    const result = yield getFetchRequest(
      `${swapPath}/accountInfo?address=${address}`,
    );
    console.log(result, '=======getAccountInfoSaga');
    if (result.msg === 'success') {
      yield put(swapActions.setAccountInfo({[address]: result.data}));
      callBack?.(1);
    } else {
      callBack?.(-1);
    }
  } catch (error) {
    console.log(error, 'getAccountInfoSaga');
  }
}
function* getAccountChartSaga({address, range, symbolPair}) {
  try {
    const sPair = symbolPair || 'all';
    console.log(
      `${swapPath}/accountChart?address=${address}&utcOffset=${swapUtils.getUTCOffset()}&range=${range ||
        'week'}${symbolPair ? `&symbolPair=${symbolPair}` : ''}`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/accountChart?address=${address}&utcOffset=${swapUtils.getUTCOffset()}&range=${range ||
        'week'}${symbolPair ? `&symbolPair=${symbolPair}` : ''}`,
    );
    if (result.msg === 'success') {
      const accountChart = yield select(swapSelectors.accountChart);
      const chart = accountChart?.[address];
      const sChart = chart?.[sPair];
      const obj = {
        [address]: {
          ...(chart || {}),
          [sPair]: {...(sChart || {}), [range || 'week']: result.data},
        },
      };
      console.log(obj, '======obj');
      yield put(swapActions.setAccountChart(obj));
    }
    console.log(result, 'getAccount');
  } catch (error) {
    console.log(error, 'getAccountChartSaga');
  }
}
function* getOverviewInfoSaga() {
  try {
    const result = yield getFetchRequest(`${swapPath}/overview`);
    if (result.msg === 'success') {
      const overviewInfo = yield select(swapSelectors.overviewInfo);
      if (JSON.stringify(overviewInfo) !== JSON.stringify(result.data)) {
        yield put(swapActions.setOverviewInfo(result.data));
        console.log(result, 'getOverviewInfo');
      }
    }
  } catch (error) {
    console.log(error, 'getOverviewInfoSaga');
  }
}
function* getAccountListSaga({loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const accountList = yield select(swapSelectors.accountList);
    if (loadingPaging && Array.isArray(accountList)) {
      pageNum = Math.ceil(accountList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/accountList?pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/accountList?pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    console.log(result, '==========result');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(accountList)) {
        list = list.concat(accountList);
      }
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      list = list.concat(result.data?.list || []);
      yield put(swapActions.setAccountList(list));
    } else {
      callBack?.(-1);
    }
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getAccountListSaga');
  }
}
function* getTokenListSaga({loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const tokenList = yield select(swapSelectors.tokenList);
    if (loadingPaging && Array.isArray(tokenList)) {
      pageNum = Math.ceil(tokenList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/tokenList?pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/tokenList?pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    console.log(result, '==========getTokenListSaga');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(tokenList)) {
        list = list.concat(tokenList);
      }
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      list = list.concat(result.data?.list || []);
      yield put(swapActions.setTokenList(list));
    } else {
      callBack?.(-1);
    }
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getAccountListSaga');
  }
}
function* getTokenChartSaga({symbol, range}) {
  try {
    const utcOffset = swapUtils.getUTCOffset();
    const result = yield getFetchRequest(
      `${swapPath}/tokenChart?symbol=${symbol}&range=${range}&utcOffset=${utcOffset}`,
    );
    if (result.msg === 'success') {
      let obj;
      const tokenChart = yield select(swapSelectors.tokenChart);
      const charts = tokenChart?.[symbol];
      obj = {
        [symbol]: {...(charts || {}), [range]: result.data},
      };
      yield put(swapActions.setTokenChart(obj));
    }
  } catch (error) {
    console.log(error, '======getPairChartsSaga');
  }
}
function* getPairSwapListSaga({symbolPair, loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const pairSwap = yield select(swapSelectors.pairSwap);
    const pairSwapList = pairSwap?.[symbolPair];
    if (loadingPaging && Array.isArray(pairSwapList)) {
      pageNum = Math.ceil(pairSwapList.length / SWAP_PAGE_SIZE) + 1;
    }
    const result = yield getFetchRequest(
      `${swapPath}/swapList?symbolPair=${symbolPair}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(pairSwapList)) {
        list = list.concat(pairSwapList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setPairSwap({[symbolPair]: list}));
    } else {
      callBack?.(-1);
    }
    console.log(result, '=======getPairSwapListSaga');
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getPairSwapListSaga');
  }
}
function* getPairAddLiquidityListSaga({symbolPair, loadingPaging, callBack}) {
  console.log(
    'getPairAddLiquidityListSaga',
    'symbolPair, loadingPaging, callBack',
  );
  try {
    let pageNum = 1;
    const pairLiquidity = yield select(swapSelectors.pairAddLiquidity);
    const pairLiquidityList = pairLiquidity?.[symbolPair];
    if (loadingPaging && Array.isArray(pairLiquidityList)) {
      pageNum = Math.ceil(pairLiquidityList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/liquidityList?symbolPair=${symbolPair}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=add`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/liquidityList?symbolPair=${symbolPair}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=add`,
    );
    console.log(result, 'getPairAddLiquidityListSaga');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(pairLiquidityList)) {
        list = list.concat(pairLiquidityList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setPairAddLiquidity({[symbolPair]: list}));
    } else {
      callBack?.(-1);
    }
    console.log(result, '=======result');
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getPairSwapListSaga');
  }
}
function* getPairRemoveLiquidityListSaga({
  symbolPair,
  loadingPaging,
  callBack,
}) {
  try {
    let pageNum = 1;
    const pairLiquidity = yield select(swapSelectors.pairRemoveLiquidity);
    const pairLiquidityList = pairLiquidity?.[symbolPair];
    if (loadingPaging && Array.isArray(pairLiquidityList)) {
      pageNum = Math.ceil(pairLiquidityList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/liquidityList?symbolPair=${symbolPair}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=remove`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/liquidityList?symbolPair=${symbolPair}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=remove`,
    );
    console.log(result, 'getPairRemoveLiquidityListSaga');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(pairLiquidityList)) {
        list = list.concat(pairLiquidityList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setPairRemoveLiquidity({[symbolPair]: list}));
    } else {
      callBack?.(-1);
    }
    console.log(result, '=======result');
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getPairSwapListSaga');
  }
}
function* getSymbolSwapListSaga({symbol, loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const symbolSwap = yield select(swapSelectors.symbolSwap);
    const symbolSwapList = symbolSwap?.[symbol];
    if (loadingPaging && Array.isArray(symbolSwapList)) {
      pageNum = Math.ceil(symbolSwapList.length / SWAP_PAGE_SIZE) + 1;
    }
    const result = yield getFetchRequest(
      `${swapPath}/swapList?symbol=${symbol}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(symbolSwapList)) {
        list = list.concat(symbolSwapList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setSymbolSwap({[symbol]: list}));
    } else {
      callBack?.(-1);
    }
    console.log(result, '=======getSymbolSwapListSaga');
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getSymbolSwapListSaga');
  }
}
function* getSymbolAddLiquidityListSaga({symbol, loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const symbolLiquidity = yield select(swapSelectors.symbolAddLiquidity);
    const symbolLiquidityList = symbolLiquidity?.[symbol];
    if (loadingPaging && Array.isArray(symbolLiquidityList)) {
      pageNum = Math.ceil(symbolLiquidityList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/liquidityList?symbol=${symbol}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=add`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/liquidityList?symbol=${symbol}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=add`,
    );
    console.log(result, 'getSymbolAddLiquidityListSaga');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(symbolLiquidityList)) {
        list = list.concat(symbolLiquidityList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setSymbolAddLiquidity({[symbol]: list}));
    } else {
      callBack?.(-1);
    }
    console.log(result, '=======result');
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getSymbolAddLiquidityListSaga');
  }
}
function* getSymbolRemoveLiquidityListSaga({symbol, loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const symbolLiquidity = yield select(swapSelectors.symbolRemoveLiquidity);
    const symbolLiquidityList = symbolLiquidity?.[symbol];
    if (loadingPaging && Array.isArray(symbolLiquidityList)) {
      pageNum = Math.ceil(symbolLiquidityList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/liquidityList?symbol=${symbol}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=remove`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/liquidityList?symbol=${symbol}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=remove`,
    );
    console.log(result, 'getSymbolRemoveLiquidityListSaga');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(symbolLiquidityList)) {
        list = list.concat(symbolLiquidityList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setSymbolRemoveLiquidity({[symbol]: list}));
    } else {
      callBack?.(-1);
    }
    console.log(result, '=======result');
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getSymbolRemoveLiquidityListSaga');
  }
}

function* getAddressSwapListSaga({address, loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const addressSwap = yield select(swapSelectors.addressSwap);
    const addressSwapList = addressSwap?.[address];
    if (loadingPaging && Array.isArray(addressSwapList)) {
      pageNum = Math.ceil(addressSwapList.length / SWAP_PAGE_SIZE) + 1;
    }
    const result = yield getFetchRequest(
      `${swapPath}/swapList?address=${address}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}`,
    );
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(addressSwapList)) {
        list = list.concat(addressSwapList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setAddressSwap({[address]: list}));
    } else {
      callBack?.(-1);
    }
    console.log(result, '=======getAddressSwapListSaga');
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getAddressSwapListSaga');
  }
}
function* getAddressAddLiquidityListSaga({address, loadingPaging, callBack}) {
  try {
    let pageNum = 1;
    const addressLiquidity = yield select(swapSelectors.addressAddLiquidity);
    const addressLiquidityList = addressLiquidity?.[address];
    if (loadingPaging && Array.isArray(addressLiquidityList)) {
      pageNum = Math.ceil(addressLiquidityList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/liquidityList?address=${address}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=add`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/liquidityList?address=${address}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=add`,
    );
    console.log(result, 'getAddressAddLiquidityListSaga');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(addressLiquidityList)) {
        list = list.concat(addressLiquidityList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setAddressAddLiquidity({[address]: list}));
    } else {
      callBack?.(-1);
    }
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getAddressAddLiquidityListSaga');
  }
}
function* getAddressRemoveLiquidityListSaga({
  address,
  loadingPaging,
  callBack,
}) {
  try {
    let pageNum = 1;
    const addressLiquidity = yield select(swapSelectors.addressRemoveLiquidity);
    const addressLiquidityList = addressLiquidity?.[address];
    if (loadingPaging && Array.isArray(addressLiquidityList)) {
      pageNum = Math.ceil(addressLiquidityList.length / SWAP_PAGE_SIZE) + 1;
    }
    console.log(
      `${swapPath}/liquidityList?address=${address}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=remove`,
    );
    const result = yield getFetchRequest(
      `${swapPath}/liquidityList?address=${address}&pageNum=${pageNum}&pageSize=${SWAP_PAGE_SIZE}&type=remove`,
    );
    console.log(result, 'getAddressRemoveLiquidityListSaga');
    if (result.msg === 'success') {
      let list = [];
      if (loadingPaging && Array.isArray(addressLiquidityList)) {
        list = list.concat(addressLiquidityList);
      }
      list = list.concat(result.data?.list || []);
      if (result.data?.list?.length < SWAP_PAGE_SIZE) {
        callBack?.(0);
      } else {
        callBack?.(1);
      }
      yield put(swapActions.setAddressRemoveLiquidity({[address]: list}));
    } else {
      callBack?.(-1);
    }
  } catch (error) {
    callBack?.(-1);
    console.log(error, 'getAddressAddLiquidityListSaga');
  }
}
export default function* SwapSaga() {
  yield all([
    yield takeLatest(swapTypes.GET_PAIRS, getPairsSaga),
    yield takeLatest(swapTypes.CREATE_PAIR, createPairSaga),
    yield takeLatest(swapTypes.GET_TOTAL_SUPPLY, getTotalSupplySaga),

    yield takeLatest(swapTypes.GET_PAIR_LIST, getPairListSaga),

    yield takeLatest(swapTypes.ADD_LIQUIDITY, addLiquiditySaga),
    yield takeLatest(swapTypes.GET_ACCOUNT_ASSETS, getAccountAssetsSaga),
    yield takeLatest(swapTypes.SWAP_TOKEN, swapTokenSaga),
    yield takeLatest(swapTypes.REMOVE_LIQUIDITY, removeLiquiditySaga),
    yield takeLatest(swapTypes.GET_PAIR_CANDLE_STICK, getPairCandleStickSaga),
    yield takeLatest(swapTypes.GET_PAIR_CHARTS, getPairChartsSaga),
    yield takeLatest(swapTypes.GET_PAIR_INFO, getPairInfoSaga),
    yield takeLatest(swapTypes.GET_OVERVIEW_CHART, getOverviewChartSaga),
    yield takeLatest(swapTypes.GET_TOKEN_INFO, getTokenInfoSaga),
    yield takeLatest(swapTypes.GET_ACCOUNT_INFO, getAccountInfoSaga),
    yield takeLatest(swapTypes.GET_ACCOUNT_CHART, getAccountChartSaga),

    yield takeLatest(swapTypes.GET_OVERVIEW_INFO, getOverviewInfoSaga),
    yield takeLatest(swapTypes.GET_ACCOUNT_LIST, getAccountListSaga),

    yield takeLatest(swapTypes.GET_TOKEN_LIST, getTokenListSaga),
    yield takeLatest(swapTypes.GET_TOKEN_CHART, getTokenChartSaga),
    yield takeLatest(swapTypes.GET_PRICE_CANDLE_STICK, getPriceCandleStickSaga),

    //pair transactions
    yield takeLatest(swapTypes.GET_PAIR_SWAP_LIST, getPairSwapListSaga),
    yield takeLatest(
      swapTypes.GET_PAIR_ADD_LIQUIDITY_LIST,
      getPairAddLiquidityListSaga,
    ),
    yield takeLatest(
      swapTypes.GET_PAIR_REMOVE_LIQUIDITY_LIST,
      getPairRemoveLiquidityListSaga,
    ),

    //symbol  transactions
    yield takeLatest(swapTypes.GET_SYMBOL_SWAP_LIST, getSymbolSwapListSaga),
    yield takeLatest(
      swapTypes.GET_SYMBOL_ADD_LIQUIDITY_LIST,
      getSymbolAddLiquidityListSaga,
    ),
    yield takeLatest(
      swapTypes.GET_SYMBOL_REMOVE_LIQUIDITY_LIST,
      getSymbolRemoveLiquidityListSaga,
    ),

    //address  transactions
    yield takeLatest(swapTypes.GET_ADDRESS_SWAP_LIST, getAddressSwapListSaga),
    yield takeLatest(
      swapTypes.GET_ADDRESS_ADD_LIQUIDITY_LIST,
      getAddressAddLiquidityListSaga,
    ),
    yield takeLatest(
      swapTypes.GET_ADDRESS_REMOVE_LIQUIDITY_LIST,
      getAddressRemoveLiquidityListSaga,
    ),
  ]);
}
