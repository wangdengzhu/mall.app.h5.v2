<template>
	<div class="box">
		<div class="wraper-bg" ref="wraper">
			<img v-for="(v,i) in h5backgroundpic" :src="v" :key="i">
		</div>
		<div class="content" ref="content">
			<ul v-if="goodsList.length > 0">
				<li v-for="(item,index) in goodsList" class="list" @click.prevent="goGoodsDetail(item.spuid)" :key="index">
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
		</div>
		<!-- 全部商品先开发，后续用到时候再打开入口 -->
		<div class="all-goods" @click="toAllGoods" v-show="false">全部<br>商品</div>
	</div>
</template>

<script>
	import { Active } from '@/apis';
	import Indicator from '@/components/common/indicator';
	import { getAppType, InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
	import '@/assets/styles/common';
	export default {
		data(){
			return {
				loadImg: IMAGE_DEFAULT_OBJ.I_300,
				appVersion: '',
				tabid: '',
				goodsList: [],//商品信息
				h5headtitle: '', //title
				h5backgroundpic: [] //背景图片url地址
			}
		},
		methods:{
			init(){
				let that = this;
				this.appVersion = getAppType();
				// 活动H5专题介绍页面背景信息获取 code 1 成功 -1 失败 -2 参数错误
				Active.getTitle({
					activityid: this.getQueryString('activityid')
				}).then(res=>{
					that.h5headtitle = res && res.data.h5headtitle || '';
					//app设置title
					that.setTitle(that.h5headtitle);
					that.h5backgroundpic = res && res.data.h5backgroundpic;
					that.tabid = res && res.data.activitytabs[0].tabid;
					Indicator.close();
				}).catch(err=>{
					console.log(err)
					Indicator.close();
				});
				Active.getGoodsList({
					activityid: this.getQueryString('activityid')
				}).then(res=>{
					if(res.code != 1){
						return false;
					}
					that.goodsList = res.data;
					let imgCount = Math.floor(that.goodsList.length/2);
					let picLength = that.h5backgroundpic.length;
					//背景图设置，顶部底部各一张，每两个商品对应一张背景图，中间循环图片
					if(picLength > 2){
						let middleImg = that.h5backgroundpic[picLength-2];
						let last = that.h5backgroundpic.pop();
						that.h5backgroundpic.splice(1);
						for(let i = 0;i < imgCount;i ++){
							that.h5backgroundpic.push(middleImg);
						}
						that.h5backgroundpic.push(last);
					}
				}).catch(err=>{
					
				});
			},
			getQueryString(name) {
				let result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
				if (result == null || result.length < 1) {
					return "";
				}
				return result[1];
			},
			//设置title
			setTitle(title){
				let that = this;
                try {
					if (that.appVersion === 'ios') {
							setupWebViewJavascriptBridge((bridge) => {
								bridge.callHandler('updateNativeTitle', title, ()=>{})
							}); 
                        } else {
							InitBridge(function (bridge) {
								bridge.updateNativeTitle(title);
							}); 
						}
                    
                } catch (error) {
                    
                }
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
			},
			toAllGoods(){
				window.location.href = `../specialactivety/list.html?tabid=${this.tabid}`;
			}
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
	.box{
		position: relative;
	}
	.wraper-bg{
		font-size: 0;
		position: absolute;
		top: 0;
		left: 0;
		right:0;
	}
	.wraper-bg img{
		width: 7.5rem;
		/* height: 4.84rem; */
	}
	.wraper-bg img:first-child{
		height: auto;
	}
	.wraper-bg img:last-child{
		height: .48rem;
	}
	.bg-bottom{
		width: 100%;
	}
	.content{
		position: relative;
		padding-top: 8.38rem;
		width: 6.86rem;
		margin: 0 auto;
	}
	.content>ul{
		display: -webkit-flex;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: .3rem .3rem 0;
		background: #fff;
		border-radius: .08rem;
	}
	.content .list{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 3rem;
		height: 4.44rem;
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
		margin: .24rem 0;
		line-height: .34rem;
		overflow : hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}
	.price .profit{
		margin-left: .22rem;
		font-size: .24rem;
		color: #FF681D;
	}
	.price .money{
		margin-left:.05rem;
	}
	.all-goods{
		position: fixed;
		top: 10rem;
		right: .5rem;
		padding: .2rem;
		font-size: .14rem;
		color:#fff;
		background: #f60;
		border-radius: 50%;
	}

</style>