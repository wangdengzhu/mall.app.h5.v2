<template>
	<div class="page-wrapper" v-show="pageIsLoaded">
		<main class="main">
			<article class="article">
				<header class="article__hd">
					<h3 class="article__tit">{{ article.title }}</h3>
					<div class="article__metainfo">
						<!-- <span class="am-ctime">{{ timeFormat(article.createdtime) }}</span> -->
						<span class="am-ctime" v-html="timeFormat(article.createdtime)"></span>
						<span class="am-rcount">阅读({{ article.pv }})</span>
					</div>
				</header>
				<div class="article__cnt" v-html="article.content">

					<!-- <p class="article__cnt-txt"></p> -->
				</div>
			</article>
			<section class="review">
				<div class="review__tit">—— 以上文章对您是否有用 ——</div>
				<div class="review__btns" >
					<template v-if="useFulState == 0">
						<span @click="review(1)" class="review__btn review__btn--useful tb1px">
							<i class="rb-icon"></i>
							<em>有用</em>
						</span>
						<span @click="review(2)" class="review__btn review__btn--unuseful tb1px">
							<i class="rb-icon"></i>
							<em>无用</em>
						</span>
					</template>
					<span v-if="useFulState == 2" class="review__result review__result--useful">
						感谢您的反馈～
					</span>
					<span @click="doCall" v-if="useFulState == 3" class="review__result review__result--unuseful">
						有问题请联系客服
					</span>
				</div>
			</section>
		</main>
		<div class="recommend" v-if="articleArr.length">
			<div class="recommend__hd">文章推荐</div>
			<ul class="recommend__list">
				<li v-for="article in articleArr" class="recommend__item tb1px">
					<a :href="`./detail.html?articleId=${article.articleid}`">{{ article.title }}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import { Academy } from '@/apis';
	import { getQueryParam } from '@/utils/common';
	import Swiper from 'swiper/dist/js/swiper.min';
	import IScroll from 'iscroll/build/iscroll-lite';
	import Toast from '@/components/common/toast';
	import Indicator from '@/components/common/indicator';
	import ConfirmBox from '@/components/common/confirm-box';
	import '@/assets/styles/common';
	import '@/assets/styles/empty.css';
	export default {
		data(){
			return {
				pageIsLoaded: !1,
				articleId: -1,
				article: {},
				useFulState: 0,
				articleArr: [],
				isSubmiting: !1
			}
		},
		methods:{
			timeFormat(time){
				if(!time){
					return '';
				}
				return time.slice(0, time.lastIndexOf(':')).replace(' ','&nbsp;&nbsp');
			},
			review(t){
				if(this.isSubmiting){
					return;
				}
				this.isSubmiting = !0;
				let isUseful = 0;
				if(t === 1){
					isUseful = 1;
					this.useFulState = 2;
				}else if(t === 2){
					this.useFulState = 3;
					this.doCall();
				}
				Academy.recordIsUseful({
					articleid: ~~this.articleId,
					isuseful: isUseful
				});
			},
			doCall() {
				ConfirmBox.open({
					'cnfrmBtnTxt': '呼叫',
					'message': `<p>没有帮助到您？尝试联系客服</p><p>400-8988-111</p>`
				}).then(() => {
					window.location.href = 'tel:400-8988-111';
				}, () => {}).catch((err) => {});
			},
			getRecommendArticle(){
				Academy.getDetailRecommend(this.article.sortid, this.articleId , 1, 3).then(res=>{
					if(res.code !== 1){
						return;
					}
					this.articleArr = res.data;
				}).catch(err=>{
					console.log(err);
				});
			},
			loadArticleData(aid){
				Indicator.show('加载中');
				Academy.getArticleDetail(aid).then(res => {
					Indicator.close();
					if(res.code !== 1){
						return;
					}
					this.pageIsLoaded = !0;
					this.article = res.data;
					this.article.content = this.article.content.replace(/(<img\b.*?)style=".*?"/g,'$1')
					this.useFulState = this.article.v_count;
					this.getRecommendArticle();
				}).catch(err => {
					Indicator.close();
					console.log(err);
				});
			},
			init(){
				const qs = getQueryParam(location.search);
				this.articleId = qs('articleId');
				this.loadArticleData(this.articleId);
				Academy.recordArticlePV(this.articleId);
			}
		},
		mounted(){
			this.init();
		}
	}
