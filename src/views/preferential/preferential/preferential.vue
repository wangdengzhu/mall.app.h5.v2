<template>
    <div>
        <div class="wrapper" ref="wrapper">
            <section class="header">
                <div class="logo">
                    <img src="../../../assets/images/preferential/logo.png">
                </div>
                <div class="slogan">邀请好友开店，特惠好货1元起</div>
                <div class="note-btn" @click="toAnchorNote">
                    <span>活动说明</span>
                    <i class="icon-arrow"></i>
                </div>
            </section>
            <section class="sec step">
                <div class="sec__tit">
                    <p class="st--big">如何获得购物机会</p>
                    <p class="st--small">当好友通过您的邀请链接注册成为店主，在APP端登陆 即可获得特惠购物机会</p>
                </div>
                <div class="sec__cnt">
                    <ul class="sc--steps">
                        <li class="sc--step">
                            <p class="scs--tit">步骤一</p>
                            <p class="scs--desc">点击“邀请开店”按钮分享链接给好友开店</p>
                        </li>
                        <li class="sc--step">
                            <p class="scs--tit">步骤二</p>
                            <p class="scs--desc">好友打开邀请链接，完成注册，成为店主</p>
                        </li>
                        <li class="sc--step">
                            <p class="scs--tit">步骤三</p>
                            <p class="scs--desc">好友首次登陆APP，您即可获得特惠购物权，最低1元买</p>
                        </li>
                    </ul>
                </div>
            </section>
            <section class="sec goods">
                <div class="sec__tit">
                    <p class="st--big">{{ goodsList.length > 0 ? '人气好货等你拿' : "特惠商品敬请期待" }}</p>
                    <p class="st--small">您现有{{ count }}次特惠购物权</p>
                </div>
                <div class="sec__cnt">
                    <div class="sc--goods">
                        <ul class="goods--box">
                            <li @click="navToAppDetail(goods)" v-for="goods in goodsList" :key="goods.spuid" class="goods--item">
                                <div class="goods--pic">
                                    <img :src="goods.goodslistpicurl">
                                    <div v-if="goods.goodsstocks <= 0" class="goods--soldout">已抢完</div>
                                </div>
                                <div class="goods--info">
                                    <div class="goods--name">{{ goods.goodsname }}</div>
                                    <div class="goods--price">
                                        <span>¥ {{ goods.goodsprice.toFixed(2) }}</span>
                                        <del>¥ {{ goods.marketprice.toFixed(2) }}</del>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section class="sec note">
                <div class="sec__tit">
                    <p class="st--big">活动说明</p>
                </div>
                <div class="sec__cnt">
                    <div class="sc--notes">
                        <ul class="notes--box">
                            <li class="note-item">1. 每成功邀请一位好友开店，将获得一次特惠购物权，不限邀请次数。</li>
                            <li class="note-item">2. 获得特惠购物权后方可购买活动商品。</li>
                            <li class="note-item">3. 下单成功后可前往我的订单查看物情。</li>
                        </ul>
                    </div>
                    <div class="warning">注意：若发现作弊、刷奖等行为，以及任何未满足活动规则而获得特惠购物权均视为无效。最终解释权归满金店所有。</div>
                </div>
            </section>
        </div>
        <footer class="fixed-ft">
            <div class="ft-lf">邀请好友开店享特惠</div>
            <div @click="callAppShare" class="ft-rt">立即邀请开店</div>
        </footer>
    </div>
</template>

