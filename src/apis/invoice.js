import { fetch,post } from '@/utils/fetch';

const invoicePrefix = '/invoice/m/';

const sourceURLs = {
	LAST:invoicePrefix + 'getlast',
	SAVE:invoicePrefix + 'save',
	SEND_EMAIL:invoicePrefix + 'sendemail'
};

const getLast = (invTitleType) => fetch(sourceURLs.LAST, {
	invTitleType
});

const save = (data) => {
	if (typeof data !== 'object') {
		return;
	}
	return post(sourceURLs.SAVE, data)
};

const sendEmail = (email, orderNo) => fetch(sourceURLs.SEND_EMAIL, {
	email,
	orderNo
})

export default {
	getLast,
	save,
	sendEmail
};