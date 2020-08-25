'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  FlatList,
  RefreshControl,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Colors} from '../../../assets/theme';
import {sreenHeight, bottomBarHeigth} from '../../../utils/common/device';
export default class ListComponent extends Component {
  //renderItem
  static propTypes = {
    whetherAutomatic: PropTypes.bool, //Whether to automatically load more, if there is a ceiling, you can not set this property to true
    upPullRefresh: PropTypes.func, //Pull-down refresh callback
    onEndReached: PropTypes.func, //Pull-refresh callback,
    loadCompleted: PropTypes.bool, //Whether all data has been loaded and the tail component is hidden
    noPositionTips: PropTypes.string,
    showFooter: PropTypes.bool,
    allLoadedTips: PropTypes.string,
  };
  static defaultProps = {
    data: [],
    whetherAutomatic: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      bottomLoad: false,
      refreshing: false,
    };
  }
  componentWillUnmount() {
    this.endRefresh && clearTimeout(this.endRefresh);
  }
  onEndReached = touch => {
    if (touch || (this.canLoadMore && !this.props.loadCompleted)) {
      this.setState({bottomLoad: true}, () => {
        this.props.onEndReached && this.props.onEndReached();
        this.canLoadMore = false;
      });
    }
  };
  onRefresh = _ => {
    this.setState({refreshing: true}, () => {
      this.props.upPullRefresh && this.props.upPullRefresh();
    });
  };
  //End pull-down refresh
  endUpPullRefresh = _ => {
    this.endRefresh && clearTimeout(this.endRefresh);
    this.endRefresh = setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  };
  ListFooterComponent = _ => {
    const {bottomLoad} = this.state;
    const {loadCompleted, allLoadedTips, bottomLoadTip} = this.props;
    if (loadCompleted) {
      return (
        <View style={styles.FooterStyles}>
          <Text>{allLoadedTips || 'All loaded'}</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => this.onEndReached(true)}
        style={styles.FooterStyles}>
        {bottomLoad ? (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        ) : (
          <Text>{bottomLoadTip || 'Click to load more'}</Text>
        )}
      </TouchableOpacity>
    );
  };
  listProps = {
    //Improve performance
    windowSize: 50,
    maxToRenderPerBatch: 5,
    // removeClippedSubviews: false,
    // legacyImplementation: true
  };
  //End the bottom refresh state
  endBottomRefresh = _ => {
    this.setState({bottomLoad: false});
  };
  onMomentumScrollBegin = _ => {
    this.canLoadMore = true;
  };
  render() {
    const {
      data,
      upPullRefresh,
      whetherAutomatic,
      loadCompleted,
      showFooter,
      message,
    } = this.props;
    const {refreshing} = this.state;
    return data && data.length ? (
      <FlatList
        {...this.listProps}
        {...this.props}
        extraData={this.state.bottomLoad && loadCompleted}
        keyExtractor={(item, index) => index.toString()} //Unique key
        ref={flatList => (this._flatList = flatList)}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        ListFooterComponent={!showFooter ? null : this.ListFooterComponent}
        onEndReached={whetherAutomatic ? this.onEndReached : null}
        refreshControl={
          upPullRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              colors={[Colors.primaryColor]}
              tintColor={Colors.primaryColor}
              onRefresh={this.onRefresh}
            />
          ) : null
        }
      />
    ) : (
      <ScrollView
        refreshControl={
          upPullRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              colors={[Colors.primaryColor]}
              tintColor={Colors.primaryColor}
              onRefresh={this.onRefresh}
            />
          ) : (
            refreshing
          )
        }>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>{message || 'Empty~'}</Text>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: sreenHeight * 0.9,
    backgroundColor: Colors.flatListBg,
  },
  FooterStyles: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: bottomBarHeigth,
  },
  emptyBox: {
    marginTop: 200,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.primaryColor,
    fontSize: 30,
  },
});
