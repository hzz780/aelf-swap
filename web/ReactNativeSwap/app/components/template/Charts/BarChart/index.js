import React, {memo} from 'react';
import Echarts from '../../Echarts';
import config from '../config';
import aelfUtils from '../../../../utils/pages/aelfUtils';
const {dataZoom, grid, chartsHeigth, colorList, tooltip, xAxis, yAxis} = config;
const Areachart = props => {
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
  return <Echarts height={chartsHeigth} option={option} />;
};

export default memo(Areachart);
