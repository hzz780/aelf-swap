import React, {memo} from 'react';
import ECharts from '../ECharts';
import config from './config';
import {Dimensions} from 'react-native';
const showNumber = 30;
const {
  dataZoom,
  grid,
  chartsHeight,
  colorList,
  tooltip,
  xAxis,
  yAxis,
  legend,
  top,
} = config;
const AreaChart = props => {
  const {
    series,
    dates,
    coverTooltip,
    boundaryGap,
    horizontal,
    toolHeight,
  } = props;
  let chartHeight, height;
  if (horizontal) {
    const screen = Dimensions.get('screen');
    chartHeight =
      (screen.height > screen.width ? screen.width : screen.height) -
      toolHeight;
    height = chartHeight - top - 60;
  }
  let start = 0;
  const KLine = Array.isArray(series) && series[0]?.type === 'candlestick';
  if (KLine) {
    const length = series[0].data.length;
    if (length > showNumber) {
      start = 100 - parseInt((100 / length) * showNumber, 10);
    }
  }
  const option = {
    color: colorList,
    tooltip: Object.assign(tooltip, coverTooltip || {}),
    xAxis: {
      ...xAxis,
      boundaryGap,
      data: dates,
    },
    dataZoom: [
      {...dataZoom[0], start},
      {...dataZoom[1], start, ...(height ? {top: height + top + 30} : {})},
    ],
    yAxis,
    grid: {...grid, ...(height ? {height} : {})},
    series,
    ...(KLine ? {legend} : {}),
  };
  return <ECharts height={chartHeight || chartsHeight} option={option} />;
};

export default memo(AreaChart);
