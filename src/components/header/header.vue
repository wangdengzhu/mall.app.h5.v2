<template>
	<header class="header tb1px">
		<div class="mod-search" @click="redirect('/search')" v-if="isWXEnv">
			<div @click.stop="$router.back()" class="header-back"></div>
			<form class="mod-search__form">
				<i class="search-icon"></i>
				<input class="mod-search__inp" readonly type="search" placeholder="请输入商品名称">
			</form>
			<span class="mod-search__btn mod-search__btn--disabled">搜索</span>
		</div>
		<div class="mod-title" v-else>
			<div @click="$router.back()" class="header-back"></div>
			<span>{{ title }}</span>
			<i @click="redirect('/search')" class="mod-title__icon"></i>
		</div>
	</header>
</template>

<script>
	import { isWXBrowser } from '@/utils/common';
	export default {
		data(){
			return {
				isWXEnv: !1
			}
		},
		props:['title'],
		mounted(){
			this.isWXEnv = isWXBrowser;
		}
	}
</script>

<style scoped>
	@import '../../assets/styles/mixins.css';
	.header{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1001;
		height: 0.88rem;
		background-color: #fff;

		border-bottom: 1px solid $color-d9;
		font-size: $fs-36;
		overflow: hidden;

		.header-back{
			position: relative;
			width: 1.06rem;
			height: 100%;
			background: url(../../assets/images/nav_back_icon@2x.png) left center/0.16rem  0.36rem  no-repeat;
		}

		.header-back:before{
			content:'';
			position: absolute;
			top: 0;
			right: 0;
			width: 2rem;
			height: 100%;
		}

		.mod-title,.mod-search{
			position: relative;
			height: 100%; 

			display: flex;
			align-items: center;
			justify-content: space-between;

			padding: 0 0.32rem;
			
		}

		.mod-search{
			font-size: 0.28rem;
			background-color: #fafafa;

			.header-back{
				width: 0.54rem;
			}
		}

		.mod-title__icon{
			width: 1.06rem;
			height: 100%;
			background: url(../../assets/images/shop/icon-search.png) center right/0.4rem 0.4rem no-repeat transparent;
		}

		.mod-search__form{
			position: relative;
			display: flex;
			align-items: center;
			flex:1;
			padding: 0 0.26rem 0 0.68rem;
			background-color: #ededed;
			border-radius: $radius-10;		
			.search-icon {
				position: absolute;
				top: 0;
				left: 0;
				width: 0.68rem;
				height: 100%;
				background: url(../../assets/images/icon-small-search.png) center center/0.28rem 0.28rem no-repeat;
			}
			.mod-search__inp{
				flex:1;				
				display: block;
				width: 100%;
				height: 0.4rem;
				padding: 0.12rem 0;
				font-size: $fs-28;
				color:$333;
				background-color: transparent;
				box-sizing: content-box;
				&::-webkit-input-placeholder{
					font-size: $fs-28;
					color:#b3b3b3;
				}
			}
		}

		/* .mod-search__inp{		
			flex:1;		
			display: block;
			width: 100%;
			height: 0.4rem;
			padding: 0.1rem 0;
			font-size: $fs-28;
			color:#b3b3b3;
			box-sizing: content-box;
			
			&::-webkit-input-placeholder{
				font-size: $fs-28;
				color:#b3b3b3;
			}
		} */

		.mod-search__btn--disabled{
			line-height: 0.64rem;
			margin-left: 0.32rem;
		}

		.mod-search__btn--disabled{
			color:#999;
		}
	}
</style>