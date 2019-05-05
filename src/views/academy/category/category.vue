<template>
	<div class="page-wrapper" v-show="pageIsLoaded">
		<header class="header tb1px">
			<div class="mod-nav" id="nav">
				<ul class="mod-nav__list">
					<li @click="activeMenu(idx, cate.sortid, $event)" v-for="(cate, idx) in cateArr" :key="idx" :class="{'mod-nav__item--active': idx == cateActiveIdx}" class="mod-nav__item">{{ cate.title }}</li>
				</ul>
			</div>
		</header>
		<main class="main">
			<div class="list" ref="list" v-loadmore="loadMore" is-enable-scroll="isLoading">
				<ul class="list__box">
					<li @click="callAppArticleNav(article.articleid)" v-for="article in articleArr"  class="list__item">
						<!-- <a :href="`./detail.html?articleId=${article.articleid}`"> -->
							<div  class="list__item-pic">
								<!-- <img :src="article.icon"> -->
								<img :key="article.icon" v-lazy="{src: article.icon,loading: 'https://devimg.manjd.net/default/200-200/2017101.png'
									}">
							</div>
							<div class="list__item-info">
								<div class="list__item-tit">
									<p class="lit-main">{{ article.title }}</p>
									<p class="lit-sub">{{ article.contentview }}</p>
								</div>
								<div class="list__item-meta">
									<span class="lim-ctime">{{ article.createdtime | timeFormat }}</span>
									<span class="lim-rcount">阅读({{ article.pv }})</span>
								</div>
							</div>
						<!-- </a> -->
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
		</main>
	</div>
