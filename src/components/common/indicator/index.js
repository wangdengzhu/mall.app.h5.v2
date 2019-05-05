import Vue from 'vue';
import IndicatorVue from './indicator.vue';

const IndicatorConstrcutor = Vue.extend(IndicatorVue);

let instance = null;

const getInstance = () => {
	if (!instance) {
		instance = new IndicatorConstrcutor({
			el: document.createElement('div')
		});
	}
	return instance;
};


const show = (options) => {
	const instance = getInstance();
	if (instance.visible) {
		return;
	}
	instance.title = typeof options === 'string' ? options : options.title || '';
	document.body.appendChild(instance.$el);
	Vue.nextTick(() => {
		instance.visible = !0;
	});
};

const close = () => {
	instance && (instance.visible = !1);
};

export default {
	show,
	close
};