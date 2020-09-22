import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import config from './config';
import charts from './charts.html';
import {isIos} from '../../../utils/common/device';
import BounceSpinner from '../BounceSpinner';
import i18n from 'i18n-js';
const {renderChart, defaultHeight, setOpctios} = config;
const source = isIos ? charts : {uri: 'file:///android_asset/HTML/charts.html'};
export default class Echarts extends Component {
  constructor(props) {
    super(props);
    this.lodEnd = false;
  }
  static defaultProps = {
    height: defaultHeight,
  };
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.option !== this.props.option && this.lodEnd) {
      let fun = setOpctios;
      if (!isIos) {
        fun = renderChart;
      }
      this.chart &&
        this.chart.injectJavaScript(
          fun({
            ...nextProps,
            typeName: [
              1,
              i18n.t('swap.open'),
              i18n.t('swap.close'),
              i18n.t('swap.lowest'),
              i18n.t('swap.highest'),
            ],
          }),
        );
    }
  }

  setNewOption = option => {
    this.chart && this.chart.injectJavaScript(JSON.stringify(option));
  };
  renderLoading = () => {
    const {style, height} = this.props;
    return (
      <View style={[styles.loadView, style, height && {height}]}>
        <BounceSpinner type="Wave" />
      </View>
    );
  };
  onMessage = event => {
    this.props.onMessage
      ? this.props.onMessage(JSON.parse(event.nativeEvent.data))
      : null;
  };
  render() {
    const {style, height} = this.props;
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
          onLoad={() => (this.lodEnd = true)}
          injectedJavaScript={renderChart({
            ...this.props,
            typeName: [
              1,
              i18n.t('swap.open'),
              i18n.t('swap.close'),
              i18n.t('swap.lowest'),
              i18n.t('swap.highest'),
            ],
          })}
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
