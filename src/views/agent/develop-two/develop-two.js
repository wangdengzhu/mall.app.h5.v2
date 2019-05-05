import Vue from 'vue'
import App from './develop-two.vue'
import FastClick from 'fastclick';

import '@/utils/androidHeaders';
import 'es6-promise/auto';
import '@/utils/rem';
import '@/utils/vueLazyloadInit';

document.addEventListener('DOMContentLoaded', () => {
	FastClick.attach(document.body);
}, !1);

new Vue({
  el: '#app',
  render: h => h(App)
})
