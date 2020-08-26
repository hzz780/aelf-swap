const {Colors} = require('../../../assets/theme');
const top = 10;
const heigth = 180;
const chartsHeigth = top + heigth + 30 + 50;
const candlestickItemStyle = {
  color: '#ef232a',
  color0: '#14b143',
  borderColor: '#ef232a',
  borderColor0: '#14b143',
};
const volumeItemStyle = {color: '#7fbe9e'};
const defaultOption = {
  color: [
    '#c23531',
    '#2f4554',
    '#61a0a8',
    '#d48265',
    '#91c7ae',
    '#749f83',
    '#ca8622',
    '#bda29a',
    '#6e7074',
    '#546570',
    '#c4ccd3',
  ],
  animation: true,
  // legend: {
  //   data: ['蒸发量', '降水量'],
  // },
  tooltip: {
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
      const open = params[0];
      const close = params[1];
      const lowest = params[2];
      const highest = params[3];

      return open + '  ' + close + lowest + highest;
    },
    position: function(pos, params, el, elRect, size) {
      let obj = {
        top: 10,
      };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    },
  },
  axisPointer: {
    link: [
      {
        xAxisIndex: [0, 1],
      },
    ],
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 40,
      end: 70,
      top: top,
      height: 20,
    },
  ],
  yAxis: [
    {
      scale: true,
      splitNumber: 2,
      axisLine: {lineStyle: {color: '#777'}},
      splitLine: {show: true},
      axisTick: {show: false},
      axisLabel: {
        inside: true,
        formatter: '{value}\n',
      },
    },
    {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: {show: false},
      axisLine: {show: false},
      axisTick: {show: false},
      splitLine: {show: false},
    },
  ],
  grid: [
    {
      left: 20,
      right: 20,
      top: top,
      height: heigth,
    },
    {
      left: 20,
      right: 20,
      height: 40,
      top: top + heigth + 30,
    },
  ],
  graphic: [
    {
      type: 'group',
      left: 'center',
      top: 70,
      width: 300,
      bounding: 'raw',
    },
  ],
};

const xAxis = [
  {
    type: 'category',
    boundaryGap: false,
    axisLine: {lineStyle: {color: '#777'}},
    axisLabel: {
      formatter: function(value) {
        // eslint-disable-next-line no-undef
        return echarts.format.formatTime('MM-dd', value);
      },
    },
    min: 'dataMin',
    max: 'dataMax',
    axisPointer: {
      show: true,
    },
  },
  {
    type: 'category',
    gridIndex: 1,
    scale: true,
    boundaryGap: false,
    splitLine: {show: false},
    axisLabel: {show: false},
    axisTick: {show: false},
    axisLine: {lineStyle: {color: '#777'}},
    splitNumber: 20,
    min: 'dataMin',
    max: 'dataMax',
  },
];

export default {
  defaultOption,
  xAxis,
  chartsHeigth,
  volumeItemStyle,
  candlestickItemStyle,
};
