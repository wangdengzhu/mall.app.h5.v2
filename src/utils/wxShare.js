import router from '@/router';
import { fetch } from '@/utils/fetch';
import { isWXBrowser } from '@/utils/common';

const TICKET_URL = '/common/m/jsapi/ticket';

// const showMenuPages = /(more|home|detail)/g;

const getWXTicket = () => {
	// const origin = location.origin;
	// const base = router.options.base;
	// const href = origin+base.slice(0,-1)+router.currentRoute.fullPath;	
	// const url = href || location.href;
	const url = location.href;
	return fetch(TICKET_URL, {
		pageUrl: url
	});
};

export const wxShare = async (title, link, imgUrl, desc='') => {
	if (!isWXBrowser) {
		return;
	}
	const res = await getWXTicket();
	const data = res.data;
	if (!data) {
		return;
	}
	wx.config({
		debug: !1,
		appId: data.appId,
		nonceStr: data.nonceStr,
		timestamp: data.timestamp,
		signature: data.signature,
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone','showMenuItems','hideMenuItems']
	});
	wx.ready(function() {
		// showMenuPages.lastIndex=0;
		// if(!showMenuPages.test(link)){
		// 	wx.hideMenuItems({
		// 		menuList: ['menuItem:share:appMessage',
		// 			'menuItem:share:timeline',
		// 			'menuItem:favorite',
		// 			'menuItem:share:qq',
		// 			'menuItem:share:QZone'
		// 		], 
		// 		success: function(res) {
					
		// 		},
		// 		fail:function(err){
					
		// 		}
		// 	});
		// 	return;
		// }
		// wx.showMenuItems({
		// 	menuList: ['menuItem:share:appMessage',
		// 	'menuItem:share:timeline',
		// 	'menuItem:favorite',
		// 	'menuItem:share:qq',
		// 	'menuItem:share:QZone'
		// 	], 
		// 	success: function(res) {
				
		// 	},
		// 	fail:function(){
				
		// 	}
		// });
		wx.onMenuShareTimeline({
			title: title,
			link: link,
			imgUrl: imgUrl,
			success: () => {
				console.log('WX share success');
			},
			cancel: () => {
				console.log('WX cancel share');
			}
		});
		wx.onMenuShareAppMessage({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc,
			type: '',
			dataUrl: '',
			success: () => {
				console.log('Friend share success');
			},
			cancel: () => {
				console.log('Friend cancel share');
			}
		});
		wx.onMenuShareQQ({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc,
			success: () => {
				console.log('QQ share success');
			},
			cancel: () => {
				console.log('QQ cancel share');
			}
		});
		wx.onMenuShareWeibo({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc,
			success: () => {
				console.log('Weibo share success');
			},
			cancel: () => {
				console.log('Weibo cancel share');
			}
		});
		wx.onMenuShareQZone({
			title: title,
			link: link,
			imgUrl: imgUrl,
			desc: desc,
			success: () => {
				console.log('QZone share success');
			},
			cancel: () => {
				console.log('QZone cancel share');
			}
		});
	});
	wx.error(function(res) {
		
	});
};