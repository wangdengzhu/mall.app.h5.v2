/**
 * 支付方式配置，方便添加
 */

import { isWXBrowser } from './common';

//微信环境不开启支付宝
const isAliPayEnabled = isWXBrowser ? !1 : !0;

const paymentWaysArr = [{
	icon: 'wxpay',
	name: '微信支付',
	payChannel: 1,
	isEnabled: !0,
}, {
	icon: 'alipay',
	name: '支付宝',
	payChannel: 2,
	isEnabled: isAliPayEnabled
}, {
	icon: 'jdpay',
	name: '京东支付',
	payChannel: 3,
	isEnabled: !1
}, {
	icon: 'jdpay',
	name: '测试通道',
	payChannel: 4,
	isEnabled: !1
}];

export default paymentWaysArr;