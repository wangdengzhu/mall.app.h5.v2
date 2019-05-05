<template>
<div>
    <div class="wrapper" ref='wrapper'>
        <div class="merchants-header">
            <img src="../../../assets/images/invest/merchants_background.png" >
        </div>
        <div class="merchants-slogon">
            <img src="../../../assets/images/invest/merchants_text.png" >
        </div>
        <div class="merchants-know">
            <img class="merchants-img-one" src="../../../assets/images/invest/merchants_manjindian.png" >
            <p>满金店是一个新型的社交化电商平台，人人均可开设自己的专属店铺，优质的供应商渠道为满金店提供了海量一线大牌商品，店主只需一键分享购买，即可获取收益。</p>
        </div>
        <div class="merchants-section">
            <img class="merchants-img-two" src="../../../assets/images/invest/merchants_advantage.png" >
            <h3 style="margin-top:0.41rem"><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_project.png" >知名项目背景 实力雄厚</h3>
            <p>原班人马曾成功运营年销售达200亿的知名电商项目，资金沉淀雄厚，核心人才坚挺、组织架构成熟、稳定、项目研发经验丰富，为平台的稳健运营提供了强大的技术保障。</p>
            <h3><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_merchants.png" >商家入驻免费 项目前景广阔</h3>
            <p>社交电商是共享经济时代的必然产物，是继淘宝、京东之后的第三种电商形态，发展前景非常广阔，满金店免商家入驻费用，致力于最大化服务商家，共谋发展！</p>
            <h3><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_channel.png" >多渠道推广 助力产品畅销</h3>
            <p>热门APP的高频精准广告投放，锁定庞大用户群体，使品牌获得持续曝光，从而带动销量增长。</p>
            <h3><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_commission.png" >丰厚佣金 促动自发传播</h3>
            <p>满金店为个人卖家提供超行业水平的丰厚佣金，促进大范围用户及代理自发性传播，使品牌影响力像滚雪球一样越来越大，实现销量的飞跃式增长。</p>
            <h3><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_background.png" >商家后台 自动化管理</h3>
            <p>平台为商家提供智能化管理后台，实时推送订单信息，您登录后台可直接进行发货、售后处理、队长、提现等操作，高效便捷！</p>
        </div>
        <div class="merchants-section">
            <img class="merchants-img-three" src="../../../assets/images/invest/merchants_trend.png" >
            <h3 style="margin-top:0.41rem"><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_project1.png" >10亿社交用户为依托、新型消费场景</h3>
            <p>截止2018年，微信拥有近10亿用户量，活跃账户达9.80亿，满金店依托丰富的社交属性和极强的用户粘性，形成“社交+娱乐+零售+支付”的闭环互动，将社交与电商更紧密地捆绑在一起，营造出新型的消费场景。 </p>
            <h3><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_market.png" >10000亿+庞大用户体量市场</h3>
            <p>《2018中国社交电商消费升级白皮书》提出，预估到 2020 年，我国社交电商商户规模达 2400 万，市场规模将突破万亿，未来五年行业将有10倍以上的拓展空间。</p>
            <h3><img class="merchants-icon" src="../../../assets/images/invest/merchants_icon_consumption.png" > 5400万中坚人群引领消费</h3>
            <p>引领家庭生活消费的宝妈、电子消费需求旺盛的大学生以及互联网消费主力的上班族，将成为未来互联网社交电商消费的主力军。</p>
        </div>
        <div class="merchants-contact">
            <h4><img class="merchants-contact-icon" src="../../../assets/images/invest/merchants_icon_manjindian.png" >满金店招商部</h4>
            <p>地址： 深圳市福田区红荔路38号群星广场A座24层</p>
            <p>邮编： 518000</p>
            <p>热线： 400-8988-111</p>
            <p>邮箱： hezuo@manjd.com</p>
        </div>
        <div class="invest-btn" @click="callAppShare">立即入驻</div>
    </div>
</div>
</template>

