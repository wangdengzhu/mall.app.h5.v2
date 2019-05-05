<template>
    <div class="wrapper"> 
        <div class="self-top">
            <h3>精选特色商品代理</h3>
            <h2>成交就有收益</h2>
            <img src="../../../assets/images/agent/tangletwo.png">
            <h4>代理商品有哪些好处</h4>
            <p>您可同时代理多款商品，获得多份收益 精准推广渠道帮您完成更多订单</p>
        </div>
        <div class="self-what">
            <img class="two1" src="../../../assets/images/agent/two1.png">
            <img class="two2" src="../../../assets/images/agent/two2.png">
            <img class="two3" src="../../../assets/images/agent/two3.png">
        </div>
    </div>
</template>

<script>
    import { getQueryParam, throttle ,InitBridge, setupWebViewJavascriptBridge} from '@/utils/common';
    import '@/assets/styles/common';
    import Toast from '@/components/common/toast';
    
    export default {
        data(){
            return {
                agentAgree:'true'
            }
        },
        methods: {
            invite(){
                if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.showSharedDialogForShareStore();
                    }); 
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('showSharedStoreMethod',()=>{})
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
        width:6.9rem;
        height:100%;
        margin-left:0.3rem;
        margin-right:0.3rem;
        padding-top:0.2rem;
        padding-bottom:0.66rem;
        display:flex;
        flex-direction:column;
    }
    .two1{
        width:6.9rem;
        height:1.56rem;
        float: left;
    }
    .two2{
        width:6.9rem;
        height:6.47rem;
        float: left;
    }
    .two3{
        width:6.9rem;
        height:6.63rem;
        float: left;
    }
    .wrapper{
        width:100%;
        background:#FFEEDF;
        font-family:PingFangSC-Light;
    }
    .self-top{
        width:7.5rem;
        height:4.71rem;
        padding-top:0.69rem;
        background: url(../../../assets/images/agent/twobg.png) center 0/ contain no-repeat;
        background-size:100%;
        font-size:0.3rem;
        color:#6E2C0B;
        display:flex;
        flex-direction:column;
        align-items: center;
    }
    .self-top h4{
        font-size:0.36rem;
        font-family:PingFangSC-Semibold;
        font-weight:500;
        color:rgba(51,51,51,1);
        line-height:50px;
    }
    .self-top h3{
        font-size:0.56rem;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(110,44,11,1);
    }
    .self-top h2{
        font-size:0.7rem;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,104,29,1);
        line-height:1.26rem;
    }
    .self-top img{
        width: 0.22rem;
        height:0.24rem;
        margin-top:0.3rem;
        margin-bottom:0.3rem;
    }
    .self-top p{
        width:5.6rem;
        font-size:0.3rem;
        font-family:PingFangSC-Light;
        font-weight:300;
        color:rgba(102,102,102,1);
        line-height:0.42rem;
        letter-spacing:0.01rem;
        text-align:center;
    }
</style>
