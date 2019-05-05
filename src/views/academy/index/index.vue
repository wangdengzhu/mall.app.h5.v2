<template>
	<div class="page-wrapper" v-loadmore="loadMore" is-enable-scroll="isLoading">
		<template v-if="!pageIsLoaded">
			<div class="skeleton"></div>
		</template>
		<template v-else> 
			<section class="banner" @click="bannerNav">
				<div class="swiper-container" v-if="indexBanner.length">
					<div class="swiper-wrapper">
						<div  class="swiper-slide" v-for="item in indexBanner">
							<img  class="swiper-image" :src="item.content" >
						</div>
					</div>
					<div class="swiper-pagination"></div>
				</div>
			</section>
			<main class="main">
				<section class="menu">
					<ul class="menu__list">
						<li v-for="cate in cateArr" :key="cate.sortid" class="menu__item">
							<!-- <a :href="`./category.html?sortid=${cate.sortid}`">
								<img class="mi-icon" :src="cate.icon" >
								<span class="mi-tit">{{ cate.title }}</span>
							</a> -->
							<a href="javascript:;" @click.prevent='callAppCateNav(cate.sortid)'>
								<img class="mi-icon" :src="cate.icon" >
								<span class="mi-tit">{{ cate.title }}</span>
							</a>
						</li>					
					</ul>
				</section>
				<section class="section recommend">
					<div class="section__hd">
						<span class="sh-tit">精选推荐</span>
						<!-- <a href="./category.html?sortid=-1"><span class="sh-more">更多</span></a> -->
						<a @click.prevent='callAppCateNav(-1)' href="javascript:;"><span class="sh-more">更多</span></a>
					</div>
					<div class="section__cnt">
						<div class="recommend__list">
							<ul class="recommend__box">
								<li v-for="recommend in recommendArr" :key="recommend.sortid" class="recommend__item">
									<!-- <a :href="`./detail.html?articleId=${recommend.articleid}`">
										<div class="ri-pic">
											<img :src="recommend.topicon" >
										</div>
										<div class="ri-tip">
											<span>{{ recommend.title }}</span>
										</div>
									</a> -->
									<a href="javascript:;" @click.prevent="callAppArticleNav(recommend.articleid)">
										<div class="ri-pic">
											<img :src="recommend.topicon" >
										</div>
										<div class="ri-tip">
											<span>{{ recommend.title }}</span>
										</div>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</section>
				<section class="section other" v-if="rndRecommendArr.length">
					<div class="section__hd">
						<span class="sh-tit">{{ recommendCate.title }}</span>
					</div>
					<div class="section__cnt">
						<div class="other__list">
							<ul class="other__box">
								<li v-for="article in rndRecommendArr" :key="article.articleid" class="other__item">
									<!-- <a :href="`./detail.html?articleId=${article.articleid}`">
										<div class="oi__pic">
											<img v-lazy="{src: article.icon,loading: lazyImg}">
										</div>
										<div class="oi__info">
											<div class="oi__info-tit">
												<p class="oit-main">{{ article.title }}</p>
												<p class="oit-sub">{{ article.contentview }}</p>
											</div>
											<div class="oi__info-meta">
												<span class="oim-ctime" v-html="timeFormat1(article.createdtime )"></span>
												<span class="oim-rcount">阅读({{ article.pv }})</span>
											</div>
										</div>
									</a> -->
									<a @click.prevent="callAppArticleNav(article.articleid)" >
										<div class="oi__pic">
											<img v-lazy="{src: article.icon,loading: lazyImg}">
										</div>
										<div class="oi__info">
											<div class="oi__info-tit">
												<p class="oit-main">{{ article.title }}</p>
												<p class="oit-sub">{{ article.contentview }}</p>
											</div>
											<div class="oi__info-meta">
												<span class="oim-ctime" v-html="timeFormat1(article.createdtime )"></span>
												<span class="oim-rcount">阅读({{ article.pv }})</span>
											</div>
										</div>
									</a>
								</li>
							</ul>
							<div class="loading-container" v-if="isShowMore">
								<template v-if="!isLoadOver">
									<span class="loading-icon"></span>
									<span class="loading-txt">加载中...</span>
								</template>
								<template v-else>
									<span class="loading-txt">没有更多文章了</span>
								</template>
							</div>
						</div>
					</div>
				</section>
			</main>
		</template>
	</div>
</template>

