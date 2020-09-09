import React, {memo, useMemo, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useStateToProps} from '../../../../utils/pages/hooks';
import {
  Charts,
  Touchable,
  BounceSpinner,
} from '../../../../components/template';
import {pixelSize} from '../../../../utils/common/device';
import {Colors, GStyle} from '../../../../assets/theme';
import {TextM} from '../../../../components/template/CommonText';
import config from '../../../../components/template/Charts/config';
import {pTd} from '../../../../utils/common';
import swapUtils from '../../../../utils/pages/swapUtils';
const {chartsHeigth} = config;
const OverviewCharts = () => {
  const {overviewChart} = useStateToProps(base => {
    const {swap} = base;
    return {
      overviewChart: swap.overviewChart,
    };
  });
  const list = ['Liquidity', 'Volume'];
  const [toolIndex, setToolIndex] = useState(0);
  const onSetToolIndex = useCallback(index => {
    setToolIndex(index);
  }, []);
  const ToolMemo = useMemo(() => {
    const toolListLength = list.length;
    return (
      <View style={styles.toolBox}>
        {list.map((item, index) => {
          let toolItemBox = [styles.toolItemBox];
          let textStyles = {color: Colors.fontGray};
          if (index === toolIndex) {
            toolItemBox.push(styles.bgColor);
            textStyles = styles.textColor;
          }
          if (index === 0) {
            toolItemBox.push(styles.leftBorder);
          } else if (index === toolListLength - 1) {
            toolItemBox.push(styles.rigthBorder);
          }
          return (
            <Touchable
              onPress={() => onSetToolIndex(index)}
              style={toolItemBox}
              key={index}>
              <TextM style={textStyles}>{item}</TextM>
            </Touchable>
          );
        })}
      </View>
    );
  }, [list, onSetToolIndex, toolIndex]);
  const BodyMemo = useMemo(() => {
    let series, boundaryGap;
    let loading = true;
    if (overviewChart) {
      loading = false;
    }
    let timeDates = [],
      chartData = [];
    if (toolIndex === 0) {
      const {data, dates} = swapUtils.arrayMap(
        overviewChart,
        'liquidity',
        'YYYY-MM-DD',
      );
      timeDates = dates;
      chartData = data;
      series = {
        data: chartData,
        type: 'line',
        areaStyle: {},
        showSymbol: false,
        name: list[toolIndex],
      };
      boundaryGap = false;
    } else if (toolIndex === 1) {
      const {data, dates} = swapUtils.arrayMap(
        overviewChart,
        'volume',
        'YYYY-MM-DD',
      );
      timeDates = dates;
      chartData = data;
      series = {
        data: chartData,
        type: 'bar',
        name: list[toolIndex],
      };
      boundaryGap = true;
    }
    return (
      <>
        {loading && (
          <View style={[styles.loadView]}>
            <BounceSpinner type="Wave" />
          </View>
        )}
        <Charts series={series} dates={timeDates} boundaryGap={boundaryGap} />
      </>
    );
  }, [list, overviewChart, toolIndex]);
  return (
    <View style={styles.container}>
      {ToolMemo}
      {BodyMemo}
    </View>
  );
};

export default memo(OverviewCharts);
const styles = StyleSheet.create({
  container: {
    paddingTop: pTd(10),
    backgroundColor: 'white',
  },
  toolBox: {
    paddingLeft: pTd(20),
    flexDirection: 'row',
  },
  periodItem: {
    paddingVertical: 5,
    paddingHorizontal: 15,
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
  primaryColor: {
    color: Colors.primaryColor,
  },
  grayColor: {
    color: Colors.fontGray,
  },
  loadView: {
    width: '100%',
    position: 'absolute',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    height: chartsHeigth,
  },
});
