import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import WebView from 'react-native-webview';
import renderChart from './renderChart';
import charts from './charts.html';
import {isIos} from '../../../utils/common/device';
import BounceSpinner from '../BounceSpinner';
const defaultHeight = 350;
const source = isIos ? charts : {uri: 'file:///android_asset/HTML/charts.html'};
export default class Echarts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
    };
    this.setNewOption = this.setNewOption.bind(this);
  }
  static defaultProps = {
    height: defaultHeight,
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.option !== this.props.option) {
      this.chart && this.chart.reload();
    }
  }

  setNewOption(option) {
    this.chart && this.chart.postMessage(JSON.stringify(option));
  }
  onLoadEnd = _ => {
    this.setState({load: false});
  };
  render() {
    const {style, onMessage, height} = this.props;
    const {load} = this.state;
    return (
      <View style={[styles.container, style, height && {height}]}>
        {load && (
          <View style={[styles.loadView, style, height && {height}]}>
            <BounceSpinner type="Wave" />
          </View>
        )}
        <WebView
          ref={v => (this.chart = v)}
          injectedJavaScript={renderChart(this.props)}
          scalesPageToFit={!isIos}
          originWhitelist={['*']}
          source={source}
          onMessage={event => {
            onMessage ? onMessage(JSON.parse(event.nativeEvent.data)) : null;
          }}
          onLoadEnd={this.onLoadEnd}
          nativeConfig={{
            props: {
              backgroundColor: '#ffffff',
              flex: 1,
            },
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    height: defaultHeight,
  },
  loadView: {
    width: '100%',
    zIndex: 100,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    height: defaultHeight,
  },
});
