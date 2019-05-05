import Vue from 'vue'
import App from './evaluate-success.vue'
import FastClick from 'fastclick';

import 'es6-promise/auto';
import '@/utils/rem';
import '@/utils/androidHeaders';
import '@/utils/vueLazyloadInit';

document.addEventListener('DOMContentLoaded', () => {
	FastClick.attach(document.body);
}, !1);

new Vue({
  el: '#app',
  render: h => h(App)
})
