<template>
	<div class="help-wrapper">		
		<ul v-if="pageLoaded">
            <li @click="toListPage" data-sortid="0">
                <span>常见问题</span>
                <i></i>
            </li>
            <li v-for="item in list" :key="item.qa_sort_id" :data-sortid="item.qa_sort_id" @click="toListPage">
                <span>{{item.sort_name}}</span>
                <i></i> 
            </li>
        </ul>
	</div>	
</template>

<script>
	import Toast from '@/components/common/toast';
	import Indicator from '@/components/common/indicator';
    import { reLogin, getAppType, InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
	import { Help } from '@/apis/';
	import '@/assets/styles/common';
	export default {
		data(){
			return {
				pageLoaded: !1,
                list: [],
                appVersion: null,
                flag: 0, // 0:买家；1：卖家
			}
		},
		methods:{
			getFirstcate() {
				Indicator.show('加载中...');
                Help.getFirstcate({
                    flag: this.flag,
                }).then(res => {
					this.pageLoaded = !0;
					Indicator.close();
                    if(res.code === 1) {
                        this.list = res.data;
                    }else if(res.code === 401) {
                        reLogin();
                    }
                }).catch(err=>{
					Indicator.close();
				});
            },
            toListPage(e) {
                let self = this;
                let targetDomText = encodeURIComponent(e.target.innerText);
                let targetDom = e.currentTarget;
                let sortid = targetDom.getAttribute('data-sortid');
                try {
                    var url = `${SKIN_DOMAIN}/app/v2/help/list.html?sortname=${targetDomText}&sortid=${sortid}&flag=${this.flag}`;
                    if(self.appVersion === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('goToSettlementMethod', url, ()=>{})
                        }); 
                    }else{
                        InitBridge(function (bridge) {
                            bridge.goToSettlementMethod(url);
                        }); 
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            getQueryVariable(variable) {
                var query = decodeURIComponent(window.location.search.substring(1));
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){return pair[1];}
                }
                return(false);
            }
		},
		mounted(){
            this.flag = parseInt(this.getQueryVariable('flag')) == 0 ? 0 : 1;
            this.appVersion = getAppType();
			this.getFirstcate();
		}
	}
</script>

<style>
	@import '../../../assets/styles/mixins.css';
    li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: .88rem /* 88/100 */;
        padding: 0 .32rem /* 32/100 */;
        background-color: #fff;
        line-height: .88rem;
        box-sizing: border-box;
        font-size: 0.32rem;
        color: #333;
        &:not(:last-child) {
            border-bottom: 1px solid #E5E5E5;
        }
        span {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: .3rem /* 30/100 */;
            color: #333;
        }
        i {
            display: block;
            width: .16rem /* 15/100 */;
            height: .26rem /* 24/100 */;
            background-image: url(../../../assets/images/help/list-icon.png);
            background-size: 100%;
            background-repeat: no-repeat;
        }
    }

    .help-wrapper {
        position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: #f5f5f5;
		z-index: 10;
		overflow-x: hidden;
    	overflow-y: auto;
    	-webkit-overflow-scrolling: touch;
    }
    .slide-enter-active,.slide-leave-active{
		transition: all .3s ease-in-out;
	}
	.slide-enter,.slide-leave-to{
		transform: translate3d(100%,0,0);
	}
</style>