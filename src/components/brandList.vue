<template>
	<ul class="brand-list__box">
		<li @click="redirect('/brand-goods',{brandId:brand.brandid, brandName: brand.brandname})"  v-for="brand in brandArr" :key="brand.brandid" class="brand-list__item">
			<div class="brand-list__pic">
				<img :src="brand.listpagepic" alt="">
				<!-- <div v-if="type==2" class="brand-list__icon" :class="{'brand-list__icon--gray':brand.rank>3}">{{ brand.rank }}</div> -->
			</div>
			<p class="brand-list__info">
				<span class="bli-name">{{ brand.brandname }}</span>
				<span class="bli-num">商品数：{{ brand.spunum }}</span>
			</p>
		</li>
	</ul>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		props:['brandArr','type'],
		mounted(){
		}
	}
</script>

<style scoped>
	@import '../assets/styles/mixins.css';
	.brand-list__pic{
		position: relative;
		width: 100%;
		height: 3.0rem;
		overflow: hidden;
		background-color: #f5f5f5;

		img{
			display: block;
			width: 100%;
		}

		.brand-list__icon{
			position: absolute;
			top: 0;
			left: 0.3rem;

			width: 0.26rem;
			height: 0.34rem;
			line-height: 0.34rem;

			color: #fff;
			font-size: 0.16rem;
			text-align: center;

			background: url(../assets/images/icon-rank.png) center center/0.26rem 0.34rem no-repeat transparent;
		}

		.brand-list__icon--gray{
			background-image: url(../assets/images/icon-rank-gray.png);
		}
	}

	.brand-list__info{
		display: flex;
		justify-content: space-between;
		padding: 0.26rem 0.32rem 0.36rem;
		color: #333;
		font-size: 0.3rem;


		.bli-num{
			font-size: 0.28rem;
			color: #808080;
		}
	}


</style>