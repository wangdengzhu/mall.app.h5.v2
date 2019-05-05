(function(){
	//API域名
	window.API_BASE_URL = 'https://devapi.manjd.com/api/';

	//默认图片域名
	window.IMAGE_DOMAIN = 'https://devimg.manjd.net/';

	//懒加载默认图片
	window.IMAGE_DEFAULT_OBJ = {
		I_LOADING: '190-190/2017701.png',
		I_200: '200-200/2017101.png',
		I_300: '300-300/2017201.png',
		I_750_300: '750-300/2017301.png',
		I_750_330: '750-330/2017401.png',
		I_750: '750-750/2017501.png',
		I_800: '800-800/2017601.png'
	};

	Object.keys(IMAGE_DEFAULT_OBJ).forEach(t => {
		IMAGE_DEFAULT_OBJ[t] = IMAGE_DOMAIN + 'default/' + IMAGE_DEFAULT_OBJ[t];
	});

}())
