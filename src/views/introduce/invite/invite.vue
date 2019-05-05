<template>
  <div class="wrapper" ref="wrapper">
    <main class="container">
      <div class="first-page">
        <img src="../../../assets/images/logo.png">
        <p>让分享更有价值</p>
      </div>
      <div class="text-box">
        <h3>一起来开个网店吧</h3>
        <p>满金店是一个手机开店APP</p>
        <p>不需要自己备货，不需要自己发货</p>
        <p>海量商品 一件代发</p>
        <div class="btn" @click="callAppShare">做甩手掌柜</div>
      </div>
			
    </main>
    <Bullet :bullets="bullets" :top="'.2rem'"></Bullet>
  </div>
</template>

<script>
import "@/assets/styles/common";
import { getQueryParam, InitBridge, setupWebViewJavascriptBridge } from '@/utils/common';
import { fetch } from '@/utils/fetch';
import Bullet from "@/components/Bullet";

export default {
  components: {
    Bullet
  },
  data() {
    return {
      isAndroid: null,
      bullets: null,
    };
  },
  methods: {
    callAppShare(){
      if (this.isAndroid) {
        InitBridge((bridge) => {
            bridge.goOpenStoreMethod();
        }); 
      }else{
        setupWebViewJavascriptBridge((bridge) => {
            bridge.callHandler('goOpenStoreMethod',()=>{})
        }); 
      }
    },
    pullBulletData(){
        fetch(`/message/v1/app/popup?type=3`).then(res => {
            if(res.code !== 1){
                return;
            }
            this.bullets = res.data;
        }).catch(err => {
            console.log(err);
        });
    },
  },
  mounted() {
    this.isAndroid = window.navigator.userAgent.toLowerCase().indexOf('android') > -1;
    this.pullBulletData();
  }
};
</script>

<style>
body{
  background: url('../../../assets/images/share/background2.png') center bottom no-repeat;
  background-size: contain;
  background-color: #ffeedf;
}
.w100 {
  width: 100%;
}
.container {
  position: relative;
  padding-top: .58rem;
}
.first-page {
  width: 100%;
  height: 2.73rem;
  padding-top: .2rem;
  background: url('../../../assets/images/share/background1.png') no-repeat;
  background-size: contain;
  text-align: center;
  img{
    width: .69rem;
    height: .83rem;
  }
  p{
    font-size: .24rem;
    font-family: PingFangSC-Light;
    color: #6E2C0B;
    line-height: .33rem;
  }
}
.text-box{
  position: absolute;
  top: 2.9rem;
  left: 0;
  width: 100%;
  text-align: center;
  h3{
    margin-bottom: .72rem;
    color: #FF681D;
    font-size: .72rem;
    font-weight: bold;
  }
  p{
    margin-bottom: .16rem;
    color: #6E2C0B;
    font-size: .3rem;
  }
  .btn{
    width: 5.3rem;
    height: .96rem;
    margin: 1.8rem 0 0 1.1rem;
    background: #FF681D;
    box-shadow: 0 .04rem .18rem 0 rgba(255,104,29,0.52);
    border-radius: .48rem;
    opacity: 0.8;
    text-align: center;
    color: #fff;
    font-size: .36rem;
    line-height: .96rem;
  }
}

</style>