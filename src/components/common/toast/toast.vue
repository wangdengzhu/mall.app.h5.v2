<template>
	<transition name="toast-fade">
		<div class="toast" :class="[toastCls,positionCls]" :style="{'padding':iconCls != '' ? '0.3rem':'.2rem'}" v-show="visible && toastTxt">
			<i class="toast-icon" :class="'toast-icon-'+iconCls" v-if="iconCls != ''"></i>
			<span class="toast-txt" :style="{'padding-top':iconCls != '' ? '10px':'0'}">{{ toastTxt }}</span>
		</div>
	</transition>
</template>

<script>
	export default {
		data(){
			return {
				visible:!1
			}
		},
		props:{
			toastTxt:{
				type:String
			},
			toastCls:{
				type:String,
				default:''
			},
			iconCls:{
				type:String,
				default:''
			},
			position:{
				type:String,
				default:'center'
			},
			duration:{
				type:Number,
				default:1500
			}
		},
		computed:{
			positionCls(){
				const positionClasses = {
					center:'pos-center',
					left:'pos-left',
					right:'pos-right',
					top:'pos-top',
					bottom:'pos-bottom'
				};
				return positionClasses[this.position];
			}
		}
	}
</script>

<style>
	@font-face{
		font-family:  "iconfont";
		src:  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
		url('../../../assets/font/iconfont.ttf?t=1510207276915') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
		url('../../../assets/font/iconfont.svg?t=1510207276915#iconfont') format('svg'); /* iOS 4.1- */
	}
	.toast-icon {
		font-family:"iconfont" !important;
		font-size:30px;
		font-style:normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.toast-icon-info:before { content: "\e6e5"; }
	.toast-icon-warning:before { content: "\e659"; }
	.toast-icon-success:before { content: "\e657"; }

	.toast{
		position:fixed;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		max-width: 75%;
		border-radius: 0.06rem;
		
		color:#fff;
		font-size:14px;
		line-height: 1.5;
		background-color: rgba(0,0,0,.75);
		
		
		transition: opacity .3s linear;

		z-index: 99998;
	}
	
	.toast.pos-center{
		left:50%;
		top:50%;
		transform: translate3d(-50%,-50%,0);
	}

	.toast.pos-top{
		left:50%;
		top:.5rem;
		transform: translate3d(-50%,0,0);
	}

	.toast.pos-right{
		right:.5rem;
		top:50%;
		transform: translate3d(0,-50%,0);
	}

	.toast.pos-bottom{
		left:50%;
		bottom:.5rem;
		transform: translate3d(-50%,0,0);
	}

	.toast.pos-left{
		left:.5rem;
		top:50%;
		transform: translate3d(0,-50%,0);
	}
	
	.toast-txt{
		text-align: center;
	}

	.toast-fade-enter,.toast-fade-leave-to{
		opacity: 0;
	}
</style>