import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  SectionList,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import Touchable from '../Touchable';
import {Colors} from '../../../assets/theme';
export default class SectionStickyList extends Component {
  //renderItem
  static propTypes = {
    onRefresh: PropTypes.func, //callback for pull-down refresh
    renderHeader: PropTypes.element, //Head element above the ceiling
    stickyHead: PropTypes.func, //Ceiling element
    data: PropTypes.array, //Data source array
    onLoading: PropTypes.func, //Pull up loading callback
    loadCompleted: PropTypes.bool, //Whether the data is all loaded
    upPullRefresh: PropTypes.func, //Pull-down refresh callback
    onScroll: PropTypes.func, //Scroll monitoring
    whetherAutomatic: PropTypes.bool, //Whether to automatically load more, if there is a ceiling, this property cannot be set to true
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
  scrollTo(OffsetY) {
    if (!OffsetY) {
      return;
    }
    this._list &&
      this._list.scrollToLocation({
        sectionIndex: 0,
        itemIndex: -1,
      });
  }
  ListFooterComponent = _ => {
    const {bottomLoad} = this.state;
    const {
      loadCompleted,
      allLoadedTips,
      bottomLoadTip,
      listFooterHight,
    } = this.props;
    let FirstComponent = null,
      SecondComponent = null;
    if (listFooterHight) {
      let height = listFooterHight;
      // switch (data.length) {
      //   case 1:
      //     height = (height * 4) / 5;
      //     break;
      //   case 2:
      //     height = (height * 3) / 5;
      //     break;
      //   case 3:
      //     height = (height * 2) / 5;
      //     break;
      //   case 4:
      //     height = (height * 1) / 5;
      //     break;
      //   default:
      //     break;
      // }
      SecondComponent = <View style={{height: height}} />;
    }
    if (loadCompleted) {
      FirstComponent = (
        <View style={styles.FooterStyles}>
          <Text>{allLoadedTips || 'All loaded'}</Text>
        </View>
      );
    } else {
      FirstComponent = (
        <Touchable
          onPress={() => this.onEndReached(true)}
          style={styles.FooterStyles}>
          {bottomLoad ? (
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          ) : (
            <Text>{bottomLoadTip || 'Click to load more'}</Text>
          )}
        </Touchable>
      );
    }
    return (
      <View>
        {FirstComponent}
        {SecondComponent}
      </View>
    );
  };

  onEndReached = touch => {
    const {loadCompleted, onEndReached} = this.props;
    if (touch === true || (this.canLoadMore && !loadCompleted)) {
      this.setState({bottomLoad: true}, () => {
        onEndReached && onEndReached();
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
  //End the bottom refresh state
  endBottomRefresh = _ => {
    this.setState({bottomLoad: false});
  };
  onMomentumScrollBegin = _ => {
    this.canLoadMore = true;
  };
  onScroll = ({
    nativeEvent: {
      contentOffset: {y},
    },
  }) => {
    this.props.onScroll && this.props.onScroll(y);
  };
  render() {
    const {
      data,
      loadCompleted,
      stickyHead,
      renderHeader,
      upPullRefresh,
      whetherAutomatic,
      showFooter,
    } = this.props;
    const {refreshing, bottomLoad} = this.state;
    return (
      <SectionList
        {...this.props}
        windowSize={50}
        maxToRenderPerBatch={5}
        // removeClippedSubviews={false}
        // legacyImplementation={true}
        onScroll={this.onScroll}
        ref={ref => (this._list = ref)}
        renderSectionHeader={stickyHead}
        ListHeaderComponent={renderHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => item + index}
        extraData={bottomLoad && loadCompleted}
        ListFooterComponent={!showFooter ? null : this.ListFooterComponent}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onEndReached={whetherAutomatic ? this.onEndReached : null}
        sections={Array.isArray(data) ? [{data: data}] : [{data: []}]}
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
    );
  }
}
const styles = StyleSheet.create({
  FooterStyles: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
