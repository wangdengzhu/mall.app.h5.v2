<template>
	<div class="evaluation-wrapper">		
		<ul class="evaluation-menu justify-flex tb1px">
			<li v-for="item in menuList" :key="item.id" class="flex-one"
			    @click="switchTabs(item.index)" :class="{'active' : item.index == curStatus}">
				<span>{{item.text}}</span>
			</li>
		</ul>
        <div class="evaluation-scroll-wrapper">
            <div class="evaluation-scroll-inner">
				<div class="evaluation-list-wrapper">
					<div class="waiting-evaluation-wrap" v-show="curStatus == 0" v-loadmore="loadMore" is-enable-scroll="data1IsLoading">
                        <div class="wating-evaluation-content" v-if="pendingComment.length > 0">
                            <div v-for="item in pendingComment" :key="item.id" class="evaluation-item tb1px" @click="goOrderDetail(item.orderno)">
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
                            <div class="waiting-evaluation-loading gray9" v-show="!page1IsLoading && !data1IsLoadend">
                                <div class="loading-container">
                                    <div class="loading-icon"></div>
                                    <div class="loading-text">正在加载中...</div>
                                </div>
                            </div>
                            <div class="waiting-evaluation-loadend gray9" v-show="data1IsLoadend">没有更多了</div>
                        </div>
                        <div class="waiting-eavluation-null" v-else>
                            <img src="../../../assets/images/evaluation/icon-no-order.png" alt="">
                            <p>您暂时没有可评价的订单～</p>
                            <div class="btn tb1px" @click="goHome">
                                随便逛逛
                            </div>
                        </div>
                    </div>
                    <div class="evaluated-wrap" v-show = "curStatus == 1" v-loadmore="loadMore" is-enable-scroll="data2IsLoading">
                        <div class="evaluated-content" v-if="commented.length > 0">
                            <div class="evaluated-item" v-for="item in commented" :key="item.id">
                                <div class="top-wrap">
                                    <div class="user">
                                        <img class="avatar" v-lazy="{src: item.usericon, loading: lazyImg}" alt="">
                                        <p class="user-name">{{item.nickname}}</p>
                                    </div>
                                    <div class="evaluated-time">
                                        {{item.createtime}}
                                    </div>
                                </div>
                                <div class="star-wrap">
                                    <span v-for="(star, index) in starnum" :key="star.id"  :class="{'active': index < item.stars}"></span>
                                </div>
                                <div class="evaluated-wrap tb1px">
                                    <p class="evaluated-text">{{item.filtertext || '默认好评'}}</p>
                                    <div class="flex-imgs-wrap" @click="showImgView($event, item.piclist)">
                                        <div v-for="img in item.piclist" :key="img.id" class="img-item">
                                            <img v-lazy="{src: img, loading: lazyImg}" alt="">
                                        </div>
                                    </div>
                                    <div class="spec-wrap">
                                        <p class="spec">{{item.spec}}</p>
                                        <!-- <p class="order-time">购买时间：{{item.ordertime}}</p> -->
                                    </div>
                                </div>
                                <div class="goods-wrap" @click="goGoodsDetail(item.spuid)">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="evaluated-loading gray9" v-show="!page2IsLoading && !data2IsLoadend">
                                <div class="loading-container">
                                    <div class="loading-icon"></div>
                                    <div class="loading-text">正在加载中...</div>
                                </div>
                            </div>
                            <div class="evaluated-loadend gray9" v-show="data2IsLoadend">没有更多了</div>
                        </div>
                        <div class="evaluated-null" v-else>
                            <img src="../../../assets/images/evaluation/icon-no-comment.png" alt="">
                            <p>暂时还没有评价～</p>
                            <div class="btn tb1px" @click="goHome">
                                随便逛逛
                            </div>
                        </div>
                    </div>
				</div>
			</div>
        </div>
	</div>		
