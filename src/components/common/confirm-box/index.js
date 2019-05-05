import Vue from 'vue';
import CnfrmBoxVue from './confirm-box.vue';

const CnfrmBoxConstructor = Vue.extend(CnfrmBoxVue);

const getInstance = (() => {
	let instance = null;
	return () => {
		if (!instance) {
			instance = new CnfrmBoxConstructor({
				el: document.createElement('div')
			});
		}
		return instance;
	};
})();

const defaultSettings = {
	showCancelBtn:!0,
	type:2,
	message:'',
	title:'',
	cancelBtnTxt:'取消',
	cnfrmBtnTxt:'确定'
};

let curResolve = null,
	curReject = null;

const actionHander = (action) => {
	if(action == 'confirm'){
		curResolve && curResolve(action);
	}else if(action == 'cancel'){
		curReject && curReject(action);
	}
};

const show = (instance) => {
	return new Promise((resolve, reject) => {
		document.body.appendChild(instance.$el);
		Vue.nextTick(() => {
			instance.visible = !0;
			instance.actionHander = actionHander;
			curResolve = resolve;
			curReject = reject;
		});
	});
};

const confirmBox = (options)=>{
	const instance = getInstance();
	Object.keys(options).forEach((idx)=>{
		instance[idx] = options[idx];
	});
	return show(instance);
};

const alert = (options) => {
	let obj = {};
	if (typeof options === 'string') {
		obj.message = options;
	} else {
		obj = options;
	}

	return confirmBox(Object.assign({},defaultSettings, obj, {
		type: 1,
		showCancelBtn:!1
	}));
};

const open = (options) => {
	let obj = {};
	if (typeof options === 'string') {
		obj.message = options;
	} else {
		obj = options;
	}
	return confirmBox(Object.assign({},defaultSettings, obj, {
		type: 2,
		showCancelBtn:!0
	}));
};

const close = ()=>{
	const instance = getInstance();
	if(instance){
		instance.visible = !1;
		curResolve = null;
		curReject = null;
		instance.actionHander = null;
	}
};

export default {
	alert,
	open
};