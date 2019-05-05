import { isWXBrowser } from '@/utils/common';
const isSafari = /iPhone/i.test(window.navigator.userAgent.toLowerCase());
const isIOSWX = isWXBrowser && isSafari;
const pathPrefix = '/buyer';
export default {
	beforeRouteEnter(to, from, next) {
		// XXX: 修复iOS版微信HTML5 History兼容性问题
		const toPath = pathPrefix + to.path;
		if (isIOSWX && toPath != location.pathname) {
			// 此处不可使用location.replace
			location.assign(pathPrefix + to.fullPath)
		} else {
			next()
		}
	}
}