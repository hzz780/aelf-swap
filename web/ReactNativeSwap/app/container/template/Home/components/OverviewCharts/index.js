import React, {memo, useMemo, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import {Charts} from '../../../../../components/template';
import {pTd} from '../../../../../utils/common';
import swapUtils from '../../../../../utils/pages/swapUtils';
import ToolMemo from '../../components/ToolMemo';
import LoadView from '../LoadView';
import IconMemo from '../IconMemo';
const OverviewCharts = props => {
  const {overviewChart} = useStateToProps(base => {
    const {swap} = base;
    return {
      overviewChart: swap.overviewChart,
    };
  });
  const list = ['Liquidity', 'Volume'];
  const [toolIndex, setToolIndex] = useState(props.toolIndex || 0);
  const onSetToolIndex = useCallback(index => {
    setToolIndex(index);
  }, []);
  const toolMemo = useMemo(() => {
    return (
      <View style={styles.toolBox}>
        <ToolMemo
          list={list}
          toolIndex={toolIndex}
          onSetToolIndex={onSetToolIndex}
        />
        <IconMemo
          horizontal={props.horizontal}
          component={
            <OverviewCharts
              toolIndex={toolIndex}
              horizontal
              toolHeight={pTd(100)}
            />
          }
        />
      </View>
    );
  }, [list, onSetToolIndex, props.horizontal, toolIndex]);
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
      <View>
        {loading && <LoadView />}
        <Charts
          {...props}
          series={series}
          dates={timeDates}
          boundaryGap={boundaryGap}
        />
      </View>
    );
  }, [list, overviewChart, props, toolIndex]);
  return (
    <View style={styles.container}>
      {toolMemo}
      {BodyMemo}
    </View>
  );
};

export default memo(OverviewCharts);
const styles = StyleSheet.create({
  container: {
    marginTop: pTd(20),
    paddingTop: pTd(10),
    backgroundColor: Colors.bgColor2,
  },
  toolBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
