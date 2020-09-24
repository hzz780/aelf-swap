export const INTERVAL = {
  0: '1',
  1: '1',
  5: '5',
  15: '15',
  240: '240',
  1440: '1440',
  10080: '10080',
};

export const INTERVAL_SERVER = {
  0: 'MIN_1',
  1: 'MIN_1',
  5: 'MIN_5',
  15: 'MIN_15',
  240: 'HOUR_4',
  1440: 'DAY_1',
  10080: 'WEEK_1',
};

export const INTERVAL_NAME = {
  0: '分时',
  1: '1分',
  5: '5分',
  15: '15分',
  240: '4小时',
  1440: '1日',
  10080: '1周',
};

// export type IntervalT = keyof typeof INTERVAL;

// export const KLineIntervalResult = function (
//   key: IntervalT,
//   lastId?: number,
//   size: number = 300,
// ) {
//   const n = key ? key : 1;
//   const now = parseInt((Date.now() / 1000).toFixed());
//   const to = lastId ? lastId : now;
//   return {
//     to: to,
//     from: to - 1 * n * 60 * size,
//   };
// };

const resolutions = Object.keys(INTERVAL).filter(val => val !== '0');

export const librarySymbolInfo = {
  has_daily: true,
  has_intraday: true,
  has_empty_bars: true,
  has_no_volume: false,
  has_weekly_and_monthly: true,
  supported_resolutions: resolutions,
  intraday_multipliers: resolutions,
};

export const datafeedConfig = {
  supported_resolutions: resolutions,
};

export const chartingLibraryWidgetOptions = {
  overrides: {
    'paneProperties.background': '#ffffff',
    'scalesProperties.backgroundColor': '#202022',
    'scalesProperties.textColor': '#66688F',
    'scalesProperties.lineColor': '#223557',
    'paneProperties.vertGridProperties.color': '#202022',
    'paneProperties.horzGridProperties.color': '#202022',

    'mainSeriesProperties.candleStyle.upColor': '#3FE77B',
    'mainSeriesProperties.candleStyle.borderUpColor': '#3FE77B',
    'mainSeriesProperties.candleStyle.wickUpColor': '#3FE77B',

    'mainSeriesProperties.candleStyle.downColor': '#FF4465',
    'mainSeriesProperties.candleStyle.borderDownColor': '#FF4465',
    'mainSeriesProperties.candleStyle.wickDownColor': '#FF4465',

    'paneProperties.crossHairProperties.color': '#fff', // 图标区域 鼠标十字线颜色
    'volume.color.0': 'rgba(255,68,101,0.6)',
    'volume.color.1': 'rgba(63,231,123,0.6)',
    volumePaneSize: 'small',
  },
  studies_overrides: {
    'volume.volume.color.0': '#cb4848',
    'volume.volume.color.1': '#01bd8b',
    'volume.volume.transparency': 0.01,
    'MACD.MACD.linewidth': 4, // macd线线宽
    'MACD.MACD.color': '#1c65a6', // macd线颜色
    'MACD.Signal.color': '#cc4a4a', // macd信号线线颜色
    'MACD.Signal.linewidth': 4, // macd信号线宽
    'MACD.Histogram.linewidth': 4, // macd柱状图宽
  },
  enabled_features: [],
  disabled_features: [],
};