</template>
<script>
    import { getAppType, InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
    import { Evaluate } from '@/apis/';
    import { getQueryParam } from '@/utils/common';
	import Toast from '@/components/common/toast';
	import Indicator from '@/components/common/indicator';
	import loadmore from '@/components/common/loadmore';
    const PAGE_SIZE = 10;
    const WAIT_EVALUATE_INDEX = 0;
    const EVALUATED_INDEX = 1;
    const STAR_NUM = 5;
    
	export default {
		data(){
			return {
                firstTabActiveIndex: WAIT_EVALUATE_INDEX,
                starnum: STAR_NUM,
				lazyImg: IMAGE_DEFAULT_OBJ.I_200,
                menuList : [
					{
                        text: '待评价',
                        index: WAIT_EVALUATE_INDEX
					},
					{
                        text: '已评价',
                        index: EVALUATED_INDEX
					},
                ],
                paramObj : {
					'0' : {
						'pageIndex' : 1,
						'pageSize' : PAGE_SIZE
					},
					'1' : {
						'pageIndex' : 1,
						'pageSize' : PAGE_SIZE
					}
				},
				statusArr : ['0','1'], 
				page1IsLoading : true,
                data1IsLoadend : false,
                page2IsLoading : true,
				data2IsLoadend : false,
                pendingComment: [],
				data1IsLoading: false,
				data2IsLoading: false,
                commented: [],
                starArr: [],
                curStatus: WAIT_EVALUATE_INDEX,
				showBigImg : false,
                imageUrls: [],
                appVersion: null
			}
		},
        directives:{
			loadmore
		},
		methods:{
            getPendingComment(params) {
				this.page1IsLoading && Indicator.show('加载中...');
                Evaluate.getPendingComment(params).then(res => {
                    console.log('未评价商品列表', res);
					this.page1IsLoading && Indicator.close();
                    if(res.code === 1) {
                        this.page1IsLoading = false;	
                        this.pendingComment = this.pendingComment.concat(res.data);
                        if(res.data.length > 0) {
                            if(this.pendingComment.length >= res.data[0].totalrows) {
                                this.data1IsLoading = true;
                                this.data1IsLoadend = true;
                            }else {
                                this.data1IsLoading = false;	
                            }
                        }
                    }else {
                        Toast(res.message);
                    }
                }).catch(err=>{
					console.log('获取未评价商品列表.', err);
					this.page1IsLoading && Indicator.close();
				});
            },
            getCommented(params) {
                this.page2IsLoading && Indicator.show('加载中...');
                Evaluate.getCommented(params).then(res => {
                    console.log('已评价商品列表', res);
					this.page2IsLoading && Indicator.close();
                    if(res.code === 1) {
                        this.page2IsLoading = false;	
                        this.commented = this.commented.concat(res.data);
                        if(res.data.length > 0) {
                            if(this.commented.length >= res.data[0].totalrows) {
                                this.data2IsLoading = true;
                                this.data2IsLoadend = true;
                            }else {
                                this.data2IsLoading = false;	
                            }
                        }
                    }else {
                        Toast(res.message);
                    }
                }).catch(err=>{
					console.log('获取已评价商品列表.', err);
					this.page2IsLoading && Indicator.close();
				});
            },
            //加载更多
			loadMore() {
				this.data1IsLoading = true;				
				this.data2IsLoading = true;				
				this.paramObj[this.curStatus].pageIndex++;				
				if(this.curStatus == WAIT_EVALUATE_INDEX) {
                    this.getPendingComment(this.paramObj[this.curStatus]);
                }else {
                    this.getCommented(this.paramObj[this.curStatus]);
                }
			},
            switchTabs(status=WAIT_EVALUATE_INDEX) {
                this.curStatus = status == WAIT_EVALUATE_INDEX ? WAIT_EVALUATE_INDEX : EVALUATED_INDEX;
            },
            getInitStatus() {
                let qs = getQueryParam(window.location.href);
                this.curStatus = qs('status');
            },
            init() {
                this.appVersion = getAppType();
                this.getInitStatus();
                this.getPendingComment(this.paramObj[this.curStatus]);
                this.getCommented(this.paramObj[this.curStatus]);
            },
            goOrderDetail(no) {
                let self = this;
                try {
                    var url = `${ORDER_DETAIL_URL_PREFIX}${no}&source=3`;
                    if(self.appVersion === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('goToSettlementMethod', url ,()=>{})
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
            goEvaluate(obj) {
                let str = '';
                let newObj = Object.assign({}, obj);
                for(let key in newObj) {
                    if(key==='goodslistpicurl') {
                        newObj[key] = newObj[key].replace(/\.([\w]+)$/,'^^$1');
                    }
                    str += `${key}=${encodeURIComponent(newObj[key])}`+'&';
                }
                str = str.slice(0,-1);
                window.location.href=`./evaluate.html?${str}`;
            },
            showImgView(e, arr){
                let target = e.target,
                    tagName = target.tagName.toLowerCase();	
                let index = Array.from(e.currentTarget.querySelectorAll(tagName)).indexOf(target);
                let str = `${index},${arr.join(',')}`;
                let self = this;
                try {
                    if(self.appVersion === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('imageDetail', str, ()=>{})
                        }); 
                    }else {
                        InitBridge(function (bridge) {
                            bridge.imageDetail(str);
                        }); 
                    }
                } catch (error) {
                    console.log(error)
                }
			},
            // 跳转商品详情
            goGoodsDetail(spuid) {
                let self = this;
                try {
                    if (self.appVersion === 'ios') {
                        setupWebViewJavascriptBridge((bridge) => {
                            bridge.callHandler('goToGoodsDetailMethod', spuid, ()=>{})
                        }); 
                    } else { 
                        InitBridge(function (bridge) {
                            bridge.goToGoodsDetailMethod(spuid);
                        }); 
                    }
                } catch (error) {
                    
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
        mounted(){
            this.init();
		}
	}	
</script>

<style lang="postcss">
	@import '../../../assets/styles/mixins.css';
    @import '../../../assets/styles/common.css';
    
    .evaluation-wrapper {
        font-size: .32rem;
    }
    .evaluation-menu{
        position: fixed;
        width: 100%;
        height: 0.72rem;
        top: 0;
        left: 0;
        line-height: 0.72rem;
        font-size: $fs-28;	
        background-color: #fff;
        border-bottom: 1px solid $color-d9;
        z-index: 1;

        li{
            height: 100%;				
            text-align: center;
            white-space: nowrap;

            span{
                display: inline-block;									
                height: 100%;
                color: $color-33;
                box-sizing: border-box;
                border-bottom: 2px solid transparent;
            } 

            &.active{
                span{
                    color: $main-color;
                    border-bottom-color: currentColor;
                }
            }
        }
    }
    .evaluation-scroll-wrapper{
        position: absolute;
        top: 0.72rem;
        left: 0;
        right: 0;

        &::-webkit-scrollbar{
            display: none;
        }
        
        .order-null-wrapper, .order-loading-wrapper{
            text-align: center;
            padding-top: 2rem;
        }
        .order-list-loading, .order-list-loadend{
            padding: $mg-40 0;
            font-size: 0.26rem;
            text-align: center;
        }

        .wating-evaluation-content {
            padding: .3rem .32rem;
        }
    }
    .evaluation-list-wrapper {
        background-color: #fff;
    }
    .waiting-eavluation-null,
    .evaluated-null {
        padding-top: 2.5rem;
        text-align: center;
        background-color: #f5f5f5;
        min-height: calc(100vh - .72rem);
        box-sizing: border-box;
        p {
            margin-top: .42rem;
            font-size: .34rem;
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
    }
    
    .waiting-eavluation-null img {
        width: 1.5rem;
        height: 1.5rem;
    }
    .evaluated-null img {
        padding-top: .3rem;
        width: 1.4rem;
        height: 1.28rem;
    }
    .evaluation-item {
        display: flex;
        margin-bottom: .4rem;
        height: 2rem;
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
    }
    .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
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
                align-items: center;
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
    .evaluated-content {
        background-color: #f5f5f5;
    }
    .evaluated-item {
        padding: .25rem .32rem;
        background-color: #fff;
        box-sizing: border-box;
        margin-bottom: .2rem;
        .top-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .user {
                display: flex;
                align-items: center;
            }
            .avatar {
                width: .6rem;
                height: .6rem;
                border-radius: 50%;
            }
            .user-name {
                margin-left: .16rem;
                font-size: .26rem;
            }
            .evaluated-time {
                font-size: .26rem;
                color: #999;
            }
        }
        .star-wrap {
            display: flex;
            align-items: center;
            margin-top: .2rem;
            span {
                width: .32rem;
                height: .32rem;
                margin-right: .12rem;
                background-image: url(../../../assets/images/evaluation/icon-star.png);
                background-size: 100%;
                background-repeat: no-repeat;
                &.active {
                    background-image: url(../../../assets/images/evaluation/icon-star-active.png);
                }
            }
        }
        .evaluated-wrap {
            margin-top: .32rem;
            padding-bottom: .24rem;
            border-bottom: 1px solid #e5e5e5;
            .evaluated-text {
                font-size: .26rem;
                color: #666;
                line-height: 1.4;
                white-space: pre-wrap;
                display: -webkit-box;
                word-break: break-all;
                &.ellipsis {
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .spec-wrap {
                display: flex;
                font-size: .22rem;
                color: #999;
                .spec {
                    margin-right: .2rem;
                }
            }
            .ci__bd-shrink {
                position: relative;
                padding-left: 0.37rem;
                margin-top: 0.18rem;
                font-size: 0.26rem;
                color: #ff681d;
                line-height: 0.37rem;
                .icon-shrink{
                    position: absolute;
                    left: 0;
                    top: 50%;

                    width: 13px;
                    height: 8px;
                    margin-top: -4px;
                    background: url(../../../assets/images/evaluation/icon-expand.png) 0 0/contain no-repeat;
                }

                &.collapse .icon-shrink{
                    background-image: url(../../../assets/images/evaluation/icon-collapse.png);
                }
            }
        }
        .flex-imgs-wrap {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-top: .25rem;
            .img-item {
                display: flex;
                justify-content: center;
                align-items: center;
                float: left;
                width: 2.12rem;
                height: 2.12rem;
                margin-bottom: 0.25rem;
                overflow: hidden;
                &:nth-child(3n-1)  {
                    margin-left: .25rem;
                    margin-right: .25rem;
                }
                img{
                    display: block;
                    width: 100%;
                    height: auto;
                }
            }
        }
        .goods-wrap {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-top: .24rem;
            height: 2rem;
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
                height: 2rem;
                .goods-name {
                    font-size: .24rem;
                    line-height: .34rem;
                }
                .price {
                    font-size: .26rem;
                }
            }
        }
    }
    .waiting-evaluation-loading,
    .waiting-evaluation-loadend,
    .evaluated-loadend,
    .evaluated-loading {
        font-size: 0.26rem;
        text-align: center;
    }
    .evaluated-loadend {
        padding-bottom: 0.2rem;
    }
</style>