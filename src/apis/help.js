import { fetch,post } from '@/utils/fetch';

const helpGetPrefix = '/help/v1/app/get/';
const helpUpdatePrefix = '/help/v1/app/update/';

const sourceURLs = {
	FIRSTCATE: helpGetPrefix + 'firstcate',
	PROBLEMLIST: helpGetPrefix + 'problemlist',
	COMMONPROBLEM: helpGetPrefix + 'commproblem',
    PROBLEMDETAILS: helpGetPrefix + 'problemdetails',
    PROBLEMVIEWS: helpUpdatePrefix + 'problemviews',
    PROBLEMSTATE: helpUpdatePrefix + 'problemstate',
};

const getFirstcate = (data) => post(sourceURLs.FIRSTCATE, data);

const getProblemList = (data) => post(sourceURLs.PROBLEMLIST, data);

const getCommonProblem = (data) => post(sourceURLs.COMMONPROBLEM, data);

const getProblemDetails = (data) => post(sourceURLs.PROBLEMDETAILS, data);

const updateProblemViews = (data) => post(sourceURLs.PROBLEMVIEWS, data);

const updateProblemState = (data) => post(sourceURLs.PROBLEMSTATE, data);

export default {
    getFirstcate,
    getProblemList,
    getCommonProblem,
    getProblemDetails,
    updateProblemViews,
    updateProblemState,
};