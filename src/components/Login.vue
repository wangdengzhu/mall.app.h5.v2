<template>
	<div class="login-wrap" v-show="isShow" @touchmove.prevent>
		<form id="lf" class="login-form" @submit.prevent>
			<div class="login">
				<header class="login-hd">
					<span>快速登录</span>
				</header>
				<div class="login-bd">
					<p class="input-ctrl tb1px">
						<input v-model.trim="phone" @focus="phoneFocus" @blur="phoneBlur" type="tel" class="phone-inp inp" name="phone" maxlength="11" placeholder="请输入手机号">
						<i v-show="phone.length && isPhoneFocus" @click="clearTxt" class="txt-clear"></i>
					</p>
					<p class="input-ctrl tb1px">
						<input v-model.trim="code" type="tel"  class="code-inp inp" name="code" maxlength="6" placeholder="请输入验证码">
						<span @click="sendCode" class="code-btn" :class="codeState === 3 ? 'disabled':''">{{ codeTxt }}</span>
					</p>
					<p class="">
						<button @click.prevent="submitHander" class="sbmt-btn" :class="phone.length ? '':'disabled'" >登录</button>
					</p>
				</div>
				<div class="login-ft">
					<span class="warning">登录即视为遵守<em @click="redirect('/agreement')">《用户使用协议》</em></span>
				</div>
				<i @click="hideLoginBox" class="login-close tb1px"><em class="click-area"></em></i>
			</div>
		</form>
		<!-- <toast :visible="toastVisible" :toast-cls="toastCls" :toast-txt="toastTxt"></toast> -->
	</div>
</template>

<script>
	import { mapMutations } from 'vuex';
	import { User } from '@/apis/';
	import store from '@/utils/store';
	import Toast from './common/toast/';
	import Indicator from './common/indicator/';
	import CnfrmBox from './common/confirm-box/';
	const phoneRegExp = /^1\d{10}$/;
	const COUNT_TIME = 120;
	export default {
		data(){
			return {
				isShow:!0,
				phone:'',
				code:'',
				isPhoneFocus:!1,
				isSubmiting:!1,
				isGetingCode:!1,
				timer:null,
				codeState:1,
				countNum:COUNT_TIME,
				isLoginPage:!1
			}
		},
		methods:{
			...mapMutations([
				'LOGIN'
			]),
			submitHander(){
				if(this.isSubmiting){
					return;
				}
				if (!this.checkPhone() || !this.checkCode()) {
					return;
				}
				Indicator.show('正在登录中...');
				this.isSubmiting = !0;
				User.login({
					mobile: this.phone,
					smscode: this.code
				}).then((res)=>{
					this.isSubmiting = !1;
					Indicator.close();
					this.loginResultHander(res);
				}).catch((err)=>{
					this.isSubmiting = !1;
					Indicator.close();
				});
			},
			loginResultHander(res){
				const ERR = this.$ERR;
				if (res.code === ERR.NORMAL) {
					store.set('account',this.phone);
					this.LOGIN(res.data.token);
					this.showToast('登录成功');
					this.closeLoginPopup();
				} else if (res.code === ERR.VERICODE_INVALID || res.code === ERR.VERICODE_ERR) {
					this.showToast('验证码错误或已失效，请重新获取');
				} else if (res.code === ERR.VERICODE_LIMITEDERR || res.code === ERR.VERICODE_IPERR) {
					this.showToast('您的获取验证码请求过于频繁，请15分钟之后重试');
				}else{
					this.showToast(`登录失败，请重试![${res.code}]`);
				}
			},
			closeLoginPopup(){
				if(this.isLoginPage){
					const redirect = this.$route.query.redirect;
					if(redirect!=''){
						this.$router.replace({
							path:redirect
						});
					}else{
						this.$router.replace({
							path:'/category',
							query:{
								shopId:this.$route.query.shopId
							}
						});
					}
					
				}else{
					this.$emit('closeLogin');
					this.loginCfg.cb && this.loginCfg.cb();
				}
			},
			clearTxt(){
				this.phone = '';	
			},
			phoneFocus(e){
				this.isPhoneFocus = !0;
			},
			phoneBlur(){
				this.isPhoneFocus = !1;
			},
			sendCode(){
				if(this.codeState === 3 || this.isGetingCode){
					return;
				}
				if(!this.checkPhone()){
					return;
				}
				this.isGetingCode = !0;
				this.startCounting();
				User.sendCode(this.phone).then((res) => {
					this.isGetingCode = !1;
					if(res.code === 1){
						this.showToast('短信验证码已发送到您的手机');
					}else if(/(3100|3101|3102)/.test(res.code)){
						this.showToast('验证码获取频繁，请稍后重试');
					}else{
						this.showToast(`验证码发送失败，请重试[${res.code}]`);
					}
				}).catch((err)=>{
					this.isGetingCode = !1;
				});
			},
			startCounting(){
				const start = ()=>{
					this.countNum--;
					if(this.countNum>0){
						setTimeout(()=>{
							start();
						},1000);
					}else{
						this.countNum = COUNT_TIME;
						this.codeState = 2;
					}
				};
				this.codeState = 3;
				start();
			},
			checkPhone(){
				let err = '';
				let bool = !0;
				if(!this.phone){
					bool = !1;
					err = '请输入手机号';
				}else if(!phoneRegExp.test(this.phone)){
					bool = !1;
					err = '请输入正确的手机号';
				}
				err && this.showToast(err);
				return bool;
			},
			checkCode(){
				let err = '';
				let bool = !0;
				if(!this.code){
					bool = !1;
					err = '请输入验证码';
				}else if(!/^\d{6}$/.test(this.code)){
					bool = !1;
					err = '验证码为六位数字';
				}
				err && this.showToast(err);
				return bool;
			},
			showToast(txt){
				const toastCfg = {
					toastCls:'toast-adjust',
					duration:2000
				};
				toastCfg.toastTxt = txt;
				Toast(toastCfg);
			},
			hideLoginBox(){
				if(this.isLoginPage){
					this.$router.replace({
						path: '/home',
						query:{
							shopId:this.$route.query.shopId
						}
					});
					return;
				}
				this.$emit('closeLogin');
			}
		},
		props:{
			show:{
				type:Boolean,
				default:!0
			}
		},
		watch:{
			show(val){
				this.isShow = val;
			}
		},
		computed:{
			codeTxt(){
				let txt = '';
				let state = this.codeState;
				if(state === 1){
					txt = '获取验证码';
				}else if(state === 2){
					txt = '重新发送 ';
				}else{
					txt = '重新发送(' + this.countNum + ')';
				}
				return txt;
			}
		},
		mounted(){
			this.isLoginPage = this.$route.path.toLowerCase().indexOf('login') > -1 ? !0 : !1;
			const account = store.get('account');
			if(!account){
				return;
			}
			this.phone = account;
		}
	}
