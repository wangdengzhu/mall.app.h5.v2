<template>
	<div class="filter-wrapper">
		<div class="filter-overlay" v-show="isShowCnt" @click="hidePanel"></div>
		<div class="filter-cnt" :style="{ top: hasHeader ? '0.88rem' : 0 }">
			<div class="filter-tab tb1px">
				<span @click="changeTab(1)" class="filter-tab__item" :class="{active:curTab==1}">{{ colliData[colliIdx] }}</span>
				<span @click="changeTab(2)" class="filter-tab__item" :class="{active:curTab==2, asc:salesVolIdx == 1, desc: salesVolIdx == 2}">
					<em>销量</em>
					<i class="filter-tab__icon"></i>
				</span>
				<span @click="changeTab(3)" class="filter-tab__item" :class="{active:curTab==3, asc:priceIdx == 1, desc: priceIdx == 2}">
					<em>价格</em>
					<i class="filter-tab__icon"></i>
				</span>
				<span @click="changeTab(4)" class="filter-tab__item" :class="{active:isFilterTab}">筛选</span>
			</div>
			<div class="filter-bd" v-show="isShowCnt">
				<div class="colligation" v-show="curTab==1 && !isShowPricePanel">
					<span @click="changeColli(1)" class="colligation-item" :class="{active:colliIdx==1}">
						<em>综合排序</em>
						<i class="colligation-item__icon"></i>
					</span>
					<span @click="changeColli(2)" class="colligation-item" :class="{active:colliIdx==2}">
						<em>新品优先</em>
						<i class="colligation-item__icon"></i>
					</span>
				</div>
				<div class="price-condition" v-show="isShowPricePanel">
					<div class="price-condition__bd">
						<p class="price-condition__tit">价格区间</p>
						<div class="price-condition__cnt">
							<input id="min" :value="minPrice" @input="rangeInputHandler" type="tel" maxlength="6" class="price-condition__inp tb1px" placeholder="起始价格">
							<span  class="price-condition__gap">~</span>
							<input id="max" :value="maxPrice" @input="rangeInputHandler" type="tel" maxlength="6" class="price-condition__inp tb1px" placeholder="最高价格（不填则不限）">
						</div>
					</div>
					<div class="price-condition__ft">
						<span @click="resetPrice" class="pcf-btn cancel tb1px">重置</span>
						<span @click="setPrice" class="pcf-btn ok tb1px">确定</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				isShowCnt: !1,
				
				curTab: 1,
				isFilterTab:!1,
				isShowPricePanel: !1,
				colliIdx: 1,
				salesVolIdx: 0,
				priceIdx: 0,

				minPrice: '',
				maxPrice: '',
				priceArea:[0,0],

				colliData:['','综合','新品优先'],

				filterData: {
					orderfield: 4, // 1.价格排序 2.收益排序 3.销量排序 4.综合排序 5.新品优先
					orderform: 0, // 1.升序 2.降序 
					lowerprice: 0,
					upperprice: 0
				}
			}
		},
		props:{
			hasHeader: {
				type: Boolean,
				default: !0
			}
		},
		methods:{
			changeTab(idx){
				const curTab = this.curTab;
			
				if (idx > 3) {
					this.isFilterTab = !0;
					this.isShowPricePanel = !0;
				} else {
					this.isShowPricePanel = !1;
					this.curTab = idx;
					if(idx === 1 && curTab !== 1){
						this.changeColli(this.colliIdx);
						return;
					}
				}
				
				if(idx == 1 || this.isShowPricePanel){
					this.isShowCnt = !0;
				}else{
					this.isShowCnt = !1;
				}

				if(idx == 2){
					this.doSalesVolSort();
				}

				if(idx == 3){
					this.doPriceSort();
				}
			},
			doSalesVolSort(){
				let curSv = this.salesVolIdx;
				let sv = -1;
				
				if(curSv == 0){
					sv = 2;
				}else if(curSv == 1){
					sv = 2;
				}else if(curSv == 2){
					sv = 1;
				}

				this.salesVolIdx = sv;

				this.filterData.orderfield = 3;
				this.filterData.orderform = sv;
				this.dispatchFilter();
			},
			doPriceSort(){
				let curPriceIdx = this.priceIdx;
				let priceIdx = -1;
				
				if(curPriceIdx == 0){
					priceIdx = 1;
				}else if(curPriceIdx == 1){
					priceIdx = 2;
				}else if(curPriceIdx == 2){
					priceIdx = 1;
				}

				this.priceIdx = priceIdx;
				this.filterData.orderfield = 1;
				this.filterData.orderform = priceIdx;
				this.dispatchFilter();
			},
			
			changeColli(idx){
				this.colliIdx = idx;
				this.filterData.orderfield = idx == 1 ? 4 : 5;
				this.dispatchFilter();
			},

			dispatchFilter(){
				this.hideFilterPanel();
				this.$emit('filter', this.filterData);
			},
			hidePanel(){
				this.hideFilterPanel();
			},
			hideFilterPanel(){
				if(!this.minPrice && !this.maxPrice){
					this.isFilterTab = !1;
				}
				this.isShowCnt = !1;
			},
			
			rangeInputHandler(e){
				const target = e.target;
				let val = target.value;
				if(!/^\d+$/g.test(val)){
					val = val.replace(/[^\d]/g,'');
					e.target.value = val;
				}
				if(/^0*/.test(val)){
					val = val.replace(/^0*/,'');
					e.target.value = val;
				}
				if(target.id=="min"){
					this.minPrice = val;
				}else{
					this.maxPrice = val;
				}
			},

			resetPrice(){
				this.minPrice = '';
				this.maxPrice = '';
			},

			setPrice(){
				const filterData = this.filterData;
				const min = ~~this.minPrice;
				const max = ~~this.maxPrice;

				let minP = min;
				let maxP = max;

				if(min && max){
					minP = Math.min(min, max);
					maxP = Math.max(min, max);
					this.minPrice = minP;
					this.maxPrice = maxP;
				}

				filterData.lowerprice = minP;
				filterData.upperprice = maxP;
				this.dispatchFilter();
				
			}
		},
		mounted(){

		}
	}
