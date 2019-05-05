import { Statistic } from '@/apis';

const pageObj = {
	'shop': () => {
		Statistic.shop();
	},
	'detail': (spuId) => {
		Statistic.detail(spuId);
	}
};

const doTask = (task) => {
	const t = task[0];
	const page = task[1];
	const argv = task[2];
	const fun =  pageObj[page];
	if (t == '_pageView' && typeof fun === 'function') {
		fun(argv);
	}
};

const polling = () => {
	if (_mjda.length > 0) {
		const task = _mjda.shift();
		doTask(task);
	}
	setTimeout(()=>{
		polling();
	},100);
};

(function(){
	if (!_mjda || !Array.isArray(_mjda)) {
		return;
	}
	polling();
})();