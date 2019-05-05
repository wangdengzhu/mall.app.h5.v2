/**
 * 封装原生localStorage接口以方便使用
 */

const store = {};
const storage = window.localStorage;

//设置
store.set = (key, val) => {
	if (!key) {
		return null;
	}
	if (val === undefined) {
		return store.remove(key);
	}
	storage.setItem(key, JSON.stringify(val));
	return val;
};

//获取
store.get = (key, defaultVal) => {
	if (!key) {
		return null;
	}
	let val = JSON.parse(storage.getItem(key));
	return (val == undefined ? defaultVal : val);
};

//删除
store.remove = (key) => {
	if (!key) {
		return null;
	}
	storage.removeItem(key);
};

//清空所有
store.clear = () => {
	storage.clear();
};

//获取所有
store.getAll = () => {
	let ret = {};
	store.forEach((key, val) => {
		ret[key] = val;
	})
	return ret;
};

//遍历
store.forEach = (callback) => {
	for (var i = 0; i < storage.length; i++) {
		let key = storage.key(i);
		callback(key, store.get(key));
	}
};

export default store;