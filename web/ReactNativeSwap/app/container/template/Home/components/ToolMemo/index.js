import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {Touchable} from '../../../../../components/template';
import {TextM} from '../../../../../components/template/CommonText';
const ToolMemo = props => {
  const {list, toolIndex, onSetToolIndex} = props;
  const rigthIndex = list.length - 1;
  return (
    <View flexWrap="wrap" style={styles.toolBox}>
      {list.map((item, index) => {
        let toolItemBox = [styles.toolItemBox];
        let textStyles = {color: Colors.fontGray};
        if (index === toolIndex) {
          toolItemBox.push(styles.bgColor);
          textStyles = styles.textColor;
        }
        if (index === 0) {
          toolItemBox.push(styles.leftBorder);
        } else if (index === rigthIndex) {
          toolItemBox.push(styles.rigthBorder);
        }
        return (
          <Touchable
            onPress={() => onSetToolIndex?.(index)}
            style={toolItemBox}
            key={index}>
            <TextM style={textStyles}>{item}</TextM>
          </Touchable>
        );
      })}
    </View>
  );
};

export default memo(ToolMemo);
const styles = StyleSheet.create({
  toolBox: {
    flex: 1,
    paddingLeft: pTd(20),
    flexDirection: 'row',
  },
  leftBorder: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rigthBorder: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  toolItemBox: {
    padding: 5,
    backgroundColor: '#f0f0f0',
    marginLeft: pTd(10),
    borderRadius: pTd(10),
    paddingTop: pTd(10),
    ...GStyle.shadow,
  },
  bgColor: {
    backgroundColor: Colors.primaryColor,
  },
  textColor: {
    color: 'white',
  },
  borderColor: {
    borderBottomWidth: 2,
    borderColor: Colors.primaryColor,
  },
});
