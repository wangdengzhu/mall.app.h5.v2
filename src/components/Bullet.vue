<template>
	<div>
		<transition name="bullet"  @after-enter="afterEnter" @after-leave="afterLeave">
			<div v-show="isShowBullet" class="bullet-screen" v-bind:style="{'top': top,'left': left}">
				<span>{{bulletList[0]}}</span>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				isShowBullet: !1,
				bulletInterval: 1,
				bulletList: [],
				timer: null,
        afterTimer: null
			}
		},
		props:{
			bullets: {
				type: Object
			},
			paused: {
				type: Boolean,
				default: !1
      },
      top:{
        type: String,
        default: '0.6rem'
			},
			left:{
        type: String,
			}
		},
		methods: {
			bulletEnter(el, done){
				el.classList.add('bullet-enter-active');
				setTimeout(()=>{
					this.isShowBullet = !1;
					el.classList.remove('bullet-enter-active');
					setTimeout(()=>{
						this.isShowBullet = !0;
					},500);
				},2000);
			},
			afterEnter(){
				this.afterTimer = setTimeout(() => {
					this.isShowBullet = !1;
				}, 2000);
			},
			afterLeave(){
				this.bulletList.shift();
				if(this.bulletList.length<=0 || this.paused){
					return;
				}
				this.showBullet();
			},
			showBullet(){
				if(this.timer){
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					this.isShowBullet = !0;
				}, this.bulletInterval * 1000);
			}
		},
		watch:{
			bullets(val){
				this.bulletInterval = val.frequency;
				this.bulletList = val.msglist;
				if (this.bulletList.length > 0) {
					this.showBullet();
				}
			},
			paused(isPaused){
				if(isPaused){
					this.isShowBullet = !1;
					clearTimeout(this.timer);
					clearTimeout(this.afterTimer);
				}else{
					this.showBullet();
				}
			}
		}
	}
</script>

<style scoped>
	.bullet-screen{
		position: absolute;
		left: 0.32rem;
		top: 0.6rem;
		height: 0.54rem;
		line-height: 0.56rem;
		max-width: 4rem;
		padding: 0 0.3rem;
		border-radius: 0.06rem;
		color: #fff;
		font-size: 0.24rem;
		text-align: center;
		background-image: linear-gradient(90deg, #FF8C00 0, #FF5400 100% );
		z-index: 2000;
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		opacity: 0.8;
	}

	.bullet-enter-active{
		opacity: 0.8;
		transform: translate3d(0, 0, 0);
		transition: all .5s ease-in-out;
	}
	.bullet-enter{
		opacity: 0;
		transform: translate3d(0, 150%, 0);
	}

	.bullet-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	.bullet-leave-to{
		opacity: 0;
		transform: translate3d(0, -100%, 0);
	}

	/*.bullet-enter-active{
		animation: bullet 2s linear forwards;
	}*/

	@keyframes bullet{
		0%{
			opacity: 0;
			transform: translate3d(0, 150%, 0);
		}

		25%{
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}

		75%{
			opacity: 1;
			transform: translate3d(0, 0, 0);
		}

		100%{
			opacity: 0;
			transform: translate3d(0, -100%, 0);
		}
	}
</style>