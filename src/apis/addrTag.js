import { fetch,post } from '@/utils/fetch';

const tagPrefix = '/addresstag/m/';

const sourceURLs = {
	LIST: tagPrefix + 'getlist',
	ADD: tagPrefix + 'add',
	DEL: tagPrefix + 'delete'
};

const getList = () => fetch(sourceURLs.LIST);

const add = (tagname) => post(sourceURLs.ADD, {
	tagname
});

const del = (tagid) => post(sourceURLs.DEL, {
	tagid
});

export default {
	getList,
	add,
	del
};