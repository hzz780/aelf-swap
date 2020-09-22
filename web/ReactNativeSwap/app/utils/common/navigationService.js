/**
 * React-navigation
 */
import {CommonActions, StackActions} from '@react-navigation/native';

let _navigator;
/**
 * init
 * @param navigatorRef
 */
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

/**
 * navigate
 * @param name
 * @param params
 */
function navigate(name, params) {
  _navigator?.dispatch(
    CommonActions.navigate({
      name,
      params,
    }),
  );
}

/**
 * goBack
 */
function goBack() {
  _navigator?.dispatch(CommonActions.goBack());
}

/**
 * reset
 */
function reset(name) {
  let resetAction;
  if (Array.isArray(name)) {
    resetAction = CommonActions.reset({
      index: name.length - 1,
      routes: name,
    });
  } else {
    resetAction = CommonActions.reset({
      index: 0,
      routes: [{name}],
    });
  }
  _navigator?.dispatch(resetAction);
}

function push(routeName, params) {
  const pushAction = StackActions.push(routeName, params);
  _navigator?.dispatch(pushAction);
}

function pop(count) {
  const pushAction = StackActions.pop(count);
  _navigator?.dispatch(pushAction);
}

export default {
  setTopLevelNavigator,
  navigate,
  goBack,
  reset,
  push,
  pop,
};
