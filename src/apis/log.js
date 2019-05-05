import {fetch } from '@/utils/fetch';

const logPrefix = '/server/m/';

const sourceURLs = {
	REPORT: logPrefix + 'getlog'
};

const report = (level, message) => fetch(sourceURLs.REPORT, {
	level,
	message
});

export default {
	report
}