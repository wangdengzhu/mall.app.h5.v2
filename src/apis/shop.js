import { fetch,post } from '@/utils/fetch';

const shopPrefix = '/shop/m/';

const sourceURLs = {
	SHOP_INFO: shopPrefix + 'info',
	SHOP_GOODS: shopPrefix + 'goods',
	SHOP_TEL: shopPrefix + 'getShopTel'
};

const getShop = () => fetch(sourceURLs.SHOP_INFO);

const getShopGoods = () => fetch(sourceURLs.SHOP_GOODS);

const getShopTel = () => fetch(sourceURLs.SHOP_TEL);

export default {
	getShop,
	getShopGoods,
	getShopTel
};