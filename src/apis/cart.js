import { fetch,post } from '@/utils/fetch';

const cartPrefix = '/cart/m/';

const sourceURLs = {
	ADD: cartPrefix + 'add',
	BUY: cartPrefix + 'buy',
	UPDATE_CHECKED: cartPrefix + 'update/checked',
	UPDATE_BUYNUM: cartPrefix + 'update/num',
	DEL: cartPrefix + 'del',
	CREATE: cartPrefix + 'create',
	LIST: cartPrefix + 'info',
	MODIFY: cartPrefix + 'change'
};

const add = (data) => {
	if(typeof data !== 'object'){
		return;
	}
	return post(sourceURLs.ADD,data);
};

const buy = (data) => {
	if(typeof data !== 'object'){
		return;
	}
	return post(sourceURLs.BUY,data);
};

const getList = (data,isselect=!1) => {
	if(typeof data !== 'object'){
		return;
	}
	let url = '';
	if(isselect){
		url = sourceURLs.LIST + '/true';
	}else{
		url = sourceURLs.LIST;
	}
	return post(url,data);
};

const updateChecked = (data) => {
	if (typeof data !== 'object') {
		return;
	}
	return post(sourceURLs.UPDATE_CHECKED, data);
};

const updateNum = (data) => {
	if (typeof data !== 'object') {
		return;
	}
	return post(sourceURLs.UPDATE_BUYNUM, data);
};

const del = (data) => {
	if (typeof data !== 'object') {
		return;
	}
	return post(sourceURLs.DEL, data);
};

const modify = (data) => post(sourceURLs.MODIFY, data);

const createOrder = (addrId, invinfo, goods) => {
	const resourceURL = sourceURLs.CREATE + `/${addrId}?invinfo=${invinfo}`;
	return post(resourceURL, goods);

};

export default {
	add,
	buy,
	getList,
	updateChecked,
	updateNum,
	del,
	createOrder,
	modify
};