<script>
	import { Academy } from '@/apis';
	import { InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
	import Swiper from 'swiper/dist/js/swiper.min';
	import Toast from '@/components/common/toast';
	import Indicator from '@/components/common/indicator';
	import loadmore from '@/components/common/loadmore';
	import '@/assets/styles/swiper.css';
	import '@/assets/styles/common';
	import '@/assets/styles/empty.css';
	export default {
		data(){
			return {
				pageIsLoaded: !1,
				swiperOpts: {
					loop: true,
					pagination: {
						el: '.swiper-pagination'
					},
					autoplay: {
						delay: 5000,
						disableOnInteraction: !0
					}
				},
				lazyImg: IMAGE_DEFAULT_OBJ.I_200,
				indexBanner:[],// banner
				mySwiper: null,

				cateArr: [], // 分类
				recommendArr: [], // 推荐文章
				recommendCate: {},// 当前随机分类
				rndRecommendArr: [], // 当前随机分类文章

				isLoading: !1,
				page: 1,
				perPage: 10,
				isLoadOver: !1,
				isShowMore: !1
			}
		},
		methods:{
			timeFormat1(time){
				if(!time){
					return '';
				}

				return time.slice(0, time.lastIndexOf(':')).replace(' ','&nbsp;&nbsp');

			},
			bannerNav(){
				const self = this;
				const bannerIdx = this.mySwiper.realIndex;
				const banner = this.indexBanner[bannerIdx];
				const bannerId = banner.bannerid;
				const navLink = banner.url;
				Academy.recordBannerHit(bannerId).then(res => {
					toNavURL();
				}).catch(err => {
					toNavURL();
				});

				function toNavURL(){
					// const link = banner.type == 1 ? navLink : `./detail.html?articleId=${navLink}`;
					const link = banner.type == 1 ? navLink : `${SKIN_DOMAIN}app/v2/academy/detail.html?articleId=${navLink}`;
					// window.location.assign(link);
					self.openNewebview(link);
				}
				
			},
			callAppArticleNav(articleId) {
				const link = `${SKIN_DOMAIN}app/v2/academy/detail.html?articleId=${articleId}`;

				this.openNewebview(link);
			},
			callAppCateNav(cateId){
				const link = `${SKIN_DOMAIN}app/v2/academy/category.html?sortid=${cateId}`;
				this.openNewebview(link);
			},
			openNewebview(url) {
				const isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
				if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.goToSettlementMethod(url);
                    }); 
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('goToSettlementMethod', url, ()=>{})
                    }); 
                }
			},
			initSwiper(){
				const opts = this.indexBanner.length > 1? this.swiperOpts : {};
				this.$nextTick(()=>{
					this.mySwiper = new Swiper('.swiper-container', opts);
				});
			},
			fetchCateArticles(t){
				const sortid = this.recommendCate.sortid;
				const page = this.page;
				const perPage = this.perPage;

				return Academy.getRecommend(t, sortid, page, perPage);
			},
			loadMore(){
				if(this.isLoadOver){
					return;
				}

				this.page++;
				this.isLoading = !0;
				this.fetchCateArticles(4).then(res=>{
					this.isLoading = !1;
					if(res.code !== 1){
						return;
					}
					const list = res.data;
					this.isLoadOver = list.length < this.perPage;
					this.rndRecommendArr.push(...list);
				}).catch(err=>{
					this.isLoading = !1;
					console.log(err);
				});
			},
			initRndArticle(cateArr){
				const cate = cateArr.find(cate => cate.isshow === 1);
				this.recommendCate = cate;
				this.page = 1;
				this.fetchCateArticles(4).then(res=>{
					if(res.code !== 1){
						return;
					}
					const list = res.data;
					this.isShowMore = !0;
					this.isLoadOver = list.length < this.perPage;
					this.rndRecommendArr = list;
				}).catch(err=>{
					console.log(err);
				});
			},
			setIndexData(res){
				this.indexBanner = res[0].data;
				this.cateArr = res[1].data.slice(0, -1);
				this.recommendArr = res[2].data;
				this.initRndArticle(res[1].data);
				this.initSwiper();
			},
			loadIndexData(){
				Promise.all([Academy.getBanner(), Academy.getCate(), Academy.getRecommend()]).then(res => {
					if (res[0].code !== 1 || res[1].code !== 1 || res[2].code !== 1) {
						return;
					}
					this.pageIsLoaded = !0;
					this.setIndexData(res);
				}).catch(err => {
					console.log(err);
				});
			},
			init(){
				this.loadIndexData();
			}
		},
		filters:{
			timeFormat(time){
				return time.slice(0, time.lastIndexOf(':'));
			}
		},
		directives:{
			loadmore
		},
		mounted(){
			this.init();
		}
	}
