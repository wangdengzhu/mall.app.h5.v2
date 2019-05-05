import { fetch, post } from '@/utils/fetch';

const prefix = '/college/v1/app/';

const sourceURLs = {
	BANNER: `${prefix}getbanner`,
	CATE: `${prefix}getarticlesort`,
	ARTICLE: `${prefix}getarticle`,
	DETAIL: `${prefix}getarticledetail`,
	PV: `${prefix}editarticlepv`,
	ISUSE: `${prefix}isuseful`,
	BANNER_HIT: `${prefix}editbannerhits`,
	DETAIL_RECOMMEND: `${prefix}getarticlerecommend`
};

const getBanner = (pageindex = 1, pagesize = 4) => fetch(sourceURLs.BANNER, {
	pageindex,
	pagesize
});

const getCate = (pageindex = 1, pagesize = 4) => fetch(sourceURLs.CATE, {
	pageindex,
	pagesize
});

const getRecommend = (type = 3, sortid = -1, pageindex = 1, pagesize = 10) => fetch(sourceURLs.ARTICLE, {
	type,
	sortid,
	pageindex,
	pagesize
});

const getDetailRecommend = (sortid, articleid, pageindex = 1, pagesize = 10) => fetch(sourceURLs.DETAIL_RECOMMEND, {
	sortid,
	articleid,
	pageindex,
	pagesize
});

const getArticleDetail = (id) => fetch(sourceURLs.DETAIL, {
	id
});

const recordArticlePV = (articleid) => fetch(sourceURLs.PV, {
	articleid
});

const recordBannerHit = (bannerid) => fetch(sourceURLs.BANNER_HIT, {
	bannerid
});

const recordIsUseful = (data) => post(sourceURLs.ISUSE, data);

export default {
	getBanner,
	getCate,
	getRecommend,
	getArticleDetail,
	recordArticlePV,
	recordIsUseful,
	recordBannerHit,
	getDetailRecommend
};
