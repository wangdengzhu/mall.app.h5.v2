<template>
	<div class="agreement-wrapper">
		<div class="tit">
			<h2>合作协议书</h2>
		</div>
		<p>
			甲方(邀请人)：{{agreeJia.storeName}}<span>(ID:{{agreeJia.storeId}})</span>
		</p>
		<p >
			乙方(被邀请人)：{{agreeYi.storeName}}<span>(ID:{{agreeYi.storeId}})</span>
		</p>        
		<p class="top">
			甲乙双方依据国家相关法律、法规，本着互惠互利、共同发展、自愿平等的原则，经好友协商就乙方为甲方提供推广服务达到如下条款，以资共同遵守：
		</p>
		<p class="para">一、合作方式</p>
		<p>乙方通过自有的社交平台将甲方产品信息向外界推广宣传，买家通过乙方的推广链接购买产品后，由甲方将产品直接发送至买家。</p>
		<p class="para">二、合作期限</p>
		<p>甲乙双方自行协商确定。</p>
		<p class="para">三、推广服务费</p>
		<p>甲乙双方根据不同情形协商确定推广服务费。</p>
		<p class="para">四、双方权利义务</p>
		<p>甲方、乙方一致同意双方权利义务按《满金店平台协议》有关规定执行。</p>
		<p class="para">五、违约责任</p>
		<p>甲乙双方应严格按本协议的约定履行各自的义务，如违反相关义务的，违约方应当承担违约责任。</p>
		<p class="para">六、争议解决</p>
		<p>若因履行合作协议发生争执的，甲乙双方应通过友好协商解决；协商不成的，可以向有管辖权的法院提起诉讼。</p>
	</div>
</template>
<script>
	import { Agent } from '@/apis/';    
    export default {
        data(){
            return {
				agreeJia: [],
				agreeYi: []
            }
        },
        methods: {
            getName(){
				let shopid = localStorage.getItem('shopId');
				console.log(shopid)
                Agent.agentAgree(shopid).then((res) => {
					this.agreeJia = res.data[1]
					this.agreeYi = res.data[0]
                }).catch((err)=>{

                });
            }

        },
        mounted(){
            this.getName()
        }
    }
</script>
<style scoped>
	.agreement-wrapper{
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		padding: 0.35rem;
		font-size: 0.26rem;
		line-height: 0.37rem;
		color:#333;
		overflow-x: hidden;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		background-color: #fff;
	}
	.tit{
		margin-bottom: 0.2rem;
	}
	h2{
		font-weight: 500;
		color:#333;
		font-size:0.34rem;
	}
	p{
		color:#666;
		margin: .1em 0;
	}
	p.para{
		margin-top:0.4rem;
	}
	p.top{
		margin-top:0.3rem;
	}
	p span{
		color:#666;
		margin-left:0.1rem;
	}
</style>