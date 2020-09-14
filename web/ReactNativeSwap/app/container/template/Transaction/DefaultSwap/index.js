import React, {memo} from 'react';
import Swap from '../Swap';
import {CommonHeader} from '../../../../components/template';
import i18n from 'i18n-js';
const DefaultSwap = props => {
  return (
    <>
      <CommonHeader title={i18n.t('swap.swap')} canBack />
      <Swap {...props} />
    </>
  );
};
export default memo(DefaultSwap);
