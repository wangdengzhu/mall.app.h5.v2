import {
	fetch,
	post
} from '@/utils/fetch';


const payPrefix = '/pay/m/';

const sourceURLs = {
	PRE: payPrefix + 'pre',
	CHECK: payPrefix + 'check/',
	QUERY: payPrefix + 'query/',
	WAYS: payPrefix + 'payway',
};

const pre = (data) => {
	if (typeof data !== 'object') {
		return;
	}
	return post(sourceURLs.PRE, data);
};

const check = (orderNo) => {
	if (!orderNo) {
		return;
	}
	return fetch(sourceURLs.CHECK + orderNo);
};

const query = (payChannel, payId, orderNo) => {
	const url = sourceURLs.QUERY + payChannel + '/' + payId + '/' + orderNo;
	return fetch(url);
};


const ways = () => fetch(sourceURLs.WAYS);

export default {
	pre,
	check,
	query,
	ways
};