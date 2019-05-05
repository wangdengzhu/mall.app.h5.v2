<template>
	<div class="spec-popup-wrapper">
		<transition name="popup-fade" @touchmove.prevent>
			<div @click="hideSpecPopup" class="spec-popup-overlay" v-show="show" @touchmove.prevent></div>
		</transition>
		<transition name="popup-slide" >
			<div class="spec-popup" v-show="show">
				<div class="spec-popup-hd">
					<div class="spec-img tb1px">
						<img :src="curSkuInfo.skupic ||  goodsInfo.spupic[0]" alt="">
					</div>
					<div class="spec-tit">
						<p class="spec-tit-price">
							<span class="price-txt">¥{{(curSkuInfo.saleprice || goodsInfo.skupricemin).toFixed(2)}}</span>
						</p>
						<p class="spec-tit-state" v-if="specStateTxt!=''">
							<span>{{ specStateTxt }}</span>
						</p>
						<p class="spec-tit-selected" v-if="specTxt!=''">
							<span>{{ specTxt }}</span>
						</p>
					</div>
					
					<i @click="hideSpecPopup" class="spec-icon-close"></i>
				</div>
				<div class="spec-popup-bd" @touchstart="touchStartHandler" @touchmove="touchMoveHandler" @touchend="touchEndHandler">
					<div class="spec-sku-wrap" v-if="skuAttrArr.length">
						<div class="spec-sku" v-for="(item,idx) in skuAttrArr">
							<p class="sku-name">{{ item.templetname }}</p>
							<ul class="sku-list">
								<li @click="selectSKU(idx,item,key)" class="sku-item tb1px" :class="{active:item.specSelectedIdx === key , disabled:(item.disabledIDs && (item.disabledIDs.indexOf(key)>-1)) || !item1.attrskuid || !item1.attrskuid.length || isSoldOut }" v-for="(item1,key) in item.templetvalue">{{item1.attrname}}</li>
							</ul>
						</div>
					</div>
					<div class="spec-num-wrap">
						<div class="spec-num" >
							<label class="tit">数量</label>
							<div class="num tb1px">
								<span @click="modifyBuyNum('sub')" :class="{disabled:buyNum==1}" class="btn sub-btn"></span>
								<span class="num-txt tb1px">{{ buyNum }}</span>
								<span @click="modifyBuyNum('add')" :class="{disabled:isDisabledAddBtn}" class="btn add-btn"><em class="click-area"></em></span>
							</div>
						</div>

					</div>
				</div>
				<div class="spec-popup-ft" >
					<div class="opr-wrap" v-if="!goodsInfo.issoldout && goodsInfo.status != 9">
						<template v-if="actionType==3">
							<a @click="buyOprHandler(1)"  href="javascript:;" class="opr-btn add-cart">加入购物车</a>
							<a @click="buyOprHandler(2)"  href="javascript:;" class="opr-btn buy-now">立即购买</a>
						</template>
						<template v-else>
							<a @click="buyOprHandler(actionType)" href="javascript:;" class="opr-btn sure">确定</a>
						</template>
					</div>
					<div class="opr-wrap" v-else>
						<a href="javascript:;" class="opr-btn sold-out">{{ goodsInfo.issoldout ? '已售罄':'已下架' }}</a>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import Toast from './common/toast/';
	import store from '@/utils/store';
	import { Cart } from '@/apis/';
	import { GOODS_NUM_LIMIT, CARTS_NUM_LIMIT } from '@/utils/config';
	export default {
		data() {
			return {
				specTxt: '',
				specStateTxt: '',
				buyNum: 1,
				curSkuInfo: {},
				curUniSkuID: -1,
				isInitilized: !1,

				maxScroll: 0,
				startY: 0,
				scrollEl: null
			}
		},
		props: {
			show: {
				type: Boolean,
				default: !1
			},
			goodsInfo: {
				type: Object,
				default: {}
			},
			num: {
				type: Number,
				default: 1
			},
			initSkuItem: {
				type: Object,
				default: Object
			},
			skuInfo: {
				type: Array,
				default: []
			},
			skuAttrs: {
				type: Array,
				default: []
			},
			actionType: {
				type: Number,
				default: 1
			}
		},
		methods:{
			...mapMutations(['CART_ADD','CART_SAVE']),
			buyOprHandler(actionType){
				const res = this.checkSku();
				if (!res.isSelected) {
					Toast({
						toastTxt: res.errMsg,
						iconCls: 'info'
					});
					return;
				}

				if (1 === actionType || 4 === actionType) {
					this.addToCart();
				} else if (2 === actionType || 5 === actionType) {
					this.willBuy();
				} else if (6 === actionType) {
					this.modifySku();
				}
			},
			addToCart(){
				const cartItem = this.getCartItem();
				if (!cartItem) {
					return;
				}
				if (this.isLogin) {
					this.syncCartToServer(cartItem);
				} else {
					this.syncCartToLocal(cartItem);
				}
			},
			syncCartToServer(cartItem){
				Cart.add(cartItem).then((res) => {
					const code = res.code;
					const ERR = this.$ERR;
					if (code == ERR.NORMAL) {
						this.showAddCartResult();
					} else if (code == ERR.UNAUTHORIZED) {
						this.syncCartToLocal(cartItem);
					} else if (code == ERR.CARTS_NUM_LIMIT) {
						this.showCartAddFail();
					} else {
						this.showAddCartResult(!1);
					}
				}).catch((err) => {
					if (err == '401') {
						this.syncCartToLocal(cartItem);
					} else {
						console.log('加入购物车失败:' + err);
					}
					this.$emit('close');
				})
			},
			syncCartToLocal(cartItem){
				const shopId = this.$route.query.shopId || this.shopId;
				const cartList = this.cartList;
				const shopCartList = cartList[shopId];

				if (!this.checkCartCapacity(shopCartList)) {
					return;
				}

				if (!this.checkBuyNumLimit(shopCartList, cartItem)) {
					return;
				}

				this.CART_ADD({
					shopId,
					cartItem
				});
				this.showAddCartResult();
			},
			checkCartCapacity(shopCartList){
				if (shopCartList && shopCartList.length >= CARTS_NUM_LIMIT) {
					this.showCartAddFail();
					return !1;
				}else{
					return !0;
				}
			},
			checkBuyNumLimit(shopCartList,cartItem){
				const limitNum = Math.min(this.curSkuInfo.stockqty, GOODS_NUM_LIMIT);
				let bool = !0;
				if (shopCartList && shopCartList.length > 0) {
					const idx = shopCartList.findIndex((item) => item.skuid == cartItem.skuid);
					if ( idx >= 0 && (shopCartList[idx].shopnum+cartItem.shopnum)>limitNum) {
						this.showToast(`限购${this['curSkuInfo']['stockqty']}件`,'info');
						bool = !1;
					}
				}
				return bool;
			},
			showAddCartResult(isSuccess = !0) {
				let message = isSuccess ? '加入购物车成功' : '加入购物车失败';
				let icon = isSuccess ? 'success' : 'warning';
				this.showToast(message, icon);
				this.$emit('close');
			},
			showCartAddFail(){
				this.showToast(`购物车最多只能加入${CARTS_NUM_LIMIT}个商品哦!`,'info');
			},
			showToast(message,icon){
				Toast({
					toastTxt: message,
					iconCls: icon
				});
			},
			willBuy(){
				const cartItem = this.getCartItem();
				if (!cartItem) {
					return;
				}
				if (this.isLogin) {
					this.syncCartToServerByBuy(cartItem);
				} else {
					this.syncCartToLocalByBuy(cartItem);
				}
			},
			syncCartToServerByBuy(cartItem){
				Cart.buy(cartItem).then((res) => {
					this.$emit('close');
					if (res.code == this.$ERR.NORMAL) {
						this.navToCartPage();
					} else if(res.code == this.$ERR.CARTS_NUM_LIMIT){
						this.showCartAddFail();
					}else {
						this.showToast('加入购物车失败，请重试','warning');
					}
				}).catch((err) => {
					if(err == '401'){
						this.syncCartToLocalByBuy(cartItem);
					}else{
						console.log('立即购买发生错误:' + err);
					}
					this.$emit('close');
				})
			},
			syncCartToLocalByBuy(cartItem){
				const shopId = this.shopId;
				const cartList = this.cartList;
				const shopCartList = cartList[shopId];
				if (shopCartList && shopCartList.length > 0) {
					const idx = shopCartList.findIndex(item=>item.skuid==cartItem.skuid);
					if (idx < 0) {
						if (!this.checkCartCapacity(shopCartList)) {
							return;
						}
						shopCartList.push(cartItem);
					}
					shopCartList.forEach((item,idx)=>{
						if(~~item.skuid == ~~cartItem.skuid){
							item.isselect = !0;
						}else{
							item.isselect = !1;
						}
					});
					this.CART_SAVE(shopCartList);
				} else {
					this.CART_ADD({
						shopId,
						cartItem
					});
				}
				this.$emit('close');
				this.navToCartPage();
			},
			modifySku(){
				const curSku = this.curSkuInfo;
				const initSku = this.initSkuItem;

				if (curSku.skuid == initSku.skuid && this.num == this.buyNum) {
					this.hideSpecPopup();
					return;
				}

				const delSkuId = initSku.skuid;
				const newSku = {
					skuid: curSku.skuid,
					shopnum: this.buyNum,
					goodsprice: curSku.saleprice,
					isselect: this.goodsInfo.isselect
				};

				this.$emit('modifySku', {
					delSkuId,
					newSku
				});

			},
			getCartItem(){
				const shopnum = this.buyNum;
				const skuid = this.curUniSkuID;
				const goodsprice = this.curSkuInfo.saleprice;

				if (shopnum <= 0 || skuid <= 0 || goodsprice <= 0) {
					return null;
				}

				return {
					shopnum,
					skuid,
					goodsprice,
					isselect: !0
				};
			},
			navToCartPage(){
				this.$router.push({
					path: '/cart',
					query: {
						shopId: this.shopId
					}
				});
			},
			hideSpecPopup(){
				this.$emit('close');
			},
			initSelectedSpec(){
				const skuAttrArr = this.skuAttrArr;
				if(this.isSoldOut){
					this.setSpecTxt();
					return;
				}

				if (skuAttrArr.length <= 0) {
					if (this.skuInfo.length == 1) {
						this.curSkuInfo = this.skuInfo[0];
						this.curUniSkuID = this.curSkuInfo.skuid;
						this.specTxt = '';
						this.specStateTxt = '';
						return;
					}
				}

				skuAttrArr.forEach((item)=>{
					const tv = item.templetvalue;
					let idx = -1;
					if(tv.length === 1){
						item.specSelectedIdx = 0;
					}else if(this.curUniSkuID>0){
						for (let i = 0, len = tv.length; i < len; i++) {
							let j = tv[i].attrskuid.indexOf(this.curUniSkuID + '');
							if (j > -1) {
								idx = i;
								break;
							}
						}
						if (idx > -1) {
							item.specSelectedIdx = idx;
						}
					}
				});
				this.updateSkuState();
				this.setSpecTxt();
			},
			selectSKU(key,skuItem,idx){
				const templetvalue = skuItem.templetvalue[idx];
				const notHasSkuID =  !templetvalue.attrskuid || !templetvalue.attrskuid.length ;
				if(this.isSoldOut ||  notHasSkuID || skuItem.disabledIDs && skuItem.disabledIDs.indexOf(idx)>-1){
					return;
				}
				if(skuItem.specSelectedIdx === idx){
					if(skuItem.templetvalue.length === 1){
						return;
					}
					skuItem.specSelectedIdx = undefined;
				}else{
					skuItem.specSelectedIdx = idx;
				}
				this.updateSkuState();
				this.setSpecTxt();			
			},
			updateSkuState(){
				const allSkuAttr = this.skuAttrArr;
				if (allSkuAttr.length == 1) {
					const selectedItem = allSkuAttr[0];
					if(selectedItem.specSelectedIdx>=0){
						this.curUniSkuID = selectedItem.templetvalue[selectedItem.specSelectedIdx].attrskuid[0];
					}
					
				} else if (allSkuAttr.length >= 2) {
					allSkuAttr.forEach((sku, idx) => {
						let curSku = allSkuAttr[idx];
						let skuRE = this.getSkuIdsRegExp(idx);
						this.renderSkuState(curSku, skuRE);
					});
				}
				this.getUniqueSkuID();
				this.renderSkuInfo();
			},
			getUniqueSkuID(){
				let arr = [];
				this.skuAttrArr.forEach((item,idx)=>{
					if(item.specSelectedIdx>=0){
						if (arr.length) {
							arr = this.getArrMix(arr, [...item.templetvalue[item.specSelectedIdx].attrskuid]);
						} else {
							arr = arr.concat([...item.templetvalue[item.specSelectedIdx].attrskuid]);
						}
					}
				});
				if(arr.length==1){
					this.curUniSkuID = arr[0];
				}
				return arr;
			},
			renderSkuState(curSku,skuRE){
				const templetvalue = curSku.templetvalue;
				let disabledIDs = curSku.disabledIDs;
				for (let i = 0, len = templetvalue.length; i < len; i++) {
					let item = templetvalue[i];
					
					if(i === curSku.specSelectedIdx){
						continue;
					}
					
					if (!skuRE) {
						this.arrNumDelSafe(disabledIDs, i);
						continue;
					}
					
					skuRE.lastIndex = 0;
					if (skuRE.test(item.attrskuid.join(','))) {
						this.arrNumDelSafe(disabledIDs, i);
						continue;
					} 

					if (disabledIDs && disabledIDs.length) {
						(disabledIDs.indexOf(i) < 0) && disabledIDs.push(i);
					} else {
						curSku.disabledIDs = [i];
						disabledIDs = curSku.disabledIDs;
					}
				}
			},
			renderSkuInfo(){
				const skuInfoArr = this.skuInfo;
				const result = this.checkSku();
				const uniqueSkuId = this.curUniSkuID;
				if(result.isSelected && uniqueSkuId>0){
					this.curSkuInfo = skuInfoArr.filter((info, i) => info.skuid == uniqueSkuId)[0];
					this.buyNum = Math.min(this.buyNum , this.curSkuInfo.stockqty);
				}else{
					this.curSkuInfo = {};
				}
			},
			checkSku(){
				const allSkuAttr = this.skuAttrArr;
				const skuInfoArr = this.skuInfo;
				let isSelected = !0;
				let errMsg = '';

				for (let i = 0, len = allSkuAttr.length; i < len; i++) {
					if (typeof allSkuAttr[i].specSelectedIdx !== 'number') {
						isSelected = !1;
						errMsg = `请选择${allSkuAttr[i].templetname}`;
						break;
					}
				}
				return {
					isSelected,
					errMsg
				};
			},
			getSkuIdsRegExp(key){
				const skuItem = this.skuAttrArr.filter((n,idx)=>idx!==key);
				let skuAttrs = [];
				let re = null;
				skuItem.forEach((item,idx)=>{
					const selectedValue = item.templetvalue[item.specSelectedIdx];
					if(selectedValue){
						if(skuAttrs.length){
							skuAttrs = this.getArrMix(skuAttrs,selectedValue.attrskuid);
						}else{
							skuAttrs = skuAttrs.concat(selectedValue.attrskuid);
						}	
					}
				});
				if(skuAttrs.length){
					(skuAttrs.length === 1)&&(this.curUniSkuID = skuAttrs[0]);
					re = new RegExp([...new Set(skuAttrs)].join('|'),'g');
				}
				return re;
			},
			setSpecTxt(){
				let txt = '';
				this.skuAttrArr.forEach((item)=>{
					if(typeof item.specSelectedIdx === 'number'){
						txt += item.templetvalue[item.specSelectedIdx].attrname+' ';
					}
				});
				this.specStateTxt = txt ? '已选择' : '请选择规格';
				this.specTxt = txt ? txt : '';
				// this.specTxt = txt ? '已选择'+' '+txt :'请选择规格';
			},
			getArrMix(arr1, arr2) {
				return !arr2 ? arr1 : arr1.filter((n) => arr2.indexOf(n) > -1);
				
			},
			arrNumDelSafe(arr, n) {
				const idx = arr && arr.length ? arr.indexOf(n) : -1;
				(idx > -1) && arr.splice(idx, 1);
			},
			modifyBuyNum(action){
				if(this.isSoldOut){
					return;
				}
				const limitNum = Math.min(this.curSkuInfo.stockqty || this.goodsInfo.stockqty,GOODS_NUM_LIMIT);
				let err = '';
				if(action == 'add'){
					this.buyNum++;
					(this.buyNum > limitNum) && (err = '购买数量已达上限',this.buyNum = limitNum);
				}else if(action == 'sub'){
					this.buyNum--;
					(this.buyNum < 1) && (this.buyNum = 1)
				}
				err && Toast(err);
			},
			touchStartHandler(event){
				const curTarget = event.currentTarget;
				if (!curTarget) {
					return;
				}
				this.scrollEl = curTarget;
				this.startY = event.touches[0].pageY;
				this.maxScroll = curTarget.scrollHeight - curTarget.clientHeight;
			},
			touchMoveHandler(event){
				if(!this.maxScroll){
					event.preventDefault();
					return;
				}
				const pageY = event.touches[0].pageY;
				const disY = pageY - this.startY;

				const scrollTop = this.scrollEl.scrollTop;

				if (disY > 0 && scrollTop == 0) {
					event.preventDefault();
					return;
				}

				if (disY < 0 && scrollTop + 1 >= this.maxScroll) {
					event.preventDefault();
					return;
				}
			},
			touchEndHandler(){
				this.maxScroll = 0;
			}
		},
		computed:{
			...mapState(['shopId','cartList','isLogin']),
			skuAttrArr(){
				return this.skuAttrs.slice(0);
			},
			isSoldOut(){
				return this.goodsInfo.issoldout || this.goodsInfo.status == 9;
			},
			isDisabledAddBtn(){
				return  (this.buyNum == Math.min(this.curSkuInfo.stockqty || this.goodsInfo.stockqty,GOODS_NUM_LIMIT)) || this.isSoldOut;
			}
		},
		watch:{
			skuAttrs(newVal){
				// if(this.isInitilized){
				// 	return;
				// }
				// this.isInitilized = !0;
				this.initSelectedSpec();
			},
			num(newBuyNum){
				this.buyNum = newBuyNum;
			},
			initSkuItem(newSku){
				this.curSkuInfo = Object.assign({}, newSku);
				this.curUniSkuID = newSku.skuid;
			},
			show(val){
				if(val){
					document.body.classList.add('no-scroll');
				}else{
					document.body.classList.remove('no-scroll');
				}
			}
		},
		mounted(){

		}
	};
