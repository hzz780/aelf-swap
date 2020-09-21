import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  SectionList,
  RefreshControl,
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Touchable from '../Touchable';
import {Colors} from '../../../assets/theme';
import {pTd} from '../../../utils/common';
import {bottomBarHeigth} from '../../../utils/common/device';
import AntDesign from 'react-native-vector-icons/AntDesign';
const scrollToTopBottom = 40; //The distance between the icon and the bottom
const showScrollToTop = 300; //y-axis scroll distance
export default class SectionStickyList extends Component {
  //renderItem
  static propTypes = {
    renderHeader: PropTypes.element, //Head element above the ceiling
    stickyHead: PropTypes.func, //Ceiling element
    onLoading: PropTypes.func, //Pull up loading callback
    loadCompleted: PropTypes.bool, //Whether the data is all loaded
    upPullRefresh: PropTypes.func, //Pull-down refresh callback
    onScroll: PropTypes.func, //Scroll monitoring
    whetherAutomatic: PropTypes.bool, //Whether to automatically load more, if there is a ceiling, this property cannot be set to true
    scrollToTop: PropTypes.bool, //Enables the scroll to top Component
  };
  static defaultProps = {
    data: [],
    whetherAutomatic: false,
    scrollToTop: true,
  };
  constructor(props) {
    super(props);
    this.state = {
      bottomLoad: false,
      refreshing: false,
      showScrollTop: false,
    };
  }
  componentDidMount() {
    this.isScrollToTop = !!this._list?._wrapperListRef?._listRef
      ?.scrollToOffset;
  }
  componentWillUnmount() {
    this.endRefresh && clearTimeout(this.endRefresh);
  }
  scrollTo(params) {
    this.endCanLoadMore();
    if (!params) {
      return;
    }
    this._list?.scrollToLocation(params);
  }
  scrollToTop = _ => {
    if (this.isScrollToTop) {
      this._list._wrapperListRef._listRef.scrollToOffset({
        offset: 0,
      });
    } else {
      console.warn('This device does not currently support scrollToOffset');
    }
  };
  ListFooterComponent = _ => {
    const {bottomLoad} = this.state;
    const {loadCompleted, bottomLoadTip, listFooterHight} = this.props;
    let FirstComponent = null,
      SecondComponent = null;
    if (listFooterHight) {
      let height = listFooterHight;
      SecondComponent = <View style={{height: height}} />;
    }
    if (loadCompleted) {
      FirstComponent = <View />;
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
      <>
        {FirstComponent}
        {SecondComponent}
      </>
    );
  };

  onEndReached = touch => {
    const {loadCompleted, onEndReached} = this.props;
    if (touch === true || (this.canLoadMore && !loadCompleted)) {
      this.setState({bottomLoad: true}, () => {
        onEndReached?.();
        this.canLoadMore = false;
      });
    }
  };
  endCanLoadMore = _ => {
    this.canLoadMore = false;
  };
  onRefresh = _ => {
    this.setState({refreshing: true}, () => {
      this.props.upPullRefresh?.();
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
    this.props.onScroll?.(y);
    const {showScrollTop} = this.state;
    if (y > showScrollToTop) {
      !showScrollTop && this.setState({showScrollTop: true});
    } else {
      showScrollTop && this.setState({showScrollTop: false});
    }
  };
  sc;
  renderScrollToTopWrapper = () => {
    const {listFooterHight} = this.props;
    const {showScrollTop} = this.state;
    if (showScrollTop) {
      return (
        <Touchable
          onPress={this.scrollToTop}
          style={[
            styles.scrollToTopStyle,
            listFooterHight
              ? {bottom: scrollToTopBottom + listFooterHight}
              : null,
          ]}>
          <AntDesign name="arrowup" size={27} color={Colors.primaryColor} />
        </Touchable>
      );
    }
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
      scrollToTop,
    } = this.props;
    const {refreshing, bottomLoad} = this.state;
    return (
      <>
        {this.isScrollToTop && scrollToTop
          ? this.renderScrollToTopWrapper()
          : null}
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
      </>
    );
  }
}
const styles = StyleSheet.create({
  FooterStyles: {
    paddingVertical: pTd(20),
    marginBottom: bottomBarHeigth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollToTopStyle: {
    opacity: 0.8,
    position: 'absolute',
    right: 10,
    bottom: scrollToTopBottom,
    zIndex: 999,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.fontBlack,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.5,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
