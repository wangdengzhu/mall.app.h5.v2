<template>
	<div  class="cnfrmbox-wrap" @touchmove.prevent>
		<transition name="cnfrmbox-bg-fade">
			<div class="cnfrmbox-bg" v-show="visible"></div>
		</transition>
		<transition name="cnfrmbox-fade">
			<div class="cnfrmbox" v-show="visible">
				<div class="cnfrmbox-hd" v-if="title!=''">
					<span class="hd-txt">{{ title }}</span>
				</div>
				<div class="cnfrmbox-bd">
					<span class="bd-message" v-html="message"></span>
				</div>
				<div class="cnfrmbox-ft">
					<a v-if="showCancelBtn" @click.prevent="btnClickHandler('cancel')" href="javascript:;" class="btn cancel-btn">{{ cancelBtnTxt }}</a>
					<a href="javascript:;" @click.prevent="btnClickHandler('confirm')" class="btn ok-btn">{{ cnfrmBtnTxt }}</a>
				</div>
			</div>
		</transition>
	</div>
	
</template>

<script>
	export default {
		data(){
			return {
				visible:!1
			}
		},
		props:{
			showCancelBtn:{
				type:Boolean,
				default:!0
			},
			title:{
				type:String,
				default:''
			},
			message:{
				type:String,
				default:''
			},
			cancelBtnTxt:{
				type:String,
				default:'取消'
			},
			cnfrmBtnTxt:{
				type:String,
				default:'确定'
			}
		},
		methods:{
			btnClickHandler(action){
				this.visible = !1;
				this.actionHander(action);
			}
		}
	}
</script>

<style scoped>
	.cnfrmbox-bg{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1999;
		background-color: rgba(0,0,0,.7);
	}
	.cnfrmbox{
		position: fixed;
		left:50%;
		top:50%;
		color:#333;
		font-size: 0.32rem;
		background-color: #fff;
		z-index:2000;
		transform: translate3d(-50%,-70%,0);
	}
	.cnfrmbox{
		width:75%;
		border-radius: 5px;
		background-color: #fff;
		text-align: center;
		overflow: hidden;
		.cnfrmbox-hd{
			padding-top: 0.25rem;
			font-size: 0.36rem;
			font-weight: bold;
		}
		.cnfrmbox-bd{
			padding: 0.6rem 0.3rem;
		}
		.cnfrmbox-ft{
			height: 0.8rem;
			line-height: 0.8rem;
			border-top: 1px solid #eee;
			text-align: left;
			overflow: hidden;
			.btn{
				float: left;
				height: 100%;
				width: 50%;
				text-align: center;
				box-sizing: border-box;
				color:#333;
				&.cancel-btn{
					border-right: 1px solid #eee;
				}
				&.ok-btn{
					color:#ff681d;
				}
				&:only-child{
					width:100%;
				}
			}
		}
	}
	.cnfrmbox-bg-fade-enter-active,.cnfrmbox-bg-fade-leave-active{
		transition:opacity .2s linear;
	}
	.cnfrmbox-bg-fade-enter,.cnfrmbox-bg-fade-leave-to{
		opacity: 0;
	}
	.cnfrmbox-fade-enter-active,.cnfrmbox-fade-leave-active{
		transition:opacity .3s linear;
	}
	.cnfrmbox-fade-enter,.cnfrmbox-fade-leave-to{
		opacity: 0;
	}
</style>
