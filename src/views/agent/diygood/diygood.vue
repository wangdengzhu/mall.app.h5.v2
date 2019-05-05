<template>
    <div class="wrapper"> 
        <div class="self-top">
            <h3>上架自有商品</h3>
            <h2>想卖就卖</h2>
            <img src="../../../assets/images/agent/rectangle.png">
            <p>有好货，没有畅销渠道？</p>
            <p>开启网络分销，订单暴涨！</p>
        </div>
        <div class="self-what">
            <h3>什么是自有商品</h3>
            <p>您自主生产的新鲜食品、手工艺品或当地特色商品都可上架店铺销售</p>
            <ul>
                <li>
                    <img src="../../../assets/images/agent/selficon1.png">
                    <p>新鲜水果</p>
                </li>
                <li>
                    <img src="../../../assets/images/agent/selficon2.png">
                    <p>手工艺品</p>
                </li>
                <li>
                    <img src="../../../assets/images/agent/selficon3.png">
                    <p>地方特产</p>
                </li>
            </ul>
        </div>
        <a class="agent-sure" @click="addGoods">
            立即添加商品
        </a>
    </div>
</template>

<script>
    import { getQueryParam, throttle ,InitBridge, setupWebViewJavascriptBridge} from '@/utils/common';
    import '@/assets/styles/common';
    import Toast from '@/components/common/toast';
    
    export default {
        data(){
            return {
            }
        },
        methods: {
            addGoods(){
                if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.addOwnGoods();
                    }); 
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('addDiyGoodsMethod',()=>{})
                    }); 
                }
            }
        },
        mounted(){
            this.isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
        }
    }
</script>
<style scoped>

    .self-what{
        width:5.9rem;
        height:4.3rem;
        padding:0.4rem 0.5rem;
        background: url(../../../assets/images/agent/bg-white.png) center 0/ contain no-repeat;
        background-size:100%;
        font-size:0.3rem;
        color:#666;
        display:flex;
        flex-direction:column;
        align-items: center;
        position:absolute;
        top:4.63rem;
        left:0.3rem;
    }
    .self-what h3{
        font-size:0.36rem;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:0.5rem;
        margin-bottom:0.2rem;
        color:#333;
    }
    .self-what p{
        width:4.93rem;
        height:0.84rem;
        font-size:0.30rem;
        font-family:PingFangSC-Light;
        font-weight:300;
        color:rgba(102,102,102,1);
        line-height:0.42rem;
        letter-spacing:0.01rem;
        margin-bottom:0.7rem;
        padding-left:0.2rem;
    }
    .self-what ul{
        width:100%;
        display:flex;
        flex-direction:row;
        justify-content: space-between;
        color:#333;
    }
    .self-what ul li{
        width:1.38rem;
    }
    .self-what ul li p{
        font-size:0.26rem;
    }
    .self-what ul li img{
        width:1.38rem;
        height:1.38rem;
        margin-bottom:0.15rem;
    }
    .wrapper{
        width:100%;
        height:100%;
        background:#FFEEDF;
        font-family:PingFangSC-Light;
        position:relative;
        overflow:hidden;
    }
    .self-top{
        width:7.5rem;
        height:5.11rem;
        padding-top:0.69rem;
        background: url(../../../assets/images/agent/selfbg.png) center 0/ contain no-repeat;
        background-size:100%;
        font-size:0.3rem;
        color:#6E2C0B;
        display:flex;
        flex-direction:column;
        align-items: center;
    }
    .self-top h3{
        font-size:0.64rem;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(110,44,11,1);
    }
    .self-top h2{
        font-size:0.9rem;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,104,29,1);
        line-height:1.26rem;
    }
    .self-top img{
        width: 0.22rem;
        height:0.1rem;
        margin-top:0.2rem;
        margin-bottom:0.15rem;
    }
    .self-top p{
        line-height:0.44rem;
    }
    .agent-agree{
        display:inline-block;
        width:0.26rem;
        height:0.26rem;
        border:0.02rem solid #ccc;
        border-radius:1rem;
        position:absolute;
        left:1.43rem;
        top:0.02rem;
    }
     .agent-agree:checked{
        width:0.28rem;
        height:0.28rem;
        background: url(../../../assets/images/agent/checked-o.png) 0 0/ cover;
        position:absolute;
        left:1.43rem;
        top:0.02rem;
    }
    .agent-ft{
        width:100%;
        text-align:center;
        font-size:0.26rem;
        float:left;
        position:fixed;
        bottom:1.35rem;
    }
    .agent-ft a{
        color:#4D7BFE;
    }
    .agent-sure{
        width:100%;
        text-align:center;
        background:#FF681D;
        color:#fff;
        height:1rem;
        line-height:1rem;
        left:0;
        bottom:0;
        position:fixed;
        font-size:0.34rem;
        font-family:PingFangSC-Regular;
    }
</style>
