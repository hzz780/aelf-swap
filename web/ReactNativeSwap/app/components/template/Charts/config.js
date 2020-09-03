/* eslint-disable no-undef */
import {Colors} from '../../../assets/theme';
import {isIos} from '../../../utils/common/device';
const formatter = params => {
  const param = params[0];
  if (param.componentSubType === 'bar') {
    return (
      param.name +
      ' <br/>' +
      param.marker +
      param.seriesName +
      ': ' +
      aelfDigits(param.value)
    );
  } else if (param.componentSubType === 'candlestick') {
    let text = param.name + '<br/>';
    for (let i = 0; i < params.length; i++) {
      const element = params[i];
      const data = element.data;
      if (i === 0) {
        for (let ei = 0; ei < data.length; ei++) {
          const item = data[ei];
          if (ei > 0) {
            text =
              text +
              element.marker +
              typeName[ei] +
              ': ' +
              aelfDigits(item) +
              '<br/>';
          }
        }
      } else {
        text =
          text +
          element.marker +
          element.seriesName +
          ': ' +
          aelfDigits(data) +
          '<br/>';
      }
    }
    return text;
  } else {
    return (
      param.name +
      ' <br/>' +
      param.marker +
      param.seriesName +
      ': ' +
      aelfDigits(param.value)
    );
  }
};
const top = 30;
const heigth = 200;
const chartsHeigth = top + heigth + 30 + 30;
const candlestickItemStyle = {
  color: Colors.kGreen,
  color0: Colors.kRed,
  borderColor: Colors.kGreen,
  borderColor0: Colors.kRed,
};
const areaStyle = {
  color: Colors.primaryColor,
};
const colorList = [
  'rgba(92, 40, 169, 0.7)',
  '#2f4554',
  '#d48265',
  '#d34A64',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
];
const yAxis = {
  scale: true,
  splitNumber: 2,
  position: 'right',
  axisLine: {lineStyle: {color: '#777'}},
  splitLine: {show: true},
  axisTick: {show: false},
  axisLabel: {
    inside: true,
    formatter: '{value}\n',
  },
  axisPointer: {
    show: true,
    label: {
      fontSize: 9,
    },
  },
};
const tooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'cross',
  },
  transitionDuration: 0,
  confine: true,
  bordeRadius: 4,
  borderWidth: 1,
  borderColor: '#333',
  backgroundColor: 'rgba(255,255,255,0.8)',
  textStyle: {
    fontSize: 12,
    color: Colors.primaryColor,
  },
  formatter,
  position: function(pos, params, el, elRect, size) {
    let obj = {
      top: 30,
    };
    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
    return obj;
  },
};
const xAxis = {
  type: 'category',
  boundaryGap: false,
  axisLine: {lineStyle: {color: '#777', fonSize: 8}},
  min: 'dataMin',
  max: 'dataMax',
  axisPointer: {
    show: true,
    label: {
      padding: [5, 8],
      fontSize: 9,
    },
  },
  axisLabel: {
    fontSize: 9,
  },
};
const grid = {
  left: isIos ? 20 : 18,
  right: 20,
  top: top,
  height: heigth,
};
const dataZoom = [
  {
    type: 'inside',
    start: 0,
    end: 100,
    top: top,
  },
  {
    show: true,
    type: 'slider',
    top: top + heigth + 30,
    start: 0,
    end: 100,
    height: 20,
    handleIcon:
      'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    handleSize: '120%',
    textStyle: {fontSize: 0.1},
  },
];
const legend = {
  top: 5,
  data: ['MA5', 'MA10', 'MA15'],
};
export default {
  grid,
  top,
  heigth,
  chartsHeigth,
  candlestickItemStyle,
  areaStyle,
  colorList,
  yAxis,
  tooltip,
  xAxis,
  dataZoom,
  legend,
};
