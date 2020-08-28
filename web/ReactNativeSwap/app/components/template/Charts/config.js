import {Colors} from '../../../assets/theme';

const top = 10;
const heigth = 180;
const chartsHeigth = top + heigth + 30 + 30;
const candlestickItemStyle = {
  color: Colors.kRed,
  color0: Colors.kGreen,
  borderColor: Colors.kRed,
  borderColor0: Colors.kGreen,
};
const areaStyle = {
  color: Colors.primaryColor,
};
const colorList = [
  'rgba(92, 40, 169, 0.7)',
  '#2f4554',
  '#D34A64',
  '#d48265',
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
  formatter: function(params) {
    const param = params[0];
    if (param.componentSubType !== 'candlestick') {
      return (
        param.name +
        ' <br/>' +
        param.marker +
        param.seriesName +
        ': $' +
        param.value
      );
    } else {
      let text = param.name + '<br/>';
      const data = param.data;
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (i > 0) {
          // eslint-disable-next-line no-undef
          text = text + param.marker + typeName[i] + ': ' + element + '<br/>';
        }
      }
      return text;
    }
  },
  // formatter: function(params) {
  //   var result = '时间：' + params[0].name + '<br/>';
  //   params.forEach(function(item) {
  //     if (item.seriesName == '日K') {
  //       result += item.marker + ' ' + item.seriesName + '</br>';

  //     } else {
  //       result +=
  //         item.marker +
  //         ' ' +
  //         item.seriesName +
  //         ' : ' +
  //         item.value.toString().substring(0, 7) +
  //         '</br>';
  //     }
  //   });
  //   return result;
  // },
  // formatter: function(params) {
  //   const param = params[0];
  //   const open = param.data[1];
  //   const close = param.data[2];
  //   const lowest = param.data[3];
  //   const highest = param.data[4];
  //   const volume = param.data[5];
  //   return (
  //     param.name +
  //     '<br/>' +
  //     'Volume:' +
  //     volume +
  //     '<br/>' +
  //     'Open: ' +
  //     open +
  //     '<br/>' +
  //     'Close: ' +
  //     close +
  //     '<br/>' +
  //     'Lowest: ' +
  //     lowest +
  //     '<br/>' +
  //     'Highest: ' +
  //     highest +
  //     '<br/>'
  //   );
  // },
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
  axisLine: {lineStyle: {color: '#777'}},
  min: 'dataMin',
  max: 'dataMax',
  axisPointer: {
    show: true,
  },
  axisLabel: {
    formatter: function(value) {
      // eslint-disable-next-line no-undef
      return echarts.format.formatTime('MM-dd', value);
    },
  },
};
const grid = {
  left: 20,
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
};
