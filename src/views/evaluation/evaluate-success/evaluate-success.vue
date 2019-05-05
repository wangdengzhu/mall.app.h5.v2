<template>
	<div class="evaluate-wrapper">		
        <div class="evaluate-success" v-loadmore="loadMore" is-enable-scroll="dataIsLoading">
            <div class="banner">
                <p>感谢您的评价</p>
                <div class="btn" @click="goEvaluation">
                    查看评价
                </div>
            </div>
            <div class="hd tb1px"><i></i><span>继续评价</span></div>
            <div class="wating-evaluation-content" v-if="pendingComment.length > 0">
                <div class="evaluation-item tb1px" v-for="item in pendingComment" :key="item.id" @click="goOrderDetail(item.orderno)">
                    <div class="goods-pic tb1px">
                        <img v-lazy="{src: item.goodslistpicurl, loading: lazyImg}" alt="">
                    </div>
                    <div class="goods-info">
                        <div class="goods-top">
                            <p class="goods-name">{{item.title}}</p>
                            <p class="goods-spec">{{item.spec}}</p>
                        </div>
                        <div class="goods-bot">
                            <div class="left">
                                <p class="price">￥{{item.salesprice}}</p>
                                <p class="num">x{{item.qty}}</p>
                            </div>
                            <div class="right btn" @click.stop="goEvaluate(item)">
                                立即评价
                            </div>
                        </div>
                    </div>
                </div>
                <div class="waiting-evaluation-loading gray9" v-show="!pageIsLoading && !dataIsLoadend">
                    <div class="loading-container">
                        <div class="loading-icon"></div>
                        <div class="loading-text">正在加载中...</div>
                    </div>
                </div>
                <div class="waiting-evaluation-loadend gray9" v-show="dataIsLoadend">没有更多了</div>
            </div>
            <div class="waiting-eavluation-null" v-else>
                <img src="../../../assets/images/evaluation/icon-no-order.png" alt="">
                <p>您暂时没有可评价的订单～</p>
                <div class="btn" @click="goHome">
                    随便逛逛
                </div>
            </div>
        </div>
	</div>
</template>
<script>
    import { getAppType, InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
	import { Evaluate } from '@/apis/';
	import Indicator from '@/components/common/indicator';
	import loadmore from '@/components/common/loadmore';

    const PAGE_SIZE = 10;
    
	export default {
		data(){
			return {
                evaluatedSuccess: !1,
                pendingComment: [],
                paramObj : {
                    'pageIndex' : 1,
                    'pageSize' : PAGE_SIZE
				},
				dataIsLoading: false, 
				pageIsLoading : true,
                dataIsLoadend : false,
				lazyImg: IMAGE_DEFAULT_OBJ.I_200,
                appVersion: null,
			}
		},
		methods:{
            init() {
                this.appVersion = getAppType();
                this.getPendingComment(this.paramObj);
            },
            getPendingComment(paramObj) {
				this.pageIsLoading && Indicator.show('加载中...');
                Evaluate.getPendingComment(paramObj).then(res => {
                    console.log('未评价商品列表', res);
                    this.pageIsLoading && Indicator.close();
                    this.pageIsLoading = false;
                    if(res.code === 1) {
                        this.pendingComment = this.pendingComment.concat(res.data);
                        if(res.data.length > 0) {
                            if(this.pendingComment.length >= res.data[0].totalrows) {
                                this.dataIsLoading = true;
                                this.dataIsLoadend = true;
                            }else {
                                this.dataIsLoading = false;	
                            }
                        }
                    }else {
                        Toast(res.message);
                    }
                }).catch(err=>{
					console.log('获取未评价商品列表.', err);
					this.pageIsLoading && Indicator.close();
				});
            },
            //加载更多
			loadMore() {
				this.dataIsLoading = true;				
				this.paramObj.pageIndex++;				
				this.getPendingComment(this.paramObj);
            },
            goEvaluation() {
                window.location.href = './my-evaluation.html?status=1'
            },
            goEvaluate(obj) {
                console.log(obj)
                let str = '';
                for(let key in obj) {
                    if(key==='goodslistpicurl') {
                        obj[key] = obj[key].replace(/\.([\w]+)$/,'^^$1');
                    }
                    str += `${key}=${encodeURIComponent(obj[key])}`+'&';
                }
                str = str.slice(0,-1);
                window.location.href=`./evaluate.html?${str}`;
            },
            goOrderDetail(no) {
                let self = this;
                try {
                    var url = `${ORDER_DETAIL_URL_PREFIX}${no}&source=3`;
                    if(self.appVersion === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('goToSettlementMethod', url, ()=>{})
                        }); 
                    }else {
                        InitBridge(function (bridge) {
                            bridge.goToSettlementMethod(url);   
                        }); 
                    }
                } catch (error) {
                    console.log(error)
                }
            },
            // 跳转首页
            goHome() {
                let self = this;
                try {
                    if (self.appVersion === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('goToHomeMethod', null, ()=>{})
                        }); 
                    } else {
                        InitBridge(function (bridge) {
                            bridge.goToHomeMethod();  
                        });
                    }
                } catch (error) {
                    
                }
            }
        },
        directives:{
			loadmore
		},
        beforeMount() {
            this.init();
        }
	}	
