import React, {memo} from 'react';
import {HorizontalModal, Touchable} from '../../../../../components/template';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
const IconMemo = props => {
  const {horizontal, component} = props;
  return (
    <Touchable
      onPress={() => {
        horizontal ? HorizontalModal.hide() : HorizontalModal.show(component);
      }}
      style={{paddingHorizontal: pTd(30)}}>
      {horizontal ? (
        <AntDesign color={Colors.fontGray} size={pTd(40)} name="close" />
      ) : (
        <Feather color={Colors.fontGray} name="maximize" size={pTd(35)} />
      )}
    </Touchable>
  );
};

export default memo(IconMemo);
