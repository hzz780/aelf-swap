import {useState, useCallback} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {createSelector} from 'reselect';
import aelfUtils from './aelfUtils';

const useSetState = (initial = {}, difference) => {
  const [state, saveState] = useState(initial);
  const setState = useCallback(
    newState => {
      saveState(prev => {
        if (newState === null) {
          return newState;
        }
        const NewState = Object.assign({}, prev || {}, newState || {});
        if (difference && aelfUtils.deepEqual(newState, prev)) {
          return prev;
        }
        return NewState;
      });
    },
    [difference],
  );
  return [state, setState];
};

const useStateToProps = combiner => {
  return useSelector(
    createSelector(
      state => state,
      combiner,
    ),
    shallowEqual,
  );
};
export {useSetState, useStateToProps};
