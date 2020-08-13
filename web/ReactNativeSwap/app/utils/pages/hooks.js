import {useState, useCallback} from 'react';
import {useSelector, shallowEqual} from 'react-redux';
import {createSelector} from 'reselect';

const useSetState = (initial = {}) => {
  const [state, saveState] = useState(initial);
  const setState = useCallback(newState => {
    saveState(prev => ({...prev, ...newState}));
  }, []);
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
