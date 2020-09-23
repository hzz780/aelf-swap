import React, {memo} from 'react';
import ECharts from '../../ECharts';
import config from '../config';
import aelfUtils from '../../../../utils/pages/aelfUtils';
const {dataZoom, grid, chartsHeight, colorList, tooltip, xAxis, yAxis} = config;
const AreaChart = props => {
  const {data} = props;
  let dates = [],
    chartData = [];
  if (Array.isArray(data)) {
    const l = data.length;
    for (let i = 0; i < l; i++) {
      const item = data[i];
      dates.push(aelfUtils.timeConversion(item.timestamp));
      chartData.push(item.volume);
    }
  }
  const option = {
    color: colorList,
    tooltip,
    xAxis: {
      ...xAxis,
      boundaryGap: true,
      data: dates,
    },
    dataZoom,
    yAxis,
    grid,
    series: [
      {
        data: chartData,
        type: 'bar',
      },
    ],
  };
  return <ECharts height={chartsHeight} option={option} />;
};

export default memo(AreaChart);
