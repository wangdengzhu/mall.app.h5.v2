import { fetch,post } from '@/utils/fetch';

const activePrefix = '/goods/v1/app/activities/';

const sourceURLs = {
	LIST: activePrefix + 'goods',
	TABS: activePrefix + 'tabs',
	TITLE: '/goods/m/activities/h5page',
	ALLGOODS: '/goods/v1/app/tabs/goods'
};

const getGoodsList = (data) => fetch(sourceURLs.LIST,data);

const getTabs = (data) => fetch(sourceURLs.TABS, data);

const getTitle = (data) => fetch(sourceURLs.TITLE, data);

const getAllGoods = (tabid = 1, pageindex = 1, pagesize = 10) => fetch(sourceURLs.ALLGOODS, {
	tabid,
	pageindex,
	pagesize
});

export default {
	getGoodsList,
	getTabs,
	getTitle,
	getAllGoods
};