import { fetch,post } from '@/utils/fetch';

const salePrefix = '/aftersale/m/';

const sourceURLs = {
    LIST: salePrefix + 'list',
    DICTIONARY: salePrefix + 'dictionary/',
    CREATE: salePrefix + 'create',
    UPLOADEVID: salePrefix + 'uploadEvidence',
    DETAILS : salePrefix + 'detail/',
    CANCEL: salePrefix + 'cancel',
    EXPRESS: salePrefix + 'express',
    EXPRESSLIST: salePrefix + 'expressList',
    RETURN: salePrefix + 'return',
    PLATFORM: salePrefix + 'platformHandle'
};

const getList = (data) => {
    if(typeof data !== 'object'){
		return;
	}
    return post(sourceURLs.LIST, data);
};

const getDetails = (asno) => fetch(sourceURLs.DETAILS + asno);

const getType = (type) => fetch(sourceURLs.DICTIONARY + type);

const create = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.CREATE, data);
}

const uploadEvid = (data) => {
    if(typeof data !== 'object'){
		return;
    }    
    return post(sourceURLs.UPLOADEVID, data);
}

const cancel = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.CANCEL, data);
}

const getExpress = (reqInfo) => {
    if(!reqInfo){
        return;
    }
    return fetch(sourceURLs.EXPRESS, {reqInfo});    
}

const submitBack = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.RETURN, data);
}

const platform = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.PLATFORM, data);
}

const getExpressName = () => fetch(sourceURLs.EXPRESSLIST);

export default {
    getList,
    getDetails,
    getType,
    create,
    uploadEvid,
    cancel,
    getExpress,
    getExpressName,
    submitBack,
    platform  
}