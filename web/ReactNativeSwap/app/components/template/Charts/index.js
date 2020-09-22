import React, {memo} from 'react';
import ECharts from '../ECharts';
import config from './config';
const showNumber = 30;
const {
  dataZoom,
  grid,
  chartsHeigth,
  colorList,
  tooltip,
  xAxis,
  yAxis,
  legend,
} = config;
const AreaChart = props => {
  const {series, dates, coverTooltip, boundaryGap} = props;
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
    dataZoom: [{...dataZoom[0], start}, {...dataZoom[1], start}],
    yAxis,
    grid,
    series,
    ...(KLine ? {legend} : {}),
  };
  return <ECharts height={chartsHeigth} option={option} />;
};

export default memo(AreaChart);
