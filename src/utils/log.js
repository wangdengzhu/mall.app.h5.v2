import { Log } from '@/apis';

const formatParams = (params = {}) => {
	const paramsArr = [];
	const paramKeys = Object.keys(params);
	if (paramKeys.length > 0) {
		paramKeys.forEach((key) => {
			paramsArr.push(`${key}=${params[key]}`);
		});
	}
	return paramsArr.join('&');
};

const getBasicParams = () => {
	const params = {};

	params.domain = document.domain || '';
	params.url = document.URL || '';
	params.title = document.title || '';
	params.referrer = document.referrer || '';

	params.sh = window.screen.height || 0;
	params.sw = window.screen.width || 0;

	return formatParams(params);
};


export const captureException = (level = 1, message = '') => {
	let msg = message;
	let lv = level;

	if (typeof level === 'string') {
		lv = 1;
		msg = level;
	}
	if (!msg) {
		return;
	}
	msg = encodeURIComponent(`${getBasicParams()}&message=${msg}`);
	Log.report(lv, msg);
};