</script>

<style>
	@import '../../../assets/styles/mixins.css';
	strong{
		font-weight: bold;
	}
	em, i{
		font-style: italic;
	}
	body{
		/* height: auto; */
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		background-color: #f5f5f5;
	}

	.page-wrapper{
		background-color: #f5f5f5;
	}

	.article{
		padding: 0.32rem;
		color: #666;
		font-size: 0.28rem;
		line-height: 0.48rem;
		background-color: #fff;
	}

	.article__hd{
		margin-bottom: 0.28rem;
		h3{
			color: #333;
			font-size: 0.34rem;
		}

		.article__metainfo{
			display: flex;
			justify-content: space-between;
			margin-top: 0.15rem;
			color: #999;
			font-size: 0.24rem;
			line-height: 0.33rem;
		}
	}
	.article__cnt{
		p{
			word-wrap: break-word;
			word-break: break-all;
		}
		img{
			display: block;
			width: 100%;
			height: 2.8rem;
			margin: 0.24rem 0 0.3rem;
		}
	}
	
	.article__cnt-txt{
		word-wrap: break-word;
		word-break: break-all;
	}
	.article__cnt-pic{
		width: 100%;
		margin: 0.24rem 0 0.32rem;
		img{
			display: block;
			width: 100%;
			height: auto;
		}
	}

	.review{
		margin-top: 0.2rem;
		padding: 0.6rem;
		font-size: 0.3rem;
		line-height: 0.42rem;
		text-align: center;
		background-color: #fff;
	}
	.review__btns{
		display: flex;
		justify-content: center;
		margin-top: 0.32rem;
	}
	.review__btn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.2rem;
		height: 0.8rem;
		border: 1px solid #e5e5e5;
		border-radius: 0.04rem;
		.rb-icon{
			width: 0.42rem;
			height: 0.42rem;
			margin-right: 0.12rem;
			background: url(../../../assets/images/academy/useful.png) 0 0/ contain no-repeat;
		}
	}
	.review__btn--unuseful{
		margin-left: 0.5rem;
	}
	.review__btn--unuseful 	.rb-icon{
		background-image: url(../../../assets/images/academy/unuseful.png);
	}
	.review__result{
		width: 5.4rem;
		height: 0.8rem;
		line-height: 0.8rem;
		font-size: 0.28rem;
		border-radius: 0.04rem;
		border: 1px solid transparent;
	}
	.review__result--useful{
		color: #999;
		background-color: #f5f5f5;
	}
	.review__result--unuseful{
		color: #fff;
		background-color: #49A0FF;
	}
	
	.recommend{
		background-color: #fff;
	}

	.recommend__hd{
		height: 0.88rem;
		line-height: 0.88rem;
		font-size: 0.3rem;
		padding-left: 0.32rem;
		background-color: #f5f5f5; 
	}
	.recommend__item{
		position: relative;
		height: 0.88rem;
		line-height: 0.88rem;
		padding: 0 0.32rem; 
		border-top: 1px solid #e5e5e5;
		&:first-of-type{
			border-top: none;
		}
		&:after{
			content: '';
			position: absolute;
			top: 50%;
			right: 0.3rem;

			width: 8px;
			height: 12px;
			margin-top: -6px;
			background: url(../../../assets/images/academy/icon-arrow.png) 0 0/ contain no-repeat;

		}
	}
	.recommend__item a{
		display: block;
		height: 100%;
		font-size: 0.28rem;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-right: 0.46rem;
	}
	.cnfrmbox-wrap {
		div.cnfrmbox {
			border-radius: .25rem /* 25/100 */;
			div.cnfrmbox-ft {
				height: .88rem;
				line-height: .88rem;
				.btn.cancel-btn,
				.btn.ok-btn {
					color: #007AFF;
					font-size: .34rem /* 34/100 */;
				}
			}
		}
		.bd-message {
			p {
				font-size: .32rem;
				&:first-child {
					margin-bottom: .22rem /* 22/100 */;
					font-size: .34rem /* 34/100 */;
				}
			}
		}
	}
</style>