import React, {memo, useMemo, useState, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useStateToProps} from '../../../../../utils/pages/hooks';
import {Charts, Touchable} from '../../../../../components/template';
import {Colors} from '../../../../../assets/theme';
import {TextS} from '../../../../../components/template/CommonText';
import {pTd} from '../../../../../utils/common';
import swapUtils from '../../../../../utils/pages/swapUtils';
import config from '../../../../../components/template/Charts/config';
import {useDispatch} from 'react-redux';
import swapActions from '../../../../../redux/swapRedux';
import ToolMemo from '../../components/ToolMemo';
import LoadView from '../LoadView';
import IconMemo from '../IconMemo';
const {candlestickItemStyle} = config;
const periodConfig = ['week', 'month', 'all'];
const defaultPeriod = periodConfig[0];
const kPeriodConfig = [900, 3600, 14400, 86400];
const defaultKPeriod = kPeriodConfig[kPeriodConfig.length - 1];
const TokenCharts = props => {
  const dispatch = useDispatch();
  const {symbol} = props;
  const onGetTokenChart = useCallback(
    range => dispatch(swapActions.getTokenChart(symbol, range)),
    [dispatch, symbol],
  );
  const onGetPriceCandleStick = useCallback(
    interval => dispatch(swapActions.getPriceCandleStick(symbol, interval)),
    [dispatch, symbol],
  );
  useEffect(() => {
    onGetPriceCandleStick(defaultKPeriod);
    onGetTokenChart(defaultPeriod);
  }, [onGetPriceCandleStick, onGetTokenChart]);
  const {tokenChart, priceCandleStick} = useStateToProps(base => {
    const {swap} = base;
    return {
      priceCandleStick: swap.priceCandleStick?.[symbol],
      tokenChart: swap.tokenChart?.[symbol],
    };
  });
  const periodList = ['1W', '1M', 'All'];
  const kPeriodList = ['15min', '1hour', '4hour', '1day'];
  const list = ['Liquidity', 'Volume', 'Price'];
  const [toolIndex, setToolIndex] = useState(props.toolIndex || 0);
  const [period, setPeriod] = useState(props.period || 0);
  const [kPeriod, setKPeriod] = useState(
    props.kPeriod !== undefined ? props.kPeriod : kPeriodConfig.length - 1,
  );
  const onSetToolIndex = useCallback(
    index => {
      if (index < 2) {
        onGetTokenChart(periodConfig[period]);
      } else {
        onGetPriceCandleStick(kPeriodConfig[kPeriod]);
      }
      setToolIndex(index);
    },
    [kPeriod, onGetPriceCandleStick, onGetTokenChart, period],
  );
  const charts = tokenChart?.[periodConfig[period]];
  const candleStickData = priceCandleStick?.[kPeriodConfig[kPeriod]];
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
            <TokenCharts
              horizontal
              {...props}
              period={period}
              kPeriod={kPeriod}
              toolIndex={toolIndex}
              toolHeight={pTd(160)}
            />
          }
        />
      </View>
    );
  }, [kPeriod, list, onSetToolIndex, period, props, toolIndex]);
  const onSetPeriod = useCallback(
    index => {
      onGetTokenChart(periodConfig[index]);
      setPeriod(index);
    },
    [onGetTokenChart],
  );
  const onSetKPeriod = useCallback(
    index => {
      onGetPriceCandleStick(kPeriodConfig[index]);
      setKPeriod(index);
    },
    [onGetPriceCandleStick],
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
    let series, boundaryGap, format;
    let loading = true;
    if (kPeriod > 2) {
      format = 'YYYY-MM-DD';
    }
    if (toolIndex <= 1 && charts) {
      loading = false;
    } else if (candleStickData) {
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
    } else {
      const {data, dates} = swapUtils.arrayMap(
        candleStickData,
        'price',
        format,
      );
      timeDates = dates;
      chartData = data;
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
        <Charts
          {...props}
          series={series}
          dates={timeDates}
          boundaryGap={boundaryGap}
        />
      </View>
    );
  }, [candleStickData, charts, kPeriod, list, props, toolIndex]);
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
