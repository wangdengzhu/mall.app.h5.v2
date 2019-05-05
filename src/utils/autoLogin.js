import store from '@/store';
import localStore from './store';
import { User } from '@/apis/';
import { ERR } from '@/utils/config';
import * as types from '@/store/mutations-type';

export default () => {
	const token = localStore.get('token');
	if (!token) {
		return;
	}
	store.state.token = token;
	User.getUsrInfo().then((res) => {
		if (res.code === ERR.NORMAL) {
			store.commit(types.LOGIN, token);
			store.commit(types.USRINFO_SAVE, res.data);
		}
	}).catch((err) => {
		console.log(err);
	});
};