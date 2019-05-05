<template>
	<transition name="toast-fade">
		<div class="toast" :class="toastCls" v-if="visible && toastTxt">
			<i class="toast-icon" :class="iconClass" v-if="iconClass != ''"></i>
			<span class="toast-txt">{{ toastTxt }}</span>
		</div>
	</transition>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods: {

		},

		props:{
			visible:{
				type:Boolean,
				default:false
			},
			toastTxt:{
				type:String
			},
			toastCls:{
				type:String,
				default:''
			},
			iconClass:{
				type:String,
				default:''
			},
			duration:{
				type:Number,
				default:1500
			}
		}
	}
</script>

<style>
	.toast{
		position:fixed;
		left:50%;
		top:50%;
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		max-width: 75%;
		padding:  0.2rem 0.2rem;
		border-radius: .2rem;
		
		color:#fff;
		font-size:14px;
		line-height: 1.5;
		background-color: rgba(0,0,0,.75);
		
		transform: translate3d(-50%,-50%,0);
		transition: opacity .3s linear;

	}
	.toast-icon{
		width:20px;
		height: 20px;
		background-color: purple;
		border-radius: 50%;
	}
	.toast-txt{
		text-align: center;
	}

	.toast-fade-enter,.toast-fade-leave-to{
		opacity: 0;
	}
</style>