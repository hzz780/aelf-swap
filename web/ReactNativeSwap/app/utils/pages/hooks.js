import {useState, useCallback} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {createSelector} from 'reselect';

const useSetState = (initial = {}, difference) => {
  const [state, saveState] = useState(initial);
  const setState = useCallback(
    newState => {
      saveState(prev => {
        const NewState = Object.assign({}, prev || {}, newState || {});
        if (difference && JSON.stringify(newState) === JSON.stringify(prev)) {
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
