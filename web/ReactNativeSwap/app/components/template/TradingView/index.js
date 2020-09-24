import React, {Component} from 'react';
import tradingCharts from './dist/tradingCharts.html';
import {isIos} from '../../../utils/common/device';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import BounceSpinner from '../BounceSpinner';
const source = isIos
  ? tradingCharts
  : {uri: 'file:///android_asset/HTML/charts.html'};

export default class TradingView extends Component {
  onMessage = event => {
    try {
      this.props.onMessage?.(JSON.parse(event.nativeEvent.data));
    } catch (error) {
      console.log(error, 'onMessage-parse');
    }
  };
  renderLoading = () => {
    const {style, height} = this.props;
    return (
      <View style={[styles.loadView, style, height && {height}]}>
        <BounceSpinner type="Wave" />
      </View>
    );
  };
  injectJavaScript = script => {
    this.chart?.injectJavaScript(script);
  };
  render() {
    const {style, height, onLoad} = this.props;
    return (
      <View style={[styles.container, style, height && {height}]}>
        <WebView
          {...this.props}
          source={source}
          originWhitelist={['*']}
          scalesPageToFit={!isIos}
          onMessage={this.onMessage}
          startInLoadingState={true}
          ref={v => (this.chart = v)}
          renderLoading={this.renderLoading}
          onLoad={() => {
            this.lodEnd = true;
            onLoad?.();
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  loadView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
