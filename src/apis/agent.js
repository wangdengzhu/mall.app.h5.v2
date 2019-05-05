import { fetch,post } from '@/utils/fetch';

const agentShare = (shareId) => fetch('agent/v2/app/publicshare',{
	shareId: shareId
});

const agentAgree = (storeId,getCurrStore=1) => fetch('store/v1/app/storename',{
	storeId:storeId,
	getCurrStore:getCurrStore
});

const agentGoods = (shareId,spuinfos,source=0) => post('agent/v2/app/goods',{
	shareId,
	spuinfos,
	source
});

const agentInfo = (storeId) => fetch('account/v1/app/iminfo',{
	storeId
});

const notAgentGoods = (supplierId) => fetch('agent/v1/app/supplierspulist',{
	status: 30,
	supplierId
});

export default {
	agentShare,
	agentAgree,
	agentGoods,
	agentInfo,
	notAgentGoods
};