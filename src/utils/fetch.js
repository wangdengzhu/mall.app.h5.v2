/**
 * 基于axios封装网络请求接口,支持GET,POST请求
 */
import Vue from 'vue';
import axios from 'axios';
import { reLogin } from '@/utils/common';
import {InitBridge, setupWebViewJavascriptBridge} from '@/utils/common';

const isDev = process.env.NODE_ENV == 'development';

//API基础URL
axios.defaults.baseURL = API_BASE_URL;
//请求超时时间
axios.defaults.timeout = 15000;

//设置HTTP请求的拦截器
axios.interceptors.request.use((config) => {
	let isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
	config.headers.source = 'h5';
	let headers = ''
	if(!isAndroid){
		headers = window.iOSHeaderInfo;
	}else if(isAndroid){
		headers = window.androidHeaders
	}
	
	if(headers != ''){
		for(let header in headers){
			config.headers[header] = headers[header];
		}

	}
		
	return config;
}, (error) => {
	return Promise.reject(error);
});

//设置HTTP响应的拦截器
axios.interceptors.response.use((response) => {
	const code = response.data.code;
	if (code == 401) {
		reLogin();
	}
	return response;
}, (error) => {
	return Promise.reject(error);
});

//GET请求使用方法
export function fetch(url, params = {}) {
	return new Promise((resolve, reject) => {
		axios.get(url, {params})
			.then((res) => {
				resolve(res.data)
			})
			.catch((err) => {
				reject(err);
			});
	});
}

//POST请求使用方法
export function post(url, data = {}) {
	return new Promise((resolve, reject) => {
		axios.post(url, data)
			.then((res) => {
				resolve(res.data)
			})
			.catch((err) => {
				reject(err);
			});
	});
}