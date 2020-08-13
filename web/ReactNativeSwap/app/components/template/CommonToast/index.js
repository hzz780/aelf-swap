'use strict';
import Toast from 'teaset/components/Toast/Toast';

export default {
  element: null,
  text(text) {
    Toast.hide(this.element);
    this.element = Toast.show({text});
  },
  message(...args) {
    Toast.hide(this.element);
    this.element = Toast.message(...args);
  },
  success(...args) {
    Toast.hide(this.element);
    this.element = Toast.success(...args);
  },
  fail(...args) {
    Toast.hide(this.element);
    this.element = Toast.fail(...args);
  },
  smile(...args) {
    Toast.hide(this.element);
    this.element = Toast.smile(...args);
  },
  sad(...args) {
    Toast.hide(this.element);
    this.element = Toast.sad(...args);
  },
  info(...args) {
    Toast.hide(this.element);
    this.element = Toast.info(...args);
  },
  stop(...args) {
    Toast.hide(this.element);
    this.element = Toast.stop(...args);
  },
};