</script>

<style scoped>
	@import '../assets/styles/mixins.css';
	.filter-overlay{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1000;
		background-color: rgba(0,0,0,.5);
	}
	.filter-cnt{
		position: absolute;
		top: 0.88rem;
		left: 0;
		right: 0;
		z-index: 1000;
		background-color: #fafafa;
	}
	.filter-tab{
		display: flex;
		height: 0.88rem;
		border-bottom: 1px solid $color-d9;
		font-size: 0.28rem;
	}

	.filter-tab__item{
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		.filter-tab__icon{
			display: inline-block;
			width: 0.24rem;
			height: 0.24rem;
			background: url(../assets/images/icon-sort-default.png) 0 0/ contain no-repeat;
		}
		&.active{
			color: $main-color;
		}
		&.active.desc .filter-tab__icon{
			background-image: url(../assets/images/icon-sort-desc.png);
		}
		&.active.asc .filter-tab__icon{
			background-image: url(../assets/images/icon-sort-asc.png);
		}
	}

	.filter-bd{
		font-size: 0.28rem;
		.colligation{
			height: 1.5rem;
		}
		.colligation-item{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 0.16rem;
			padding: 0 0.32rem;
			line-height: 0.6rem;
			.colligation-item__icon{
				display: none;
				width: 0.34rem;
				height: 0.26rem;
				background: url(../assets/images/icon-tick.png) 0 0/ contain no-repeat;
			}

			&:last-of-type{
				margin-top: 0rem;
			}

			&.active{
				color: $main-color;
				.colligation-item__icon{
					display: block;
				}
			}
		}

		.price-condition__bd{
			padding: 0.32rem;
			font-size: 0.24rem;
		}

		.price-condition__cnt{
			display: flex;
			align-items: center;
			margin-top: 0.2rem;
			.price-condition__inp{
				flex: 1;
				width: 1%;
				height: 0.7rem;
				border: 1px solid $color-d9;
				border-radius: 0.04rem;
				text-align: center;
				color: #333;
				&::-webkit-input-placeholder{
					font-size:0.24rem;
					color: $color-80;
				}
			}
			.price-condition__gap{
				font-size: 0.4rem;
				margin: 0 0.2rem 0 0.22rem;
				color: #999;
			}
		}

		.price-condition__ft{
			display: flex;
			height: 0.8rem;
			line-height: 0.8rem;
			font-size: 0.28rem;

			.pcf-btn{
				flex: 1;
				text-align: center;

				&.cancel{
					background-color: #f5f5f5;
				}

				&.ok{
					color: #fff;
					background-color: $main-color;
				}
			}
		}
	}
	
</style>