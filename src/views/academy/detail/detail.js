import Vue from 'vue'
import App from './detail.vue'
import FastClick from 'fastclick';

import '@/utils/androidHeaders';
import 'es6-promise/auto';
import '@/utils/rem';


document.addEventListener('DOMContentLoaded', () => {
	FastClick.attach(document.body);
}, !1);

new Vue({
  el: '#app',
  render: h => h(App)
})
