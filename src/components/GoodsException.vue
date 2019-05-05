<template>
	<div class="cnfrmBox-wrapper" v-if="show">
		<div class="cnfrmbox-overlay"></div>
		<div class="cnfrmbox">
			<div class="cnfrmbox-hd">
				<span>{{ tit }}</span>
				<div class="hd-close" @click="hidePopup">
					<i class="hd-close-icon"></i>
				</div>
			</div>
			<div class="cnfrmbox-bd">
				<div class="goods-cnt">
					<ul class="goods-list">
						<li class="goods-item" @click="redirect('/detail',{spuId:goods.spuid})" v-for="goods in goodsList">
							<div class="goods-img" >
								<img :src="goods.skupic" alt="商品图">
							</div>
							<div class="goods-name">
								<span class="goods-name-txt">{{ goods.title }}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="cnfrmbox-ft">
				<div class="btns">
					<span v-if="lfTxt.length" class="btn btn-toAddr" @click="btnClickHandler(2)">{{lfTxt}}</span>
					<span v-if="rtTxt.length" class="btn btn-toCart" @click="btnClickHandler(1)">{{rtTxt}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {

			}
		},
		props:{
			show:{
				type:Boolean,
				default:!1
			},
			tit:{
				type:String
			},
			goodsList:{
				type:Array,
				default:[]
			},
			lfTxt:{
				type:String
			},
			rtTxt:{
				type:String
			}
		},
		methods:{
			btnClickHandler(action){
				if(action == 2){
					this.$emit('lfBtnClick');
				}else if(action == 1){
					this.$emit('rtBtnClick');
				}
			},
			hidePopup(){
				this.$emit('close');
			}
		},
		mounted(){
		}
	}
</script>


<style scoped>
	$main-color:#ff681d;
	.cnfrmbox-overlay{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0,0,0,.5);
		z-index: 40;
	}

	.cnfrmbox{
		position: fixed;
		top: 50%;
		left:50%;
		width: 5.5rem;
		transform: translate3d(-50%,-60%,0);
		z-index: 41;
		font-size: 0.24rem;

		border-radius: 3px;
		background-color: #fff;

		.cnfrmbox-hd{
			position: relative;
			height: 0.94rem;
			line-height: 0.94rem;
			color:$main-color;
			text-align: center;
			font-size: 0.26rem;
			.hd-close{
				position: absolute;
				right: 0.1rem;
				top: 0.1rem;

				width:0.28rem;
				height: 0.28rem;
				&:after{
					content:'';
					position:absolute;
					top: -0.1rem;
					right: -0.1rem;
					bottom: -0.1rem;
					left: -0.1rem;
				};

			}
			.hd-close-icon{
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				&:before,&:after{
					content:'';
					position: absolute;
					top:50%;
					left: 0;
					width:100%;
					height: 1px;
					background-color: #979797;
				}
				&::before{
					transform: rotate(-45deg);
				}
				&::after{
					transform: rotate(45deg);
				}
			}
		}
		.cnfrmbox-bd{
			border-top: 1px solid #dedede;
			border-bottom: 1px solid #dedede;
			padding: 0 0.3rem;

		}
		.goods-cnt{
			max-height: 2.42rem;
			overflow-y: auto;
			margin: 1px 0;		
			-webkit-overflow-scrolling:touch;
			.goods-item{
				display: flex;
				padding: 0.2rem 0;
				border-bottom: 1px solid #f5f5f5;
				&:last-of-type{
					border-bottom:none;
				};
				.goods-name-txt{
					color:#666;
				}
				.goods-name{
					flex: 1;
				}
				.goods-img{
					width: 0.8rem;
					height: 0.8rem;
					margin-right: 0.2rem;
					border-radius: 0.05rem;
					img{
						display: block;
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.cnfrmbox-ft{
			height: .8rem;
			line-height: .8rem;
			font-size: 0.26rem;
			.btns{
				display: flex;
				height: 100%;
				.btn{
					flex: 1;
					color:#666;
					text-align: center;
					&.btn-toAddr{
						color:$main-color;
						border-right: 1px solid #dedede;
					}
				}
			}

		}
	}
</style>