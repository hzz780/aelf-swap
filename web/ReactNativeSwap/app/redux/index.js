import {combineReducers, createStore, applyMiddleware} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import reduxPersist from '../utils/common/reduxPersist';
import createSagaMiddleware from 'redux-saga';
import sagas from '../sagas';
export const reducers = combineReducers({
  user: require('./userRedux').reducer,
  settings: require('./settingsRedux').reducer,
  contracts: require('./contractsRedux').reducer,
  swap: require('./swapRedux').reducer,
});
let store;
export default () => {
  let finalReducers = reducers;
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (reduxPersist.active) {
    const {storeConfig} = reduxPersist;
    finalReducers = persistReducer(storeConfig, reducers);
  }
  // const store = createStore(finalReducers);

  //saga
  const sagaMiddleware = createSagaMiddleware();
  store = createStore(finalReducers, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(sagas);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers;
      store.replaceReducer(nextRootReducer);
    });
  }
  const persistor = persistStore(store);
  return {store, persistor};
};
export {store};
