import {store} from '../../redux';
const getState = key => {
  return store.getState(key);
};
export default {
  getState,
};
