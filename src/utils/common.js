//去抖函数，防止某些操作太频繁操作
export const throttle = (method, duration, delay) => {
	var timerID = null,
		begin = +new Date,
		isFirstCall = !0;

	return function() {
		var args = arguments,
			ctx = this,
			now = +new Date;
		if (isFirstCall) {
			method.apply(ctx, args);
			begin = now;
			isFirstCall = !1;
			return;
		}
		if (timerID) {
			clearTimeout(timerID);
		}
		if (now - begin > duration) {
			method.apply(ctx, args);
			begin = now;
		} else {
			timerID = setTimeout(function() {
				method.apply(ctx, args);
			}, delay);
		}
	};
};

//检测浏览器是否开启本地存储
export const storageSupportTest = () => {
	let isSupport = !0;
	const key = 'test';
	try {
		localStorage.setItem(key, 'hello');
		localStorage.removeItem(key);
	} catch (e) {
		isSupport = !1;
	}

	if (!isSupport) {
		alert('您的浏览器处于隐私模式，请关闭哦!否则将无法加购物车哦!')
	}
};

//判断是否微信环境
export const isWXBrowser = (() => {
	const ua = window.navigator.userAgent.toLowerCase();
	return /(micromessenger|webbrowser)/g.test(ua);
})();

const cookieDomain = 'domain=manjd.com;';

//获取cookie
export const getCookie = (key) => {
	if (!key) {
		return null;
	}
	const cookieResult = document.cookie.match(new RegExp('(?:^|\\s+|;+)' + key + '=([^;]*)'));
	return cookieResult ? cookieResult[1] : null;
};

//设置cookie
export const setCookie = (key, val, expires) => {
	let expiresTime = null;
	if(expires){
		expiresTime = new Date();
		expiresTime.setMilliseconds(expiresTime.getMilliseconds() + (expires * 864e+5));
		expiresTime = expiresTime.toUTCString();
	}
	document.cookie = [
		encodeURIComponent(key), '=', val,
		expiresTime ? '; expires=' + expiresTime : '',';',
		'path=/;',
		cookieDomain
	].join('');
};

//删除cookie
export const removeCookie = (key) => {
	if (!key) {
		return;
	}
	document.cookie = key + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; "+cookieDomain;
};

//获取查询字符串参数
export const getQueryParam = (dataStr)=>{
	return function(name){
		const res = dataStr.match(new RegExp(name+'=([^\&]*)'));
		return res ? res[1]:null;
	}
};

// 判断为Android还是IOS
export const getAppType = () => {
	const ua = window.navigator.userAgent.toLowerCase();
	return /(iPhone|iPad|iPod|iOS)/i.test(ua) ? 'ios' : 'android';
};

// 与app交互
export const InitBridge = function (callback) {
	try {
		if (getAppType() === 'ios') {
			// 建立IOS桥接
			var onBridgeReady = function (bridge) {
				if (callback) {
					callback(bridge);
				}
			}
			if (window.WebViewJavascriptBridge) {
				onBridgeReady(WebViewJavascriptBridge);
			} else {
				if (document.addEventListener) {
					document.addEventListener('WebViewJavascriptBridgeReady', function () {
						onBridgeReady(WebViewJavascriptBridge);
					}, false);
				} else {
					document.attachEvent('onWebViewJavascriptBridgeReady', function () {
						onBridgeReady(WebViewJavascriptBridge);
					});
				}
			}
		} else {
			// bridge = manjdSales;
			if (callback) {
				callback(manjdSales);
			}
		}
	} catch (e) { };
};

export const setupWebViewJavascriptBridge = function (callback) {
	let ua = window.navigator.userAgent.toLowerCase();
	let vs = ua.match(/iOS-\d*/);
	let vn = null
	if(vs){
		vn = vs.split('-')[1]
	}
	if (vn < 163) {
		InitBridge() 
	}
	if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'https://__bridge_loaded__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}
// 页面body增加returl方便app返回
export const addRetrunUrl = () => {
	let referrer = document.referrer;
	document.body.setAttribute('returl', referrer);
};
// 如果返回401则跳到app登录页
export const reLogin = () => {
	InitBridge(function (bridge) {
		if (getAppType() === 'ios') {
			bridge.callHandler('goToLogin', null, function (data) { });
		} else {
			bridge.goToLogin();
		}
	});
};

export const judgeSystem = () => {
	InitBridge(function (bridge) {
		if (getAppType() === 'ios') {
			bridge.callHandler('goToLogin', null, function (data) { });
		} else {
			bridge.goToLogin();
		}
	});
};