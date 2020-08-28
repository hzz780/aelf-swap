import {Colors} from '../../../../assets/theme';
import config from '../config';
const {
  top,
  grid,
  chartsHeigth,
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
  chartsHeigth,
  volumeItemStyle,
  candlestickItemStyle,
  top,
  dataZoom,
};