</template>
<script>
	import { Academy } from '@/apis';
	import { InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
	import Swiper from 'swiper/dist/js/swiper.min';
	import IScroll from 'iscroll/build/iscroll-lite';
	import Toast from '@/components/common/toast';
	import Indicator from '@/components/common/indicator';
	import loadmore from '@/components/common/loadmore';
	import { getQueryParam } from '@/utils/common';
	import '@/assets/styles/common';
	import '@/assets/styles/empty.css';
	export default {
		data(){
			return {
				pageIsLoaded:!1,
				cateActiveIdx: 0,
				curCate: null,
				cateArr: [{
					sortid: -1,
					title: "精选推荐",
					description: "精选推荐",
					isshow: 1,
					icon: "www.baidu.com",
					rank: 2
				}],
				myIScroll: null,

				isLoading: !1,
				isLoadOver: !1,
				isShowMore: !1,
				isIniting: !1,

				page: 1,
				perPage: 10,

				articleArr: []
			}
		},
		methods:{
			activeMenu(idx, sortid, evt) {
				if (this.cateActiveIdx === idx || this.isLoading) {
					return;
				}
				this.$refs.list.scrollTop = 0;
				this.cateActiveIdx = idx;
				this.curCate = this.cateArr[idx];
				this.adjustMenuPos(evt);
				this.initCateArticle();
			},
			adjustMenuPos(evt){
				let selfElem = evt.target,
					menuWrap = selfElem.parentNode.parentNode;

				let menuWrapWidth = menuWrap.clientWidth,
					menuWidth = selfElem.parentNode.clientWidth,
					halfMenuWidth = Math.ceil(menuWrapWidth / 2),
					selfWidth = selfElem.clientWidth,
					selfOffsetLeft = selfElem.offsetLeft,
					maxOffsetLeft = menuWidth - menuWrapWidth;

				if (menuWidth <= menuWrapWidth) {
					return;
				}

				if (selfOffsetLeft <= halfMenuWidth) {
					this.myIScroll.scrollTo(0, 0);
					return;
				}

				if (selfOffsetLeft >= (maxOffsetLeft + halfMenuWidth - 10)) {
					this.myIScroll.scrollTo(-maxOffsetLeft, 0);
				} else {

					this.myIScroll.scrollTo(-(selfOffsetLeft - halfMenuWidth - 20 + selfWidth/2), 0, 300);
				}
			},
			setScrollWrapWidth(){
				let menuList = document.querySelector('.mod-nav__list'),
					menuItems = menuList.querySelectorAll('.mod-nav__item');

				let totalWidth = 0;
				const getStyle = window.getComputedStyle;


				([]).slice.call(menuItems).forEach((item) => {
					let width = parseFloat(getStyle(item, !1).width);
					let marginLeft = parseFloat(getStyle(item, !1).marginLeft);
					totalWidth += Math.ceil(width + marginLeft);
				});

				menuList.style.width = totalWidth + 'px';
				this.menuWidth = totalWidth;
			},
			initIScroll(cb){
				const iScrollOpts = {
					eventPassthrough: !0,
					disablePointer: !0,
					scrollX: !0,
					scrollY: !1,
					bindToWrapper: !0
				};

				this.$nextTick(() => {
					this.setScrollWrapWidth();
					this.myIScroll = new IScroll('#nav', iScrollOpts);
					cb && cb();
				});
			},
			callAppArticleNav(articleId) {
				const isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
				const link = SKIN_DOMAIN + `app/v2/academy/detail.html?articleId=${articleId}`;

				if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.goToSettlementMethod();
                    }); 
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('goToSettlementMethod', link, ()=>{})
                    }); 
                }
			},
			loadMore(){
				if (this.isLoadOver || this.isIniting) {
					return;
				}

				this.isLoading = !0;
				this.page++;

				this.fetchCateArticles().then(res => {
					this.isLoading = !1;
					if(res.code !== 1){
						return;
					}
					const list = res.data;
					this.isLoadOver = list.length < this.perPage;
					this.articleArr.push(...list);
				}).catch(err => {
					this.isLoading = !1;
					console.log(err);
				})
			},
			fetchCateArticles(){
				const sortid = this.curCate.sortid;
				const page = this.page;
				const perPage = this.perPage;
				const t = sortid === -1? 2 : 1;

				return Academy.getRecommend(t, sortid, page, perPage);
			},
			initCateArticle(){
				this.page = 1;
				Indicator.show('加载中');
				this.isShowMore = !1;
				this.isIniting = !0;
				this.fetchCateArticles().then(res => {
					Indicator.close();
					this.isIniting = !1;
					if(res.code !== 1){
						return;
					}
					const list = res.data;
					this.isShowMore = !0;
					this.isLoadOver = list.length < this.perPage;
					this.articleArr = list;
				}).catch(err => {
					Indicator.close();
					this.isIniting = !1;
					console.log(err);
				})
			},
			loadCateData(){
				const qs = getQueryParam(location.search);
				const sortid = qs('sortid');
				Indicator.show('加载中');
				Academy.getCate(1, 100).then(res=>{
					Indicator.close()
					if(res.code !== 1){
						return;
					}
					this.pageIsLoaded = !0;
					this.cateArr.push(...res.data);
					const idx = this.cateArr.findIndex(cate => cate.sortid == sortid);
					this.cateActiveIdx = idx > -1 ? idx : 0;
					this.curCate = this.cateArr[this.cateActiveIdx];
					this.initIScroll(() => {
						this.myIScroll.scrollToElement(document.getElementsByClassName('mod-nav__item')[idx]);
					});
					this.initCateArticle();
				}).catch(err=>{
					Indicator.close()
					console.log(err);
				});	
			},
			init(){
				this.loadCateData();
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

	.loading-container{
		padding-bottom: 0;
		margin-top: 0.4rem; 
	}

	/********  头部  ********/
	.header{
		position: fixed;
		top: 0;
		z-index: 1001;
		width: 100%;
		height: 0.72rem;
		border-bottom: 1px solid #e5e5e5;
		font-size: 0.28rem;
		background-color: #fff;
	}

	.mod-nav{
		position: relative;
		height: 0.72rem;
		margin-left: 0.32rem;
		margin-right:0.32rem;
		white-space: nowrap;
		-webkit-overflow-scrolling: touch;
	}

	.mod-nav__list{
		position: relative;
		height: 100%;
	}

	.mod-nav__item{
		display: inline-block;
		height: 0.72rem;
		line-height: 0.76rem;
		color:#4d4d4d;
		box-sizing: border-box;
		border-bottom:0.04rem solid transparent;

		&:not(:first-of-type){
			margin-left: 0.54rem;
		}
	}

	.mod-nav__item--active{
		color:$main-color;
		transition: border-color .3s;
		border-bottom-color:currentColor;
	}

	/********  内容  ********/

	.main{
		position: absolute;
		top: 0.72rem;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.list{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		padding: 0.3rem 0.32rem;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch; 
	}

	.list__item{
		display: flex;
		margin-top: 0.4rem;
		&:first-of-type{
			margin-top:0;
		}
		a{
			display: flex;
			width: 100%;
		}
	}
	
	.list__item-pic{
		width: 2.0rem;
		height: 2.0rem;
		margin-right: 0.24rem;
		img{
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	.list__item-info{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
		width: 1%;
		font-size: 0.26rem;

		.lit-main{
			overflow : hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			line-height: 0.36rem;
		}

		.list__item-tit{

		}

		.lit-sub{
			margin-top: 0.24rem;
			line-height: 0.3rem;
			color: #999;
			font-size: 0.22rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.list__item-meta{
			display: flex;
			justify-content: space-between;
			color: #999;
			font-size: 0.22rem;
			/*margin-top: 0.44rem;*/
			line-height: 0.3rem;
		}

		.lim-ctime{
			
		}
	}
</style>