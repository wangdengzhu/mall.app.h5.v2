import { fetch,post } from '@/utils/fetch';

const orderPrefix = '/order/m/';

const sourceURLs = {
    TOTAL: orderPrefix+'total',
	LIST: orderPrefix+'list',
    DETAILS: orderPrefix+'details',
    MODIFY_ADDR: orderPrefix+'modifyAddress',
    EXPRESS: orderPrefix+'express',
    CANCEL: orderPrefix+'cancel',
    CONFIRM: orderPrefix+'confirm',
    INVOICE: orderPrefix+'invoice'
};

const getList = (data) => {
    if(typeof data !== 'object'){
		return;
	}
    return post(sourceURLs.LIST, data);
};

const getDetails = (orderNo) => {
    if(!orderNo){
        return;
    }
	return fetch(sourceURLs.DETAILS, {
        orderNo
    });
}

const getTotal = () => fetch(sourceURLs.TOTAL);

const modifyAddr = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.MODIFY_ADDR, data);
}

const getExpress = (shipmentId, expressNo) => {
    if(!shipmentId || !expressNo){
        return;
    }
    return fetch(sourceURLs.EXPRESS, {
        shipmentId,
        expressNo
    })
}

const cancel = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.CANCEL, data)
}

const confirm = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.CONFIRM, data);
}

const invoice = (data) => {
    if(typeof data !== 'object'){
		return;
    }
    return post(sourceURLs.INVOICE, data);
}

export default {
	getList,
    getDetails,
    getTotal,
    modifyAddr,
    getExpress,
    cancel,
    confirm,
    invoice
};