import {fetch } from '@/utils/fetch';

const statisticPrefix = '/statistic/m/';

const sourceURLs = {
	SHOP: statisticPrefix + 'viewshop',
	DETAIL: statisticPrefix + 'viewgoods'
};

const shop = () => fetch(sourceURLs.SHOP);

const detail = (spuId) => fetch(sourceURLs.DETAIL, {
	spuId
});

export default {
	shop,
	detail
}