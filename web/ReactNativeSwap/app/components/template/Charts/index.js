import React, {memo} from 'react';
import Echarts from '../Echarts';
import config from './config';
const {dataZoom, grid, chartsHeigth, colorList, tooltip, xAxis, yAxis} = config;
const Areachart = props => {
  const {series, dates, coverTooltip} = props;
  const option = {
    color: colorList,
    tooltip: Object.assign(tooltip, coverTooltip || {}),
    xAxis: {
      ...xAxis,
      boundaryGap: true,
      data: dates,
    },
    dataZoom,
    yAxis,
    grid,
    series,
  };
  return <Echarts height={chartsHeigth} option={option} />;
};

export default memo(Areachart);
