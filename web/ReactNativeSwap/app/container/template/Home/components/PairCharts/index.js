import React, {memo, useCallback, useMemo, useState} from 'react';
import {Touchable, Charts} from '../../../../../components/template';
import {View, StyleSheet} from 'react-native';
import swapActions from '../../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import {TextS} from '../../../../../components/template/CommonText';
import {Colors} from '../../../../../assets/theme';
import {pTd} from '../../../../../utils/common';
import config from '../../../../../components/template/Charts/config';
import swapUtils from '../../../../../utils/pages/swapUtils';
import ToolMemo from '../../ToolMemo';
import LoadView from '../LoadView';
const {candlestickItemStyle} = config;
const periodConfig = ['week', 'month', 'all'];
const defaultPeriod = periodConfig[0];
const kPeriodConfig = [900, 3600, 14400, 86400];
const defaultKPeriod = kPeriodConfig[kPeriodConfig.length - 1];
const PairCharts = props => {
  const dispatch = useDispatch();
  const {pairCandleStick, pairCharts} = useStateToProps(base => {
    const {swap} = base;
    return {
      pairCandleStick: swap.pairCandleStick,
      pairCharts: swap.pairCharts,
    };
  });
  const getPairCandleStick = useCallback(
    (symbolPair, interval) =>
      dispatch(swapActions.getPairCandleStick(symbolPair, interval)),
    [dispatch],
  );
  const getPairCharts = useCallback(
    (symbolPair, range) =>
      dispatch(swapActions.getPairCharts(symbolPair, range)),
    [dispatch],
  );
  const {symbolPair, symbolA, symbolB} = props;
  const list = [
    'Liquidity',
    'Volume',
    `${symbolA}/${symbolB}`,
    `${symbolB}/${symbolA}`,
  ];
  const periodList = ['1W', '1M', 'All'];
  const kPeriodList = ['15min', '1hour', '4hour', '1day'];
  const [toolIndex, setToolIndex] = useState(0);
  const [period, setPeriod] = useState(0);
  const [kPeriod, setKPeriod] = useState(kPeriodConfig.length - 1);
  const onGetPairCandleStick = useCallback(
    interval => {
      getPairCandleStick(symbolPair, interval);
    },
    [getPairCandleStick, symbolPair],
  );
  const onGetPairCharts = useCallback(
    range => {
      getPairCharts(symbolPair, range);
    },
    [getPairCharts, symbolPair],
  );
  useFocusEffect(
    useCallback(() => {
      onGetPairCandleStick(defaultKPeriod);
      onGetPairCharts(defaultPeriod);
    }, [onGetPairCandleStick, onGetPairCharts]),
  );
  const candleStickData =
    pairCandleStick && pairCandleStick[symbolPair]
      ? pairCandleStick[symbolPair][kPeriodConfig[kPeriod]]
      : undefined;

  const chartsData =
    pairCharts && pairCharts[symbolPair]
      ? pairCharts[symbolPair][periodConfig[period]]
      : undefined;
  const onSetToolIndex = useCallback(
    index => {
      if (index === 0 || index === 1) {
        onGetPairCharts(periodConfig[period]);
      } else {
        onGetPairCandleStick(kPeriodConfig[kPeriod]);
      }
      setToolIndex(index);
    },
    [kPeriod, onGetPairCandleStick, onGetPairCharts, period],
  );
  const toolMemo = useMemo(() => {
    return (
      <ToolMemo
        list={list}
        toolIndex={toolIndex}
        onSetToolIndex={onSetToolIndex}
      />
    );
  }, [list, onSetToolIndex, toolIndex]);
  const onSetPeriod = useCallback(
    index => {
      onGetPairCharts(periodConfig[index]);
      setPeriod(index);
    },
    [onGetPairCharts],
  );
  const onSetKPeriod = useCallback(
    index => {
      onGetPairCandleStick(kPeriodConfig[index]);
      setKPeriod(index);
    },
    [onGetPairCandleStick],
  );
  const PeriodMemo = useMemo(() => {
    return (
      <View style={styles.toolBox}>
        {toolIndex > 1
          ? kPeriodList.map((item, index) => {
              let periodItem = [styles.periodItem];
              let textStyles = styles.grayColor;
              if (index === kPeriod) {
                periodItem.push(styles.borderColor);
                textStyles = styles.primaryColor;
              }
              return (
                <Touchable
                  onPress={() => onSetKPeriod(index)}
                  key={index}
                  style={periodItem}>
                  <TextS style={textStyles}>{item}</TextS>
                </Touchable>
              );
            })
          : periodList.map((item, index) => {
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
  }, [
    kPeriod,
    kPeriodList,
    onSetKPeriod,
    onSetPeriod,
    period,
    periodList,
    toolIndex,
  ]);
  const BodyMemo = useMemo(() => {
    let format,
      boundaryGap = false;
    if (kPeriod > 2 || toolIndex < 2) {
      format = 'YYYY-MM-DD';
    }
    let loading = true;
    if (toolIndex <= 1 && chartsData) {
      loading = false;
    } else if (candleStickData) {
      loading = false;
    }
    let series;
    let timeDates = [],
      chartData = [];
    if (toolIndex === 0) {
      const {data, dates} = swapUtils.arrayMap(chartsData, 'liquidity', format);
      timeDates = dates;
      chartData = data;
      series = {
        data: chartData,
        type: 'line',
        name: list[toolIndex],
        areaStyle: {},
        showSymbol: false,
      };
    } else if (toolIndex === 1) {
      boundaryGap = true;
      const {data, dates} = swapUtils.arrayMap(chartsData, 'volume', format);
      timeDates = dates;
      chartData = data;
      series = {
        data: chartData,
        name: list[toolIndex],
        type: 'bar',
      };
    } else {
      if (toolIndex === 2) {
        const {data, dates} = swapUtils.arrayMap(
          candleStickData,
          'priceAB',
          format,
        );
        timeDates = dates;
        chartData = data;
      } else {
        const {data, dates} = swapUtils.arrayMap(
          candleStickData,
          'priceBA',
          format,
        );
        timeDates = dates;
        chartData = data;
      }
      const dataMA5 = swapUtils.calculateMA(5, chartData);
      const dataMA10 = swapUtils.calculateMA(10, chartData);
      const dataMA15 = swapUtils.calculateMA(15, chartData);

      series = [
        {
          type: 'candlestick',
          name: list[toolIndex],
          data: chartData,
          itemStyle: candlestickItemStyle,
        },
        {
          name: 'MA5',
          type: 'line',
          data: dataMA5,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
        },
        {
          name: 'MA10',
          type: 'line',
          data: dataMA10,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
        },
        {
          name: 'MA15',
          type: 'line',
          data: dataMA15,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 1,
          },
        },
      ];
    }
    return (
      <View>
        {loading && <LoadView />}
        <Charts series={series} dates={timeDates} boundaryGap={boundaryGap} />
      </View>
    );
  }, [candleStickData, chartsData, kPeriod, list, toolIndex]);
  return (
    <View style={styles.container}>
      {toolMemo}
      {PeriodMemo}
      {BodyMemo}
    </View>
  );
};
export default memo(PairCharts);
const styles = StyleSheet.create({
  container: {
    marginTop: pTd(10),
    paddingTop: pTd(10),
    backgroundColor: 'white',
  },
  toolBox: {
    paddingLeft: pTd(20),
    flexDirection: 'row',
  },
  periodItem: {
    paddingVertical: 8,
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
});
