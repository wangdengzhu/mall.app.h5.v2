import LoginVue from '@/components/Login';
import store from '@/store';
import router from '@/router';
import { isWXBrowser } from '@/utils/common';

const install = (Vue) => {
	if (install.installed) {
		return;
	}
	install.installed = true;

	const vp = Vue.prototype;

	vp.loginCfg = {
		cb:()=>{
			router.go(0);
		}
	};

	vp.navToHasAuthPage = (routeObj)=>{
		if (!store.state.isLogin) {
			vp.loginCfg.cb = () => {
				vp.loginCfg.cb = null;
				router.push(routeObj);
			};
			store.commit('SHOW_LOGIN',!0);
		} else {
			router.push(routeObj);
		}
	};

	Vue.component('LoginBox', LoginVue);
	
};
export default {
	install
};