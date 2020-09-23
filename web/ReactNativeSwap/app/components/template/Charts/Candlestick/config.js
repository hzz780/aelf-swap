import config from '../config';
const {
  top,
  grid,
  chartsHeight,
  candlestickItemStyle,
  yAxis,
  tooltip,
  xAxis,
  colorList,
  dataZoom,
} = config;
const volumeItemStyle = {color: '#7fbe9e'};
const defaultOption = {
  color: colorList,
  animation: true,
  tooltip,
  axisPointer: {
    link: [
      {
        xAxisIndex: [0, 1],
      },
    ],
  },
  yAxis,
  grid,
};

export default {
  defaultOption,
  xAxis,
  chartsHeight,
  volumeItemStyle,
  candlestickItemStyle,
  top,
  dataZoom,
};