</script>

<style lang="postcss">
	@import '../../../assets/styles/mixins.css';
    @import '../../../assets/styles/common.css';

    .evaluate-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        font-size: .32rem;
        line-height: 1.15;
        background-color: #f5f5f5;
    }

    .evaluate-success {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        background-color: #fff;
        .banner {
            width: 100%;
            height: 2.2rem;
            padding-top: .54rem;
            background-image: url(../../../assets/images/evaluation/banner.png);
            background-size: 100%;
            background-postion: 0 0;
            box-sizing: border-box;
            color: #fff;
            text-align: center;
            p {
                font-size: .3rem;
                line-height: .42rem;
            }
            div {
                width: 1.6rem;
                height: .56rem; 
                margin: .32rem auto 0;
                font-size: .26rem;
                border-radius: .08rem;
                border: 1px solid #fff;
                line-height: .56rem;
                text-align: center; 
            }
        }
        .hd {
            display: flex;
            align-items: center;
            width: 100%;
            height: .8rem;
            padding-left: .32rem;
            border-bottom: 1px solid #e5e5e5;
            box-sizing: border-box;
            i {
                display: block;
                content: "";
                width: .06rem;
                height: .26rem;
                margin-right: .1rem;
                background-color: #FF681D;
                border-radius: .03rem;
            }
            span {
                font-size: .28rem;
            }
        }
        .waiting-eavluation-null {
            padding-top: 1.97rem;
            text-align: center;
            background-color: #fff;
            p {
                margin-top: .42rem;
                font-size: .26rem;
                color: #999;
            }
            .btn {
                width: 2.46rem;
                height: .61rem;
                border-radius: .12rem;
                line-height: .61rem;
                box-sizing: border-box;
                text-align: center;
                color: #FF681D;
                border: 1px solid #FF681D;
                margin: .54rem auto 0;
                font-size: .28rem;
            }
            img {
                width: 1.5rem;
                height: 1.5rem;
            }
        }
        .wating-evaluation-content {
            padding: .3rem .32rem;
            box-sizing: border-box;
        }
        .evaluation-item {
        display: flex;
        margin-bottom: .4rem;
        .goods-pic {
            width: 2rem /* 200/100 */;
            margin-right: .24rem;
            // border: 1px solid #e5e5e5;
            box-sizing: border-box;
            padding: 1px;
            img {
                display: block;
                width: 100%;
            }
        }
        .goods-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
                .goods-name {
                    margin-bottom: .16rem;
                    font-size: .26rem /* 26/100 */;
                    line-height: .36rem;
                }
                .goods-spec {
                    font-size: .22rem;
                    color: #999;
                }
                .goods-bot {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: .54rem /* 54/100 */;
                    .left {
                        display: flex;
                        margin-left: -.06rem;
                    }
                    .price {
                        font-size: .26rem;
                    }
                    .num {
                        margin-left: .2rem;
                        font-size: .24rem;
                        color: #999;
                    }
                    .btn {
                        width: 1.4rem /* 140/100 */;
                        height: .54rem;
                        font-size: .24rem;
                        line-height: .54rem;
                        border: 1px solid #FF681D;
                        border-radius: .08rem /* 8/100 */;
                        text-align: center;
                        color: #FF681D;
                        box-sizing: border-box;
                    }
                }
            }
        }
    }
    .waiting-evaluation-loading,
    .waiting-evaluation-loadend {
        font-size: 0.26rem;
        text-align: center;
    }
</style>