import React, {Component} from 'react';
import {BackHandler} from 'react-native';
import i18n from 'i18n-js';
import {isIos} from './device';
import {EXIT_TIME} from '../../config/constant';
import {CommonToast} from '../../components/template';
class BackHandlerComponent extends Component {
  componentDidMount() {
    !isIos && BackHandler.addEventListener('hardwareBackPress', this.exitAPP);
  }
  componentWillUnmount() {
    !isIos &&
      BackHandler.removeEventListener('hardwareBackPress', this.exitAPP);
  }
  exitAPP = () => {
    if (this.props.navigation.isFocused()) {
      if (
        this.lastBackPressed &&
        this.lastBackPressed + EXIT_TIME >= Date.now()
      ) {
        BackHandler.exitApp();
      } else {
        this.lastBackPressed = Date.now();
        CommonToast.text(i18n.t('exitTip'));
        return true;
      }
    }
  };
  render() {
    const {children} = this.props;
    return children;
  }
}
const BackHandlerHoc = WrappedComponent =>
  class extends Component {
    componentDidMount() {
      !isIos && BackHandler.addEventListener('hardwareBackPress', this.exitAPP);
    }
    componentWillUnmount() {
      !isIos &&
        BackHandler.removeEventListener('hardwareBackPress', this.exitAPP);
    }
    exitAPP = () => {
      if (this.props.navigation.isFocused()) {
        if (
          this.lastBackPressed &&
          this.lastBackPressed + EXIT_TIME >= Date.now()
        ) {
          BackHandler.exitApp();
        } else {
          this.lastBackPressed = Date.now();
          CommonToast.text(i18n.t('exitTip'));
          return true;
        }
      }
    };
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export {BackHandlerHoc, BackHandlerComponent};
