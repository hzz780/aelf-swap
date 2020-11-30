import {useState, useCallback, useRef, useEffect} from 'react';
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
    createSelector(state => state, combiner),
    shallowEqual,
  );
};
const useFetchSetState = (...props) => {
  const focus = useRef();
  const [state, setState] = useSetState(...props);
  useEffect(() => {
    focus.current = true;
    return () => (focus.current = false);
  }, []);
  const setFetchState = useCallback(
    (...params) => {
      focus.current && setState(...params);
    },
    [setState],
  );
  return [state, setFetchState];
};

const useFetchState = (...props) => {
  const focus = useRef();
  const [state, setState] = useState(...props);
  useEffect(() => {
    focus.current = true;
    return () => (focus.current = false);
  }, []);
  const setFetchState = useCallback((...params) => {
    focus.current && setState(...params);
  }, []);
  return [state, setFetchState];
};
export {useSetState, useStateToProps, useFetchState, useFetchSetState};
