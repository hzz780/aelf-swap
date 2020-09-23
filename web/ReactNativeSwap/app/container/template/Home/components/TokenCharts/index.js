import React, {memo, useMemo, useState, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import {Charts, Touchable} from '../../../../../components/template';
import {Colors} from '../../../../../assets/theme';
import {TextS} from '../../../../../components/template/CommonText';
import {pTd} from '../../../../../utils/common';
import swapUtils from '../../../../../utils/pages/swapUtils';
import {useDispatch} from 'react-redux';
import swapActions from '../../../../../redux/swapRedux';
import ToolMemo from '../../components/ToolMemo';
import LoadView from '../LoadView';
import IconMemo from '../IconMemo';
const periodConfig = ['week', 'month', 'all'];
const defaultPeriod = periodConfig[0];
const TokenCharts = props => {
  const dispatch = useDispatch();
  const getTokenChart = useCallback(
    (symbol, range) => dispatch(swapActions.getTokenChart(symbol, range)),
    [dispatch],
  );
  const {symbol} = props;
  const onGetTokenChart = useCallback(
    range => {
      getTokenChart(symbol, range);
    },
    [getTokenChart, symbol],
  );
  useEffect(() => {
    onGetTokenChart(defaultPeriod);
  }, [onGetTokenChart]);
  const {tokenChart} = useStateToProps(base => {
    const {swap} = base;
    return {
      tokenChart: swap.tokenChart,
    };
  });
  const periodList = ['1W', '1M', 'All'];
  const list = ['Liquidity', 'Volume'];
  const [toolIndex, setToolIndex] = useState(0);
  const [period, setPeriod] = useState(0);
  const onSetToolIndex = useCallback(
    index => {
      onGetTokenChart(periodConfig[period]);
      setToolIndex(index);
    },
    [onGetTokenChart, period],
  );
  const charts = tokenChart?.[symbol]?.[periodConfig[period]];
  const toolMemo = useMemo(() => {
    return (
      <View style={styles.toolMemoBox}>
        <ToolMemo
          list={list}
          toolIndex={toolIndex}
          onSetToolIndex={onSetToolIndex}
        />
        <IconMemo
          horizontal={props.horizontal}
          component={
            <TokenCharts horizontal {...props} toolHeight={pTd(160)} />
          }
        />
      </View>
    );
  }, [list, onSetToolIndex, props, toolIndex]);
  const onSetPeriod = useCallback(
    index => {
      onGetTokenChart(periodConfig[index]);
      setPeriod(index);
    },
    [onGetTokenChart],
  );
  const PeriodMemo = useMemo(() => {
    return (
      <View style={styles.toolBox}>
        {periodList.map((item, index) => {
          let periodItem = [styles.periodItem];
          let textStyles = styles.grayColor;
          if (index === period) {
            periodItem.push(styles.borderColor);
            textStyles = styles.primaryColor;
          }
          return (
            <Touchable
              onPress={() => onSetPeriod(index)}
              key={index}
              style={periodItem}>
              <TextS style={textStyles}>{item}</TextS>
            </Touchable>
          );
        })}
      </View>
    );
  }, [onSetPeriod, period, periodList]);
  const BodyMemo = useMemo(() => {
    let series, boundaryGap;
    let loading = true;
    if (charts) {
      loading = false;
    }
    let timeDates = [],
      chartData = [];
    if (toolIndex === 0) {
      const {data, dates} = swapUtils.arrayMap(
        charts,
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
      const {data, dates} = swapUtils.arrayMap(charts, 'volume', 'YYYY-MM-DD');
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
  }, [charts, list, props, toolIndex]);
  return (
    <View style={styles.container}>
      {toolMemo}
      {PeriodMemo}
      {BodyMemo}
    </View>
  );
};

export default memo(TokenCharts);
const styles = StyleSheet.create({
  container: {
    marginTop: pTd(20),
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
  toolMemoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
