import React, {memo} from 'react';
import ECharts from '../../ECharts';
import config from './config';
import aelfUtils from '../../../../utils/pages/aelfUtils';
const {
  defaultOption,
  xAxis,
  chartsHeight,
  candlestickItemStyle,
  dataZoom,
} = config;
const Candlestick = props => {
  const {data, toolIndex, title} = props;
  let dates = [],
    candleStickData = [];
  if (Array.isArray(data)) {
    const l = data.length;
    for (let i = 0; i < l; i++) {
      const item = data[i];
      dates.push(aelfUtils.timeConversion(item.timestamp));
      if (toolIndex === 2) {
        candleStickData.push(data[i].priceAB);
      } else {
        candleStickData.push(data[i].priceBA);
      }
    }
  }
  const option = {
    ...defaultOption,
    xAxis: {...xAxis, data: dates},
    dataZoom,
    series: {
      type: 'candlestick',
      name: title,
      data: candleStickData,
      itemStyle: candlestickItemStyle,
    },
  };
  return <ECharts height={chartsHeight} option={option} />;
};

export default memo(Candlestick);
