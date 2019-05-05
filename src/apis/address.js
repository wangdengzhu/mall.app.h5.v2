import { fetch,post } from '@/utils/fetch';

const goodsPrefix = '/address/m/';

const sourceURLs = {
	LIST: goodsPrefix + 'getlist',
	ADD:goodsPrefix + 'add',
	EDIT:goodsPrefix + 'edit',
	DEL:goodsPrefix + 'delete',
	GETADDR:goodsPrefix+'getaddressbyid',
	DEFAULT:goodsPrefix + 'setdefault',
	GETAREALIST:goodsPrefix+'getarealist'
};

const getList = () => fetch(sourceURLs.LIST);

const getAreaList = (districtId) => fetch(sourceURLs.GETAREALIST, {
	area_id: districtId
});

const add = (data) => post(sourceURLs.ADD, data);

const edit = (data) => post(sourceURLs.EDIT, data);

const setDefault = (id) => post(sourceURLs.DEFAULT, {addressid:id});

const del = (id) => post(sourceURLs.DEL, {addressid:id});

const getAddrById = (id) => fetch(sourceURLs.GETADDR,{address_id:id});

export default {
	getList,
	getAreaList,
	add,
	del,
	edit,
	setDefault,
	getAddrById
};