</script>

<style scoped>
	@import '../assets/styles/mixins';
	@define-mixin icon $w,$h,$url{
		display: block;
		width: $w;
		height: $h;
		background: url($url) 0 0/cover;
	}
	.spec-popup-overlay{
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0,0,0,0.3);
		z-index: 1500;
	}

	.spec-popup{
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		padding: 0 $mg-30;
		background-color: #fff;
		z-index: 1501
	}

	.spec-popup-hd{
		display: flex;
		padding-top: $mg-40;
		align-items: flex-start;
		
		.spec-img{
			width: 1.8rem;
			height: 1.8rem;
			/*border:1px solid $color-d9;*/
			border-radius:$radius-10;
			overflow: hidden;
			img{
				display: block;
				width: 100%;
				height: auto;
			}
		}
		.spec-tit{
			margin-left: 0.2rem;
		}
		.spec-tit-state{
			font-size: $fs-28;
			color:$color-80;
			margin-top:0.34rem;
		}
		.spec-tit-price{
			font-size: $fs-32;
			.price-txt{
				color:$main-color;
			}
			&:first-letter{
				display: inline-block;
				margin-right: 0.06rem;
			}
		}
		
		.spec-tit-selected{
			margin-top: 0.18rem; 
			font-size: $fs-28;
		}

		.spec-icon-close{
			position: absolute;
			top: 0.34rem;
			right: 0.3rem;
			@mixin icon 20px,20px,../assets/images/icon-del-detail.png;
			&:before{
				content:'';
				position:absolute;
				top:-0.34rem;
				right: -0.3rem;
				bottom: -0.3rem;
				left: -0.3rem;
			};
		}
	}

	.spec-popup-bd{
		padding-bottom: 1.5rem;
		max-height: 6rem;
		overflow-y: auto;
		overflow-x: hidden;
		-webkit-overflow-scrolling:touch;
	}

	.spec-sku{
		font-size: 0.26rem;
		color:#333;
		.sku-name{
			margin-top: 0.1rem;
			margin-bottom: $mg-30;
			font-size: 0.28rem;
		}
		&:first-of-type .sku-name{
			margin-top: $mg-40;
		}
		.sku-list{
			display: flex;
			flex-wrap: wrap;
			margin-left: -15px;
			.sku-item{
				height: 0.5rem;
				line-height: 0.5rem;
				border: 1px solid #d9d9d9;
				border-radius: $radius-6;
				padding: 0 0.18rem;
				margin-left: 15px;
				margin-bottom: $mg-30;
				color:#333;
				text-align: center;
				&.active{
					color:$main-color;
					border-color:$main-color;
				}
				&.disabled{
					color:#999;
					background-color: #ebebeb;
					border-color:transparent;
				}
			}
		}
	}

	.spec-num-wrap{
		margin-top: 0.1rem;
	}
	.spec-num-wrap:first-child:last-child{
		margin-top: 0.4rem;
	}

	.spec-num{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: $fs-32;
		.tit{
			font-size: 0.28rem;
		}
		.num{
			display: flex;
			width: 2.6rem;
			height: 0.6rem;
			box-sizing: border-box;
			border:1px solid $color-d9;
			border-radius: $radius-6;
			.btn,.num-txt{
				height: 100%;
				text-align: center;
				box-sizing: border-box;
			}
			.num-txt{
				position: relative;
				flex:1;
				line-height: 0.58rem;
				border: 1px solid $color-d9;
				border-top: none;
				border-bottom: none;
				font-size: $fs-32;
			}
			.btn{
				position: relative;
				width: 0.80rem;
				z-index: 2;
				&.sub-btn:before{
					content:'';
					position: absolute;
					left: 50%;
					top:50%;
					width:0.2rem;
					height: 1px;
					background-color: #333;
					transform: translate3d(-50%,-50%,0);
				}
				&.sub-btn:after{
					content:'';
					position: absolute;
					top:-0.22rem;
					left:-0.32rem;
					bottom: -0.22rem;
					right: 0;
					background-color: transparent;
				}
				&.add-btn .click-area{
					position: absolute;
					top:-0.22rem;
					left:0;
					bottom: -0.22rem;
					right: -0.32rem;
					background-color: transparent;
					z-index: 4;
				}
				&.add-btn:before,&.add-btn:after{
					content:'';
					position: absolute;
					left: 50%;
					top:50%;
					background-color: #333;
					transform: translate3d(-50%,-50%,0);
				}
				&.add-btn:before{
					width:0.2rem;
					height: 1px;
				}
				&.add-btn:after{
					height: 0.2rem;
					width:1px;					
				}
				&.disabled:before,&.add-btn.disabled:after{
					background-color: $color-b2;
				}
			}
		}
	}

	.spec-popup-ft{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		height: 1.1rem;
		font-size: $fs-32;
		background-color: #fff;
		box-shadow: 0 -2px 2px 0 rgba(200,200,200,0.20);

		z-index: 2;
		.opr-wrap{
			display: flex;
			flex:1;
			.opr-btn{
				flex: 1;
				text-align: center;
				line-height: 1.1rem;
				&.add-cart{
					color:$main-color;
				}
				&.buy-now,&.sure{
					color: #fff;
					background-color: $main-color;
				}
				&.sold-out{
					color: #fff;
					background-color: $color-d9;
				}
			}
		}
	}

	.popup-fade-enter-active,.popup-fade-leave-active{
		transition: all .3s linear;
	}

	.popup-fade-enter,.popup-fade-leave-to{
		opacity: 0;
	}

	.popup-slide-enter-active{
		transition: all .3s ease;
	}

	.popup-slide-leave-active {
		transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	.popup-slide-enter,.popup-slide-leave-to{
		transform: translate3d(0,100%,0);
		backface-visibility:hidden;
		perspective:1000;
	}
</style>