</script>

<style>
	@import '../../../assets/styles/mixins.css';
	.swiper-container{
		.swiper-pagination-bullet{
			width: 6px;
			height: 6px;
			background-color: #ccc;
			opacity: 1;
		}
		.swiper-pagination-bullet-active{
			background-color: #ff681d;
		}
	}

	.swiper-pagination-bullets{
		font-size: 0;
		bottom: 8px !important;
	}

	.swiper-container{
		width: 100%;
		height: 3.3rem;
		.swiper-image{
			display: block;
			width: 100%;
			height: auto;
		}
	}

	.page-wrapper{
		height: 100%;
		overflow-y: auto;
	}

	.skeleton{
		width: 100%;
		height: 100%;
		background: url(../../../assets/images/academy/academy-bg.png) center top/7.5rem 19.36rem no-repeat;
	}

	.main{
		padding: 0 0.32rem;
		background-color: #fff;
		font-size: 0.28rem;
	}

	.menu{
		padding: 0.38rem 0 0.4rem;
	}

	.recommend:before{
		content:'';
		display: block;
		height: 0.2rem;
		margin-left: -0.32rem;
		margin-right: -0.32rem;
		background-color: #f5f5f5;
	}

	.menu__list{
		display: flex;
		justify-content: space-between;
	}

	.menu__item{
		display: flex;
		/*flex-direction: column;
		justify-content: center;
		align-items: center;*/
		flex: 1;
		width: 1%;
		/*width: 1.5rem;
		height: 1.6rem;
		border-radius: 0.08rem;
		background-color: #f5f5f5;*/

		a{
			display: flex;
			width: 100%;
			flex-direction: column;
			align-items: center;
			/*justify-content: center;*/
		}

		.mi-icon{
			width: 0.76rem;
			height: 0.76rem;
			/*border-radius: 50%;*/
			/*background-color: purple;*/
		}

		.mi-tit{
			width: 100%;
			margin-top: 0.12rem;
			color: #333;
			font-size: 0.24rem;
			line-height: 0.33rem;
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.section__hd{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 1.1rem;
		.sh-tit{
			position: relative;
			padding-left: 0.18rem;
			font-size: 0.3rem;
			color: #333;
			line-height: 0.42rem;
			&:before{
				content:'';
				position: absolute;
				left: 0;
				top: 50%;
				width: 0.06rem;
				height: 0.28rem;
				border-radius: 4px;
				background-color: $main-color;
				transform: translateY(-50%);
			}
		}

		.sh-more{
			position: relative;
			padding-right: 0.27rem;
			line-height: 0.4rem;

			&:after{
				content:'';
				position: absolute;
				top: 50%;
				right: 0;
				width: 8px;
				height: 13px;
				background: url(../../../assets/images/academy/icon-arrow-new.png) 0 0/ contain no-repeat;
				transform: translateY(-53%);
			}
		}
	}
	.recommend__box{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: -0.3rem;
	}
	.recommend__item{
		position: relative;
		width: 3.28rem;
		height: 2.0rem;
		margin-top: 0.3rem;
		font-size: 0.26rem;

		a{
			display: block;
			width: 100%;
			height: 100%;
			color: #fff;
		}

		.ri-pic{
			width: 100%;
			height: 100%;

			img{
				display: block;
				width: 100%;
				height: 100%;
			}
		}
		
		.ri-tip{
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			height: 0.48rem;
			line-height: 0.48rem;
			color: #fff;
			font-size: 0.24rem;
			text-align: center;
			background-color: rgba(0,0,0,.3);

			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.other__item{
		display: flex;
		margin-bottom: 0.4rem;
		a{
			display: flex;
			width: 100%;
			color: #333;
		}
	}
	.oi__pic{
		width: 2.0rem;
		height: 2.0rem;
		margin-right: 0.24rem;
		img{
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.oi__info{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		width: 1%;

		.oit-main{
			display: -webkit-box;
			overflow : hidden;
			text-overflow: ellipsis;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;
			line-height: 0.36rem;
		}

		.oit-sub{
			margin-top: 0.24rem;
			line-height: 0.3rem;
			color: #999;
			font-size: 0.22rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.oi__info-meta{
		display: flex;
			justify-content: space-between;
			color: #999;
			font-size: 0.22rem;
			/*margin-top: 0.44rem;*/
			line-height: 0.3rem;
	}
</style>