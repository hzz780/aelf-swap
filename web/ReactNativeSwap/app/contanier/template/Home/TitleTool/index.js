import React, {memo} from 'react';
import {View} from 'react-native';
import styles from '../styles';
import {TextM} from '../../../../components/template/CommonText';
const TitleTool = props => {
  const {titleList} = props;
  if (titleList.length === 2) {
    return (
      <View style={styles.listItemBox}>
        {titleList.map((item, index) => {
          let style = [
            styles.topSubtitle,
            styles.flexBox,
            styles.accountSubtitle,
          ];
          if (index === 0) {
            style = [
              styles.topSubtitle,
              styles.flexBox,
              styles.accountTitleStyle,
            ];
          }
          return (
            <TextM numberOfLines={1} style={style} key={index}>
              {item}
            </TextM>
          );
        })}
      </View>
    );
  }
  if (titleList.length === 4) {
    return (
      <View style={styles.listItemBox}>
        {titleList.map((item, index) => {
          let style = [styles.tokenTopSubtitle, styles.flexBox];
          if (index === 0) {
            style = [styles.titleStyle, styles.tokenTopSubtitle];
          }
          return (
            <TextM style={style} key={index}>
              {item}
            </TextM>
          );
        })}
      </View>
    );
  }
  return (
    <View style={styles.listItemBox}>
      {titleList.map((item, index) => {
        let style = [styles.topSubtitle, styles.flexBox];
        if (index === 0) {
          style = [styles.titleStyle, styles.topTitle];
        }
        return (
          <TextM style={style} key={index}>
            {item}
          </TextM>
        );
      })}
    </View>
  );
};

export default memo(TitleTool);