<script>
    import { fetch, post } from '@/utils/fetch';
    import '@/assets/styles/common';
    import { InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
    
    export default {
        data(){
            return {
                goodsList: [],
                isAndroid: null,
                count: 0
            }
        },
        methods: {
            toAnchorNote(){
                let doc = this.$refs.wrapper,
                    maxScrollVal =  doc.scrollHeight - window.innerHeight,
                    curScrollVal = doc.scrollTop,
                    timerID = null;

                if (!window.requestAnimationFrame) {
                    requestAnimationFrame = (fn) => {
                        return setTimeout(() => {
                            fn();
                        }, 17);
                    };
                }

                if (!window.cancelAnimationFrame) {
                    cancelAnimationFrame = (id) => {
                        clearTimeout(id);
                    };
                }

                const start = ()=>{
                    curScrollVal = curScrollVal + (maxScrollVal - curScrollVal) / 4;
                    if (curScrollVal >= (maxScrollVal - 1)) {
                        doc.scrollTop = maxScrollVal;
                        cancelAnimationFrame(timerID);
                        return;
                    }
                    doc.scrollTop = curScrollVal;
                    if(doc.scrollTop == 0){
                        document.body.scrollTop = curScrollVal;
                        doc = document.body;
                    }
                    timerID = requestAnimationFrame(start);
                };
                
                start();
            },
            navToAppDetail(goods){
                const spuID = goods.spuid;
                if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.goToGoodsDetailMethod(spuID);
                    });
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('goToGoodsDetailMethod', spuID, ()=>{})
                    }); 
                }
            },
            pullGoodsData(){
                fetch(`goods/v1/app/discount/list`).then(res => {
                    if (res.code !== 1) {
                        return;
                    }
                    let list = res.data;
                    if (list && list.length % 2 !== 0) {
                        list = list.slice(0, -1);
                    }
                    this.goodsList = list;
                }).catch(err => {
                    console.log(err);
                });
            },
            pullPerentailCount(){
                post(`activity/v1/app/frequency`).then(res => {
                    if (res.code !== 1) {
                        return;
                    }
                    this.count = res.data.num;
                }).catch(err => {
                    console.log(err);
                });
            },
            callAppShare(){
                if (this.isAndroid) {
                    InitBridge((bridge) => {
                        bridge.showSharedDialogForInviteSetupStore(this.count);
                    }); 
                }else{
                    setupWebViewJavascriptBridge((bridge) => {
                        bridge.callHandler('showSharedDialogForInviteSetupStore', this.count, ()=>{})
                    }); 
                } 
            },
            init(){
                this.isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
                this.pullGoodsData();
                this.pullPerentailCount();
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style>
    @import '../../../assets/styles/mixins.css';
    .wrapper{
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
    section{
        float:left;
    }

    .header{
        width:100%;
        height: 5.6rem;
        padding-top: 0.8rem;
        background-color: #fff6ee;
        text-align: center;
        box-sizing: border-box;
        .logo{
            width: 2.4rem;
            height: 2.3rem;
            margin: 0 auto;
            img{
                width: 100%;
                height: 100%;
            }
        }

        .slogan{
            margin-top: 0.44rem;
            margin-bottom: 0.24rem;
            color: #333;
            font-size: 0.42rem;
            line-height: 0.59rem;
        }

        .note-btn{
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-right: 0.25rem;
            color: #999;
            font-size: 0.26rem;
            line-height: 1;

            &:before{
                content: '';
                position: absolute;
                top: -0.15rem;
                left: 1.0rem;
                right: 1.0rem;
                bottom: -0.1rem;
            }

            .icon-arrow{
                width: 0.18rem;
                height: 0.2rem;
                margin-left: 0.07rem;
                background: url(../../../assets/images/preferential/arrow.png) 0 0/contain no-repeat;
            }
        }
    }
    .sec{
        width:100%;
        padding-top: 0.8rem;
        &.note{
            height: 5.89rem;
            margin-top: 0.8rem;
            padding-top: 0.5rem;
            background-color: #FFF9F3;
            box-sizing: border-box;
        }
        
        .sec__tit{
            padding: 0 0.32rem;
            text-align: center;
            .st--big{
                font-size: 0.42rem;
                color: #333;
            }
            .st--small{
                margin-top: 0.1rem;
                font-size: 0.26rem;
                color: #666;
                letter-spacing: 1px;
                line-height: 0.38rem;
            }
        }
       
        .sc--steps{
            padding: 0 0.32rem;
            .sc--step{
                position: relative;
                height: 1.5rem;
                margin-top: 0.5rem;
                padding-left: 0.47rem;
                border-radius: 2px;
                background:rgba(255,255,255,1);
                box-shadow:0px 2px 26px 0px rgba(0,0,0,0.06);
                overflow: hidden;

                .scs--tit{
                    padding-top: 0.29rem;
                    font-size: 0.3rem;
                    color: #333;
                }
                .scs--desc{
                    margin-top: 0.13rem;
                    font-size: 0.26rem;
                    color: #666;
                }

                &:first-of-type{
                    margin-top: 0.4rem;
                }

                &:before{
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 0.12rem;
                }

                &:first-of-type:before{
                    background-color: #FF681D;
                }

                &:nth-of-type(2):before{
                    background-color: #FFB31C;
                }

                &:last-of-type:before{
                    background-color: #6CCB00;
                }

                &:after{
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    font-size: 1.3rem;
                    font-weight: bold;
                    color: #000;
                    opacity: .02;
                    line-height: 0.5;
                }


                &:first-of-type:after{
                    content: '01';
                }

                &:nth-of-type(2):after{
                   content: '02';
                }

                &:last-of-type:after{
                    content: '03';
                }
            }
        }
        
        .sc--goods{
            padding: 0 0.32rem;

            .goods--box{
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                flex-direction:row;
                .goods--item{
                    display: flex;
                    flex-direction: column;
                    width: 3.28rem;
                    height: 4.68rem;
                    margin-top: 0.4rem; 
                    
                    .goods--pic{
                        width: 100%;
                        height: 3.28rem;
                        background-color: #F5F5F5;
                        background-blend-mode: normal;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .goods--info{
                        display: flex;
                        flex: 1;
                        flex-direction: column;
                        justify-content: space-between;
                    }
                    
                    .goods--name{
                        overflow : hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        /* autoprefixer: off*/
                        -webkit-box-orient: vertical;
                        /* autoprefixer: on*/
                       
                        margin: 0.22rem 0;
                        font-size: 0.26rem;
                        color: #333;
                        line-height: 0.37rem;
                    }

                    .goods--price{
                        font-size: 0.26rem;
                        color: #333;

                        del{
                            color: #999;
                            margin-left: 0.3rem;
                        }
                    }

                    .goods--soldout{
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        width: 1.9rem;
                        height: 1.9rem;
                        line-height: 1.9rem;

                        margin-left: -0.95rem;
                        margin-top: -0.95rem;

                        border-radius: 50%;

                        font-size: 0.32rem;
                        color: #fff;
                        text-align: center;
                        letter-spacing: 1px;

                        background-color: rgba(0, 0, 0, 0.5);
                    }

                }
            }
        }

        .sc--notes{
            margin-top: 0.26rem;
            font-size: 0.26rem;
            color: #666;

            .notes--box{
                 padding: 0 0.32rem;
            }

            .note-item{
               
                padding-left: 1em;
                line-height: 0.37rem;
                margin-bottom: 0.2rem;
                text-indent: -1em;
            }
        }

        .warning{
            margin-top: 0.24rem;
            padding: 0 0.32rem;
            font-size: 0.24rem;
            color: #FF681D;
            line-height: 0.33rem;
        }
    }

    .fixed-ft{
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 100;

        display: flex;
        
        width: 100%;
        height: 1.0rem;
        line-height: 1.0rem;
        background-color: #fff;
        box-shadow:0px 1px 13px 0px rgba(202,200,198,0.5);

        .ft-lf{
            flex: 1;
            font-size: 0.28rem;
            color: #333;
            padding-left: 0.32rem;
        }

        .ft-rt{
            width: 2.5rem;
            background-image: linear-gradient(90deg, #FF8C00, #FF6714);
            font-size: 0.32rem;
            color: #fff;
            text-align: center;
        }
    }


</style>
