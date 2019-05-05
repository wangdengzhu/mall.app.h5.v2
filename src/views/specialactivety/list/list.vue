<template>
	<div class="content" v-loadmore="loadMore" is-enable-scroll="isLoading">
		<ul v-if="goodsList.length > 0">
			<li v-for="(item,index) in goodsList" class="list"  @click.prevent="goGoodsDetail(item.spuid)" :key="index">
				<div class="list-img">
					<img v-lazy="{src: item.goodslistpicurl,loading: loadImg}">
				</div>
				<div class="list-title">
					<p style="-webkit-box-orient: vertical;">{{item.goodsname}}</p>
					<div class="price">
						<span>¥<span class="money">{{item.goodsprice.toFixed(2)}}</span></span>
						<span class="profit"><span>赚 </span>¥<span class="money">{{item.goodsprofit.toFixed(2)}}</span></span>
					</div>
				</div>	
			</li>
		</ul>
		<div class="loading-container" v-if="isShowMore">
			<template v-if="!isLoadOver">
				<span class="loading-icon"></span>
				<span class="loading-txt">加载中...</span>
			</template>
			<template v-else>
				<span class="loading-txt">没有更多了</span>
			</template>
		</div>
	</div>
</template>

<script>
	import { Active } from '@/apis';
	import loadmore from '@/components/common/loadmore';
	import Indicator from '@/components/common/indicator';
	import { getAppType, InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
	import '@/assets/styles/common';
	export default {
		data(){
			return {
				loadImg: IMAGE_DEFAULT_OBJ.I_300,
				appVersion:'',
				tabid:1,
				isShowMore: !1,
				isLoadOver: !1,
				isLoading: !1,
				goodsList: [],
				page: 1,
				perPage: 10,
				h5backgroundpic: [] //背景图片url地址
			}
		},
		methods:{
			init(){
				let that = this;
				this.appVersion = getAppType();
				this.isIniting = !0;
				this.isShowMore = !1;
				// 卖家版活动标签(分类)页面商品列表获取 code 1 成功 -1 失败 -2 参数错误
				this.getGoodList().then(res=>{
					if(res.code != 1){
						return false;
					}
					let list = res && res.data;
					that.isShowMore = !0;
					that.isIniting = !1;
					that.isLoadOver = list.length < this.perPage;
					that.goodsList = list;
					Indicator.close();
				}).catch(err=>{
					that.isIniting = !1;
					Indicator.close();
				});
			},
			getGoodList(){
				const tabid = this.getQueryString('tabid');
				this.tabid = tabid;
				const page = this.page;
				const perPage = this.perPage;
				return Active.getAllGoods(tabid, page, perPage)
			},
			getQueryString(name) {
				let result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
				if (result == null || result.length < 1) {
					return "";
				}
				return result[1];
			},
			loadMore(){
				let that = this;
				if (this.isLoadOver || this.isIniting) {
					return;
				}
				this.isLoading = !0;
				this.page++;
				this.getGoodList().then(res => {
					that.isLoading = !1;
					if(res.code !== 1){
						return;
					}
					const list = res.data;
					that.isLoadOver = list.length < that.perPage;
					that.goodsList.push(...list);
				}).catch(err => {
					that.isLoading = !1;
					console.log(err);
				})
			},

			// 跳转商品详情
            goGoodsDetail(spuid) {
                let that = this;
                try {
					if (that.appVersion === 'ios') {
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
            }
		},
		directives:{
			loadmore
		},
		created(){
			Indicator.show('加载中...');
		},
		mounted(){
			this.init();
		}
	}
</script>

<style>
	@import '../../../assets/styles/mixins.css';

	.content{
		width: 100%;
		background: #fff;
	}
	.content>ul{
		display: -webkit-flex;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: .3rem;
	}
	.content .list{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 3rem;
		margin-bottom: .4rem;
		font-size: .26rem;
	}
	.list .list-img{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.list .list-img img{
		width: 100%;
		height:100%;
	}
	.list .list-title{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
	}
	.list .list-title p{
		margin: .24rem 0 .22rem;
		line-height: .34rem;
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
  		-webkit-box-orient: vertical; 
		word-break: break-all;
	}
	.price .profit{
		margin-left: .26rem;
		font-size: .24rem;
		color: #FF681D;
	}
	.price .money{
		margin-left:.05rem;
	}
</style>