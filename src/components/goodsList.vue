<template>
	<ul class="goods-list__box">
		<li @click="redirect('/detail',{spuId:goods.spuid})" v-for="(goods, idx) in goodsArr" :key="goods.spuid" class="goods-list__item">
			<div class="goods-list__pic">
				<img  :src="goods.goodslistpicurl " alt="">
				<!-- <div v-if="type==2" class="goods-list__icon" :class="{'goods-list__icon--gray':idx+1>3}">{{idx+1 }}</div> -->
				<div class="goods-list__saleover" v-show="!!goods.issoldout">
					<div class="saleover">
						<span class="saleover-txt">/ 已售完 /</span>
					</div>
				</div>
			</div>
			<div class="goods-list__info">
				<div class="gli-name-wrap">
					<p class="gli-name">
						<span class="gli-name__txt">{{ goods.goodsname }}</span>
					</p>
					<p class="gli-subname">
						<span class="gli-subname__txt">{{ goods.goodsdescript }}</span>
					</p>
				</div>
				<p class="gli-price">
					<span>¥{{ goods.goodsprice.toFixed(2) }}</span>
					<!-- <span  class="gli-price__btn tb1px">立即购买</span> -->
				</p>
			</div>
		</li>
	</ul>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		props:['goodsArr','type'],
		mounted(){
		}
	}
</script>

<style scoped>
	@import '../assets/styles/mixins.css';

	.goods-list__item{
		display: flex;
		/*align-items: center;*/
		padding: 0.2rem 0.32rem;
		/*border-bottom: 1px solid #e6e6e6;*/
	}

	.goods-list__pic{
		position: relative;
		width: 2.0rem;
		height: 2.0rem;
		/*border: 1px solid #e6e6e6;*/
		border-radius: 0.04rem;
		overflow: hidden;
		/*background-color: #f5f5f5;*/

		img{
			display: block;
			width: 100%;
		}

		.goods-list__icon{
			position: absolute;
			top: 0;
			left: 0.16rem;

			width: 0.26rem;
			height: 0.34rem;
			line-height: 0.34rem;

			color: #fff;
			font-size: 0.16rem;
			text-align: center;

			background: url(../assets/images/icon-rank.png) center center/0.26rem 0.34rem no-repeat transparent;
		}

		.goods-list__icon--gray{
			background-image: url(../assets/images/icon-rank-gray.png);
		}
	}

	.goods-list__saleover{
		position: absolute;
		left: 0;
		top:0;

		@extend flex-center;

		width: 100%;
		height: 100%;
		background-color: rgba(0,0,0,.6);
	}
	.saleover{
		position: relative;
		width: 1.7rem;
		height: 1.3rem;
		border:2px solid rgba(255,255,255,.5);
		.saleover-txt{
			position: absolute;
			left:50%;
			top:50%;

			width: 1.4rem;
			height: 1.0rem;
			line-height: 1.0rem;

			font-size: $fs-28;
			color:#fff;
			text-align: center;

			background-color: rgba(255,255,255,.4);
			transform:translate3d(-50%,-50%,0);
		}
	}


	.goods-list__info{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		width: 1%;
		margin-left: 0.25rem;
		/*padding: 0.16rem 0 0.18rem 0;*/
		padding: 8px 0 9px 0;
		line-height: 0.36rem;
		color: #333;
		font-size: 0.26rem;

		.gli-name{
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.gli-subname{
			margin-top: 0.06rem;
			/*margin-bottom: 0.36rem;*/
			color: #808080;
			font-size: 0.22rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.gli-price{
			display: flex;
			align-items: center;
			justify-content: space-between;
			/*margin-top: 0.4rem;*/
			color: $main-color;
			line-height: 0.9;

			& span:first-letter{
				display: inline-block;
				margin-right: 0.06rem;
			}
		}
		
		.gli-price__btn{
			width: 1.4rem;
			/*height: 0.54rem;
			line-height: 0.56rem;*/
			padding: 0.06rem 0;
			border: 1px solid currentColor;
			border-radius: 0.06rem;
			/*box-sizing: border-box;*/
			color: $main-color;
			font-size: 0.24rem;
			text-align: center;
			background-color: #fff;
		}

	}
</style>