</script>


<style>
	.toast-adjust{
		margin-top: -1.2rem;
	}
</style>
<style scoped>
	@import '../assets/styles/mixins.css';
	.login-wrap{
		position: absolute;
		left: 0;
		right: 0;

		display: flex;
		justify-content: center;
		align-items: center;

		width:100%;
		height: 100%;

		font-size: 0.28rem;
		color:#999;
		background-color: rgba(0,0,0,0.7);
		z-index: 10000;
	}

	.login-form{
		margin-top: -.8rem;
	}

	.login{
		position: relative;
		width: 6.18rem;
		padding: .55rem .38rem;
		box-sizing: border-box;
		border-radius: .1rem;
		background-color: #fff;
	}

	.login-hd{
		padding-bottom: .56rem;
		font-size: $fs-36;
		color:$color-80;
		text-align: center;
	}

	.login-bd .input-ctrl{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.25rem 0.12rem;
		margin-bottom: 0.48rem;
		border-bottom: 1px solid $color-d9; 
		.txt-clear{
			position: relative;
			display: block;
			width: .32rem;
			height: .32rem;

			border-radius: 50%;
			background-color: #e4e4e4;

			&::before,&::after{
				content:'';
				position:absolute;
				top:50%;
				left: 50%;
				width:70%;
				height: 1px;
				margin-left: -35%;
				background-color: #fff;
				transform-origin: center cnetr;
			};
			&::before{
				transform: rotate(-45deg);
			}
			&::after{
				transform: rotate(45deg);
			}

		}
	}

	.login-bd .sbmt-btn{
		display: block;
		width: 100%;
		height: 0.9rem;
		border-radius: $radius-10;
		color:#fff;
		font-size: $fs-32;
		background-color: $main-color;
		transition: background-color .3s;
	}

	.login-bd .sbmt-btn.disabled{
		background-color:$sub-color;
	}

	.login-bd .code-btn{
		position: relative;
		padding-left: .3rem;
		padding-right: .3rem;
		color:#333;
		font-size: $fs-28;
		&.disabled{
			color:$color-b2;
		}
	}

	.login-bd .code-btn:before{
		content: '';
		position: absolute;
		left:0;
		top:-0.14rem;
		bottom:-0.14rem;
		width: 1px;
		border-left: 1px solid $color-d9;
		background-color: transparent;
	}

	.hairlines .code-btn:before{
		border-width: 0.5px;
	}

	.login-ft{
		margin-top: .32rem;
		text-align: center;
		font-size: $fs-24;
		color:$color-80;
	}

	.login-close{
		position: absolute;
		top:.2rem;
		right:.2rem;

		width:.4rem;
		height: .4rem;

		.click-area{
			position: absolute;
			top: -0.2rem;
			right: -0.2rem;
			bottom: -0.2rem;
			left: -0.2rem;
		}

		&::before,&::after{
			content:'';
			position:absolute;
			top:50%;
			left: 0;
			width:100%;
			height: 1px;
			background-color: $color-80;
			transform-origin: center cnetr;
		}
		&::before{
			transform: rotate(-45deg);
		}
		&::after{
			transform: rotate(45deg);
		}
		.hairlines &::before,.hairlines &::after{
			height: .5px;
		} 
	}
	
	
	.warning em{
		color:#2552ff;
	}

	.inp{
		flex: 1;
		font-size: $fs-32;
		color:#333;
		width: 100%;
	}

	::-webkit-input-placeholder{
		font-size: $fs-32;
		color:$color-80;
	}
</style>