import React from 'react';
import TradingView from '../index';
import {KLineHtmlEvents, sendMessageToHtml, KLineNativeEvents} from '../config';
import _data from './index.json';
import {
  INTERVAL,
  librarySymbolInfo,
  datafeedConfig,
  chartingLibraryWidgetOptions,
} from './config';
class TradingViewDemo extends React.Component {
  state = {
    interval: 15,
  };
  onLoadEnd() {
    if (this.chart) {
      const {interval} = this.state;
      const msg = sendMessageToHtml(KLineNativeEvents.INIT, {
        locale: 'en',
        debug: true,
        symbol: 'ELF',
        interval: INTERVAL[interval],
        pricescale: 100,
        librarySymbolInfo: librarySymbolInfo,
        datafeedConfiguration: datafeedConfig,
        chartingLibraryWidgetOptions: chartingLibraryWidgetOptions,
      });
      this.chart.injectJavaScript(msg);
    }
  }

  onWebViewMessage = msg => {
    try {
      if (msg && msg.event) {
        this.onChartMessage(msg.event, msg.data || {});
      }
    } catch (err) {
      console.log(err);
    }
  };
  onChartMessage = async (event, params) => {
    if (!this.chart) {
      return;
    }
    const {interval} = this.state;
    switch (event) {
      case KLineHtmlEvents.INIT_DONE:
        console.log(' >> onChartMessage:', '初始化完成');
        break;
      case KLineHtmlEvents.FETCH_HISTORY:
        console.log(' >> onChartMessage:', '获取历史数据');
        this.chart.injectJavaScript(
          sendMessageToHtml(KLineNativeEvents.HISTORY, {
            kline: _data,
          }),
        );
        break;
      case KLineHtmlEvents.HISTORY_DONE:
        console.log(' >> onChartMessage:', '历史数据处理完成');
        break;
      case KLineHtmlEvents.INTERVAL_SWITCH:
        console.log(' >> onChartMessage:', '周期切换');
        break;
      case KLineHtmlEvents.INTERVAL_DONE:
        console.log(' >> onChartMessage:', '周期处理完成');
        break;
      case KLineHtmlEvents.CREATE_SHOT_DONE:
        console.log(' >> onChartMessage:', '创建截图完成');
        break;
      case KLineHtmlEvents.TYPE_DONE:
        console.log(' >> onChartMessage:', '类型处理完成');
        break;
    }
  };
  render() {
    return (
      <TradingView
        height={300}
        ref={ref => (this.chart = ref)}
        onMessage={this.onWebViewMessage}
        onLoadEnd={this.onLoadEnd.bind(this)}
      />
    );
  }
}

export default TradingViewDemo;
