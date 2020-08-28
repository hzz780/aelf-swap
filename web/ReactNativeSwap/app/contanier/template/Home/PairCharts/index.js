import React, {memo, useCallback, useMemo, useState} from 'react';
import {
  Touchable,
  BounceSpinner,
  Charts,
} from '../../../../components/template';
import {View, StyleSheet} from 'react-native';
import swapActions from '../../../../redux/swapRedux';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {useStateToProps} from '../../../../utils/pages/hooks';
import {TextM, TextL} from '../../../../components/template/CommonText';
import {Colors} from '../../../../assets/theme';
import {pixelSize} from '../../../../utils/common/device';
import {pTd} from '../../../../utils/common';
import config from '../../../../components/template/Charts/config';
import aelfUtils from '../../../../utils/pages/aelfUtils';
import swapUtils from '../../../../utils/pages/swapUtils';
const {chartsHeigth, candlestickItemStyle} = config;
const defaultPeriod = 'week';
const periodConfig = ['week', 'month', 'all'];
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
    (symbolPair, range) =>
      dispatch(swapActions.getPairCandleStick(symbolPair, range)),
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
  const [toolIndex, setToolIndex] = useState(0);
  const [period, setPeriod] = useState(0);
  const onGetPairCandleStick = useCallback(
    range => {
      getPairCandleStick(symbolPair, range);
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
      onGetPairCandleStick(defaultPeriod);
      onGetPairCharts(defaultPeriod);
    }, [onGetPairCandleStick, onGetPairCharts]),
  );
  const candleStickData =
    pairCandleStick && pairCandleStick[symbolPair]
      ? pairCandleStick[symbolPair][periodConfig[period]]
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
        onGetPairCandleStick(periodConfig[period]);
      }
      setToolIndex(index);
    },
    [onGetPairCandleStick, onGetPairCharts, period],
  );
  const ToolMemo = useMemo(() => {
    const toolListLength = list.length;
    return (
      <View style={styles.toolBox}>
        {list.map((item, index) => {
          let toolItemBox = [styles.toolItemBox];
          let textStyles;
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
  const onSetPeriod = useCallback(
    index => {
      if (toolIndex === 0 || toolIndex === 1) {
        onGetPairCharts(periodConfig[index]);
      } else {
        onGetPairCandleStick(periodConfig[index]);
      }
      setPeriod(index);
    },
    [onGetPairCandleStick, onGetPairCharts, toolIndex],
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
              <TextL style={textStyles}>{item}</TextL>
            </Touchable>
          );
        })}
      </View>
    );
  }, [onSetPeriod, period, periodList]);
  const BodyMemo = useMemo(() => {
    let format;
    if (period === 2 || toolIndex < 2) {
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
      series = {
        type: 'candlestick',
        name: list[toolIndex],
        data: chartData,
        itemStyle: candlestickItemStyle,
      };
    }
    return (
      <View>
        {loading && (
          <View style={[styles.loadView]}>
            <BounceSpinner type="Wave" />
          </View>
        )}
        <Charts series={series} dates={timeDates} />
      </View>
    );
  }, [candleStickData, chartsData, list, period, toolIndex]);
  return (
    <View style={styles.container}>
      {ToolMemo}
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
    borderWidth: pixelSize,
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
