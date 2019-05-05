import { fetch,post } from '@/utils/fetch';

const goodsPrefix = '/goods/m/';
const detailPrefix = '/goodsdetail/m/';

const sourceURLs = {
	GOODS_CATALOG: goodsPrefix + 'getcate',
	GOODS_LIST: goodsPrefix + 'getlist',
	GOODS_LIST_BY_BRAND: goodsPrefix+ 'getgoodslistbyid',
	GOODS_SEARCH: goodsPrefix + 'search',
	GOODS_SEARCH_HOT: goodsPrefix + 'gethotsearch',
	GOODS_DETAIL: detailPrefix + 'getdetail',
	GOODS_SPU: detailPrefix + 'getsku',
	SHOP_HANDLEPICKED: goodsPrefix + 'getmychoices',
	INDEX_MOD: goodsPrefix + 'getindexlist',
	BRAND_LIST: goodsPrefix + 'getbrandlist',
	GUESS_LIKE: goodsPrefix + 'getlikelist',
	BRAND_HANDLEPICKED: goodsPrefix + 'getchosenbrandlist',
	BRAND_HOT: goodsPrefix + 'gethotbrandlist',
	MONTH_HOT: goodsPrefix + 'getmonthpopularlist',
	GOODS_HOT: goodsPrefix + 'gethotsalelist',
	SINGLE_HOT: goodsPrefix + 'gethotgoodslist',
	NEW_GOODS: goodsPrefix + 'getnewgoodslist',

};

const getCatalogue = (type = 0) => fetch(sourceURLs.GOODS_CATALOG, {
	type
});

const getListByCatalogId = (data) => {
	if (typeof data !== 'object') {
		return;
	}
	return post(sourceURLs.GOODS_LIST, data);
};

const getGoodsByBrand = (data) => {
	if (typeof data !== 'object') {
		return;
	}
	return post(sourceURLs.GOODS_LIST_BY_BRAND, data);
};

const getSearchData = (data) => {
	if(typeof data !== 'object'){
		return;
	}
	return post(sourceURLs.GOODS_SEARCH,data);
};

const getHotSearch = ()=> fetch(sourceURLs.GOODS_SEARCH_HOT);

const getDetailInfo = (spuid) => {
	if (!spuid) {
		return;
	}
	return fetch(sourceURLs.GOODS_DETAIL, {
		spuid
	});
};

const getGoodsSpu = (spuid) => {
	if (!spuid) {
		return;
	}
	return fetch(sourceURLs.GOODS_SPU, {
		spuid
	});
};

const getShopHandpicked = (actiontype = 0) => fetch(sourceURLs.SHOP_HANDLEPICKED, {
	actiontype
});

const getIndexMod = (provinceid = 0, cityid = 0) => fetch(sourceURLs.INDEX_MOD, {
	provinceid,
	cityid
});

const getBrandList = (pageindex, pagesize, provinceid = 0, cityid = 0) => post(sourceURLs.BRAND_LIST, {
	pageindex,
	pagesize,
	provinceid,
	cityid
});

const getGuessLike = (provinceid = 0, cityid = 0) => fetch(sourceURLs.GUESS_LIKE, {
	provinceid,
	cityid
});

const getBrandHandpicked = (pageindex, pagesize, provinceid = 0, cityid = 0)=> post(sourceURLs.BRAND_HANDLEPICKED,{
	pageindex,
	pagesize,
	provinceid,
	cityid
});

// 品牌热销榜
const getBrandHot = (provinceid = 0, cityid = 0) => fetch(sourceURLs.BRAND_HOT, {
	provinceid,
	cityid
});

// 本月爆款
const getMonthHot = (provinceid = 0, cityid = 0) => fetch(sourceURLs.MONTH_HOT, {
	provinceid,
	cityid
});

// 热销榜
const getGoodsHot = (provinceid = 0, cityid = 0) => fetch(sourceURLs.GOODS_HOT, {
	provinceid,
	cityid
});

// 火爆单品
const getSingleHot = (data, provinceid = 0, cityid = 0) => {
	const params = Object.assign(data, {
		provinceid,
		cityid
	});
	return post(sourceURLs.SINGLE_HOT, params);
};

// 新品推荐
const getNewGoods = (data, provinceid = 0, cityid = 0) => {
	const params = Object.assign(data, {
		provinceid,
		cityid
	});
	return post(sourceURLs.NEW_GOODS, params);
};

export default {
	getCatalogue,
	getListByCatalogId,
	getSearchData,
	getHotSearch,
	getDetailInfo,
	getGoodsSpu,
	getShopHandpicked,
	getIndexMod,
	getBrandList,
	getGuessLike,
	getGoodsByBrand,
	getBrandHandpicked,
	getBrandHot,
	getMonthHot,
	getGoodsHot,
	getSingleHot,
	getNewGoods
};