<template>
	<transition name="indicator-fade">
		<div v-show="visible" class="indicator-overlay">
			<div class="loading">
				<div class="loading-box">
					<i class="fade-item fade-item1"></i>
					<i class="fade-item fade-item2"></i>
					<i class="fade-item fade-item3"></i>
					<i class="fade-item fade-item4"></i>
					<i class="fade-item fade-item5"></i>
					<i class="fade-item fade-item6"></i>
					<i class="fade-item fade-item7"></i>
					<i class="fade-item fade-item8"></i>
					<i class="fade-item fade-item9"></i>
					<i class="fade-item fade-item10"></i>
					<i class="fade-item fade-item11"></i>
					<i class="fade-item fade-item12"></i>
				</div>
			</div>
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
			title:{
				type:String,
				default:''
			}
		}
	}
</script>

<style scoped>
.indicator-overlay{
	position: fixed;
	top:0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 99999;
}
	/* loading */
.loading {
  width: .9rem;
  height: .9rem;
}
.loading .loading-box { 
  position: relative;
  width: .9rem;
  height: .9rem;
  background-color: rgba(0,0,0,.6);
  border-radius: .1rem;
}
.loading .loading-box .fade-item {
  position: absolute;
  top: 0;
  left: 0;
  width: .5rem;
  height: .5rem;
  margin:.2rem 0px 0px .2rem;
}
.loading .loading-box .fade-item:before{
  content: "";
  display: block;
  margin: 0 auto;
  width: .04rem;
  height: .12rem;
  background-color: #fff;
  border-radius: .04rem;
}
.loading .loading-box .fade-item2{
  transform: rotate(30deg);
} 
.loading .loading-box .fade-item3{
  transform: rotate(60deg);
} 
.loading .loading-box .fade-item4{
  transform: rotate(90deg);
} 
.loading .loading-box .fade-item5{
  transform: rotate(120deg);
} 
.loading .loading-box .fade-item6{
  transform: rotate(150deg);
} 
.loading .loading-box .fade-item7{
  transform: rotate(180deg);
} 
.loading .loading-box .fade-item8{
  transform: rotate(210deg);
} 
.loading .loading-box .fade-item9{
  transform: rotate(240deg);
} 
.loading .loading-box .fade-item10{
  transform: rotate(270deg);
} 
.loading .loading-box .fade-item11{
  transform: rotate(300deg);
} 
.loading .loading-box .fade-item12{
  transform: rotate(330deg);
} 
.loading .loading-box .fade-item:before{
  animation: fadeDelay 1.2s infinite ease-in-out both;
}
.loading .loading-box .fade-item2:before{
  animation-delay: -1.1s;
}
.loading .loading-box .fade-item3:before{
  animation-delay: -1s;
}
.loading .loading-box .fade-item4:before{
  animation-delay: -0.9s;
}
.loading .loading-box .fade-item5:before{
  animation-delay: -0.8s;
}
.loading .loading-box .fade-item6:before{
  animation-delay: -0.7s;
}
.loading .loading-box .fade-item7:before{
  animation-delay: -0.6s;
}
.loading .loading-box .fade-item8:before{
  animation-delay: -0.5s;
}
.loading .loading-box .fade-item9:before{
  animation-delay: -0.4s;
}
.loading .loading-box .fade-item10:before{
  animation-delay: -0.3s;
}
.loading .loading-box .fade-item11:before{
  animation-delay: -0.2s;
}
.loading .loading-box .fade-item12:before{
  animation-delay: -0.1s;
}
@keyframes fadeDelay{
  0%, 39%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}
@-webkit-keyframes fadeDelay{
  0%, 39%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}
</style>

