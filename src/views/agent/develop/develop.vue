<template>
    <div class="wrapper"> 
        <div class="self-top">
            <h3>邀请代理分销</h3>
            <h2>好货不愁卖</h2>
            <img src="../../../assets/images/agent/rectangle.png">
            <p>客源受限，商品难卖？</p>
            <p>招募代理，快速成交订单！</p>
        </div>
        <div class="self-what">
            <h3>什么是代理</h3>
            <p>代理可以帮助您销售店铺商品，共享社交资源，助力商品快速脱销</p>
            <ul class="new-set">
                <li>
                    <img src="../../../assets/images/agent/icon_single.png">
                    <p>快捷设置代理费</p>
                </li>
                <li>
                    <img src="../../../assets/images/agent/icon_invitation.png">
                    <p>一键邀请</p>
                </li>
                <li>
                    <img src="../../../assets/images/agent/icon_fission.png">
                    <p class="two-line">社交裂变<br> 一单变十单</p>
                </li>
            </ul>
        </div>
        <div class="self-intro">
            <div class="intro-tit">
                <img src="../../../assets/images/agent/decoration.png">
                <p>如何邀请代理</p>
                <img src="../../../assets/images/agent/decoration.png">
            </div>
            <div class="intro-con">
                <div class="intro-list">
                    <i class="icon-one"></i>
                    <div>选择授权商品</div>
                </div>
                <div class="intro-list">
                    <i class="icon-two"></i>
                    <div>选择邀请方式</div>
                </div>
                <div class="intro-list">
                    <i class="icon-three"></i>
                    <div class="last">邀请好友代理</div>
                </div>
            </div>
        </div>
        <a class="agent-sure" @click="invite">
            立即邀请代理
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
                isAndroid: null
            }
        },
        methods: {
            invite(){
                if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.pushAgentInviteAgencyMethod();
                    }); 
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('pushAgentInviteAgencyMethod',()=>{})
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
        width:6.1rem;
        height:4.28rem;
        padding:0.4rem 0.4rem;
        background: url(../../../assets/images/agent/bg-develop.png) center 0/ contain no-repeat;
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
        height:0.84rem;
        font-size:0.30rem;
        font-family:PingFangSC-Light;
        font-weight:300;
        color:rgba(102,102,102,1);
        line-height:0.42rem;
        letter-spacing:0.01rem;
        margin-bottom:0.6rem;
        text-align:center;
    }
    .self-what ul{
        width:100%;
        display:flex;
        flex-direction:row;
        justify-content: space-between;
        color:#333;
    }

    .self-what ul li p{
        font-size:0.24rem;
    }
    .self-what ul li img{
        width:1.32rem;
        height:1.32rem;
        margin-bottom:0.2rem;
    }
    .wrapper{
        width:100%;
        height:100%;
        padding-bottom: 1.8rem;
        background:#FFEEDF;
        font-family:PingFangSC-Light;
        position:relative;
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
    .self-intro{
        position: absolute;
        top: 10rem;
        left: .4rem;
        width: 6.3rem;
        border-radius: .08rem;
        background: #fff;
        opacity: .9;
        padding: .4rem .2rem;
        margin-bottom: 1.4rem;
        .intro-tit{
            display: flex;
            justify-content: space-between;
            width: 3.2rem;
            margin: auto;
            p{
                font-size: .36rem;
                color: #333;
            }
            img{
                width: .36rem;
                height: .22rem;
                margin-top: .1rem;
            }
        }
        .intro-con{
            display: flex;
            justify-content: space-between;
            .intro-list{
                width: 2.1rem;
                i{
                    display: block;
                    width: .4rem;
                    height: .4rem;
                    margin: .4rem 0 .18rem .8rem;
                    background: url('../../../assets/images/agent/icon_one.png') no-repeat;
                    background-size: contain;
                }
                .icon-two{
                    background: url('../../../assets/images/agent/icon_two.png') no-repeat;
                    background-size: contain;
                }
                .icon-three{
                    background: url('../../../assets/images/agent/icon_three.png') no-repeat;
                    background-size: contain;
                }
                div{
                    width: 1.9rem;
                    background: url('../../../assets/images/agent/arrow_right_black.png') no-repeat;
                    background-position: right center;
                    background-size: .07rem .14rem;
                    padding-left: .25rem;
                    font-size: .26rem;
                    color: #333;
                }
                div.last{
                    background: none;
                }
            }
        }
    }
    .two-line{
        margin-top: -.2rem;
        line-height: .3rem;
    }
    .new-set li{
        width: 1.8rem;
        text-align: center;
    }
</style>
