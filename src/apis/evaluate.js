import { fetch,post } from '@/utils/fetch';

const goodsDetailPrefix = '/goodsdetail/v1/app/';

const sourceURLs = {
    GETPENDINGCOMMENT: goodsDetailPrefix + 'getpendingcomment',
    GETCOMMENTED: goodsDetailPrefix + 'getcommented',
    COMMITCOMMENT: goodsDetailPrefix + 'commitcomment',    
    UPLOADCOMMENTPIC: goodsDetailPrefix + 'uploadcommentpic',    
};

const getPendingComment = (data) => fetch(sourceURLs.GETPENDINGCOMMENT, data);

const getCommented = (data) => fetch(sourceURLs.GETCOMMENTED, data);

const commitComment = (data) => post(sourceURLs.COMMITCOMMENT, data);

const uploadCommentPic = (data) => post(sourceURLs.UPLOADCOMMENTPIC, data);


export default {
    getPendingComment,
    getCommented,
    commitComment,
    uploadCommentPic,
};