<script>
    import { getQueryParam, throttle ,InitBridge, setupWebViewJavascriptBridge} from '@/utils/common';
    import { fetch } from '@/utils/fetch';
    import '@/assets/styles/common';
    
    export default {
        data(){
            return {
                isAndroid: null,
            }
        },
        methods: {
            //按钮点击
            callAppShare(){
                if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.startActivityForInvestment();
                    }); 
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('pushAttractInvestmentMethod',()=>{})
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
    @import '../../../assets/styles/mixins.css';

    body{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-family:PingFangSC-Regular;
        
    }
    .wrapper{
        background:#FFEEDF;
        width:100%;
        height:100%;
    }
    img{
        width:7.5rem;
        height:100%;
        display:block;
    }
    .merchants-header{
        width:100%;
        padding-top:0.22rem;
    }
    .merchants-header img{
        width:7.5rem;
        height:4.77rem;
        margin-bottom:0.2rem;
    }
    .merchants-header h3{
        font-size:1.2rem;
        font-weight:600;
        line-height:1.68rem;
    }
    .merchants-header h4{
        font-size:0.48rem;
    }
    .merchants-slogon img{
        margin-left:1.04rem;
        width:5.42rem;
        height:1.57rem;
    }
    .merchants-know{
        width:6.3rem;
        margin-left:0.61rem;
        margin-top:0.8rem;
        font-size:0.28rem;
        color:#333;
        line-height:0.4rem;
        font-family:PingFangSC-Light;
    }
    .merchants-know p{
        margin-top:0.3rem;
    }
    .merchants-section{
        width:6.3rem;
        margin-left:0.61rem;
        margin-top:0.8rem;
        font-size:0.26rem;
        color:#333;
        line-height:0.4rem;
        font-family:PingFangSC-Light;
    }
    .merchants-img-one{
        width:4.7rem;
        height:1.92rem;
        margin-left:0.67rem;
    }
    .merchants-img-two{
        width:6.23rem;
        height:1.95rem;
    }
    .merchants-img-three{
        width:5.22rem;
        height:1.96rem;
        margin-left:0.5rem;
    }
    .merchants-section p{
        margin-top:0.15rem;
    }
    .merchants-section h3{
        font-size:0.32rem;
        color:#333;
        font-weight: 600;
        line-height:0.45rem;
        margin-top:0.9rem;
    }
    .merchants-icon{
        width:0.34rem;
        height:0.34rem;
        display: inline;
        margin-right:0.21rem;
        margin-bottom:-0.05rem;
    }
    .invest-logo{
        width:100%;
        height:3.36rem;
    }
    .invest-intro{
        width:5.3rem;
        height:6.02rem;
        background-image: url(../../../assets/images/invest/invest2.png);
        background-size:100% 100%;
        -moz-background-size:100% 100%;
        color:#333;
        font-size:0.26rem;
        padding:0.8rem 1rem 0 1.2rem;
        line-height:0.4rem;
        margin-top:0.2rem;
    }
    .invest-intro p:nth-of-type(2){
        margin-top:0.3rem;
    }
    .invest-intro p:nth-of-type(3){
        margin-top:0.32rem;
    }
    .invest-intro p:nth-of-type(4){
        margin-top:0.22rem;
    }
    .invest-intro p:nth-of-type(5){
        margin-top:0.3rem;
    }
    .merchants-contact{
        width: 6.89rem;
        height:1.43rem;
        background-image: url(../../../assets/images/invest/merchants_contactus.png);
        background-size:100% 100%;
        -moz-background-size:100% 100%;
        font-size:0.28rem;
        color:#333;
        padding-top:1.61rem;
        padding-left:0.61rem;
        line-height:0.46rem;
        margin-top:1.13rem;
        margin-bottom: 2.5rem;
    }
    .merchants-contact h4{
        font-size:0.32rem;
        margin-bottom:0.1rem;
    }
    .merchants-contact-icon{
        width:0.42rem;
        height:0.32rem;
        display: inline;
        margin-right:0.16rem;
    }
    .invest-btn{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 10000;
        width:7.5rem;
        height:0.98rem;
        background:#FF681D;
        font-weight:500;
        font-size:0.34rem;
        line-height:0.98rem;
        color:#fff;
        text-align:center;
    }
</style>

