<template>
  <div class="wrapper" :class="{white: !isShowGood}">
    <div class="agent-intro">{{topText}}</div>
    <div class="empty" v-if="!isShowGood">
      <img src="../../../assets/images/empty.png" alt>
      <p>{{nonTips}}</p>
    </div>
    <div v-else>
      <div class="product-list" v-for="(item,key) in agentData" :key="key">
        <div class="check-list">
          <input class="checkItem" type="checkbox" :id="'checkItem'+key" :value="item.spuid" v-model="checkData" >
        </div>
        <div class="product-pic">
          <img :src="item.pic">
        </div>
        <div class="product-info">
          <p class="goods-info-tit">{{item.spuname}}</p>
        </div>
        <div class="product-attr">
            <div class="goods-tit" v-if="item.skus && item.skus.length > 1">规格</div>
            <div class="goods-tit">销售价(元)</div>
            <div class="goods-tit">你能赚(元)</div>
        </div>
        <div class="product-attr" v-for="(val, i) of item.skus" :key="i">
            <div class="good-spec" v-if="item.skus && item.skus.length > 1">{{val.attr}}</div>
            <div>{{val.saleprice.toFixed(2)}}</div>
            <div class="orange">{{val.agentamount.toFixed(2)}}</div>
        </div>
      </div>
    </div>
    <div class="agent-ft">
      <input type="checkbox" class="agent-agree" id="agent-agree" v-model="agentAgree" value="true">
      <label for="agent-agree">
        已阅读并同意
        <a href="agreement.html">《代理服务协议》</a>
      </label>
    </div>
    <div class="agent-bot">
      <div class="all-select">
        <input id="quan" class="check-all" type="checkbox" :class="{'no-check': !isShowGood}" v-model="isAllChecked" >
        <label for="quan">全选</label>
      </div>
      <a class="agent-sure" @click="openLink" :class="{'no-btn': !isShowGood}">立刻代理</a>
    </div>
  </div>
</template>

<script>
import { Agent } from "@/apis/";
import { getQueryParam, InitBridge, setupWebViewJavascriptBridge } from "@/utils/common";
import { fetch } from "@/utils/fetch";
import Indicator from "@/components/common/indicator";
import Toast from "@/components/common/toast";
import "@/assets/styles/common";

export default {
  data() {
    return {
      isShowGood: !0,
      checkData: [],
      agentData: [],
      agentAgree: "true",
      shareid: null,
      supplierid: null,
      shopid: null,
      agentInfo: null,
      nonTips: "",
      topText: "邀请你还可代理的商品",
    };
  },
  computed: {
    isAllChecked: {
      set(bool) {
        if (!bool) {
          this.checkData.splice(0);
          return;
        }
        this.agentData.forEach((item, idx) => {
          if (this.checkData.indexOf(item.spuid) < 0) {
            this.checkData.push(item.spuid);
          }
        });
      },
      get() {
        return this.checkData.length === this.agentData.length;
      }
    }
  },
  watch: {
    checkData: {
      handler(e) {
        if (this.agentData.length) {
          var allLength = this.agentData.length;
        }
      }
    },
    deep: true
  },
  methods: {
    checkAll(e) {
      var checkObj = document.querySelectorAll(".checkItem");
      if (e.target.checked) {
        for (var i = 0; i < checkObj.length; i++) {
          if (!checkObj[i].checked) {
            this.checkData.push(checkObj[i].value);
          }
        }
      } else {
        this.checkData = [];
      }
    },
    getAgentGoods() {
      Indicator.show("加载中...");
      Agent.notAgentGoods(this.supplierid)
        .then(res => {
          Indicator.close();
          if (res.code === 1) {
            this.agentData = res.data;
            this.initCheckItems(res.data);
            if(res.data.length == 0){
              this.isShowGood = !1;
              this.nonTips = "暂无可代理的商品";
            }
          } else if (res.code === 404) {
            this.isShowGood = !1;
            this.nonTips = "暂无可代理的商品";
          } else {
            this.isShowGood = !1;
            this.nonTips = "加载失败，请稍后再试";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAgentInfo() {
      Agent.agentInfo(this.shopid)
        .then(res => {
          if (res.code === 1) {
            this.agentInfo = res.data;
            this.agentInfo["supplierid"] = this.supplierid;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    openLink() {
      let agentInfoJson = JSON.stringify(this.agentInfo);
      if (
        this.isAndroid &&
        window.androidHeaders &&
        !window.androidHeaders.islogin
      ) {
        InitBridge(bridge => {
          bridge.pushAgentAcceptInvitationMethod(agentInfoJson);
        });
        return;
      } else if (
        !this.isAndroid &&
        window.iOSHeaderInfo &&
        !window.iOSHeaderInfo.islogin
      ) {
        setupWebViewJavascriptBridge(bridge => {
          bridge.callHandler(
            "pushAgentAcceptInvitationMethod",
            this.agentInfo,
            () => {}
          );
        });
        return;
      }
      if (!this.isShowGood) {
        return;
      }
      if (!this.agentAgree) {
        Toast("请勾选代理服务协议");
      } else if (this.checkData && this.checkData.length == 0) {
        Toast("请选择至少一款商品代理");
      } else {
        Indicator.show("加载中...");
        let allspu = this.agentData.map(v => {
          return {spuid: v.spuid, isselect: false};
        });
        allspu.map((v, i) => {
          this.checkData.map((m, n) =>{
            if(m === v.spuid){
              allspu[i].isselect = true;
            }
          })
        })
        Agent.agentGoods(this.shareid, allspu, 1)
          .then(res => {
            Indicator.close();
            if (res.code === 1) {
              Toast("代理成功");
              setTimeout(() => {
                if (this.isAndroid) {
                  InitBridge(bridge => {
                    bridge.pushAgentAcceptInvitationMethod(agentInfoJson);
                  });
                } else {
                  setupWebViewJavascriptBridge(bridge => {
                    bridge.callHandler(
                      "pushAgentAcceptInvitationMethod",
                      this.agentInfo,
                      () => {}
                    );
                  });
                }
              }, 1000);
            } else if (res.code == 810) {
              Toast("您需要代理的商品已被删除，无法代理！");
              setTimeout(() => {
                location.reload();
              }, 1000);
            } else if (res.code == 820) {
              Toast("代理成功，其中部分被删除的商品无法代理！");
              setTimeout(() => {
                if (this.isAndroid) {
                  InitBridge(bridge => {
                    bridge.pushAgentAcceptInvitationMethod(agentInfoJson);
                  });
                } else {
                  setupWebViewJavascriptBridge(bridge => {
                    bridge.callHandler(
                      "pushAgentAcceptInvitationMethod",
                      this.agentInfo,
                      () => {}
                    );
                  });
                }
              }, 1000);
            } else if (res.code == 830) {
              Toast("以上为您的自有商品，无法代理！");
            } else {
              Toast(res.message);
            }
          })
          .catch(err => {});
      }
    },
    initCheckItems(listData) {
      if (!listData) {
        return;
      }
      if (listData.length <= 0) {
        return;
      }
      listData.forEach((item, idx) => {
        if (this.checkData.indexOf(item.spuid) < 0) {
          this.checkData.push(item.spuid);
        }
      });
    },
    init() {
      let qs = getQueryParam(location.search);
      this.supplierid = qs("supplierId");
      this.shareid = qs("shareId");
      this.shopid = qs("shopid");
      localStorage.setItem("shopId", this.shopid);
      localStorage.setItem("shareId", this.shareid);
      localStorage.setItem("sharesource", qs("mjd_from"));
      this.isAndroid = window.navigator.userAgent.toLowerCase().indexOf("android") > -1;
    }
  },
  mounted() {
    this.init();
    this.getAgentGoods();
    this.getAgentInfo();
  }
};
</script>
<style>
body{
  background: #f5f5f5;
}
.empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e2a481;
  font-size: 0.28rem;
}
.empty img {
  width: 2.8rem;
  height: 2.4rem;
  margin-top: 2rem;
}
.wrapper {
  overflow: hidden;
  padding-bottom: 1.8rem;
}
.white{
  background: #fff;
}
.agent-agree {
  display: inline-block;
  width: 0.25rem;
  height: 0.25rem;
  position: absolute;
  left: 0.3rem;
  top: 0.25rem;
  background: url(../../../assets/images/agent/nocheck.png) 0 0 / cover;
  border: none;
}
.agent-agree:checked {
  background: url(../../../assets/images/agent/checked.png) 0 0 / cover;
}
.agent-ft {
  width: 100%;
  height: .8rem;
  padding-left: .65rem;
  line-height: .8rem;
  font-size: 0.26rem;
  float: left;
  position: fixed;
  z-index: 1000;
  bottom: 1rem;
  background: #fff;
  border-top: 1px solid #e5e5e5;
}
.agent-ft a {
  color: #4d7bfe;
}
.agent-intro {
  background: linear-gradient(-90deg, #fc8329 0%, #f46918 100%);
  height: 1.4rem;
  font-size: 0.32rem;
  line-height: 1.4rem;
  color: #fff;
  text-align: center;
}
.container {
  padding-bottom: 0.5rem;
  background-color: #ffeedf;
  font-size: 0.3rem;
}
.check-list {
  display: block;
  width: 0.92rem;
  height: 1.8rem;
  float: left;
  line-height: 0.92rem;
  position: relative;
  z-index: 3;
}
.product-list {
  padding: 0.4rem 0 0.06rem;
  margin-bottom: 0.2rem;
  float: left;
  background: #fff;
}
.product-pic {
  width: 1.4rem;
  height: 1.4rem;
  float: left;
  img {
    width: 1.4rem;
    height: 1.4rem;
  }
}
.product-info {
  width: 4.62rem;
  float: left;
  margin-left: 0.26rem;
  line-height: 0.37rem;
}
.goods-info-tit {
  font-family: PingFangSC-Light;
  font-size: 0.26rem;
  color: #333;
}
.product-attr{
  float: left;
  width: 6.5rem;
  margin-left: .92rem;
  display: flex;
  font-size: .28rem;
  &>div{
    width: 2.2rem;
    margin-bottom: .24rem;
  }
  .goods-tit{
    color: #333;
    font-size: .26rem;
  }
  .orange{
    color: #FF681D;
  }
  .good-spec{
    width: 2.1rem;
    padding-right: .1rem;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.checkItem {
  position: absolute;
  left: 0.3rem;
  top: 0.5rem;
  width: 0.4rem;
  height: 0.4rem;
  border: 0.02rem solid #ccc;
  border-radius: 1rem;
}

.check-all {
  position: absolute;
  left: 0.3rem;
  top: 0.3rem;
  width: 0.4rem;
  height: 0.4rem;
  border: 0.02rem solid #ccc;
  border-radius: 1rem;
}
.checkItem:checked,.check-all:checked {
  background: url(../../../assets/images/agent/selected.png) 0 0 / cover;
  border: none;
  
}
.no-check,
.no-check:checked {
  background: #f2f2f2;
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0.3rem;
  top: 0.3rem;
  z-index: 2;
  border: 0.02rem solid #ccc;
}
.agent-bot {
  width: 100%;
  height: 1rem;
  line-height: 1rem;
  box-shadow: 0px -2px 8px 0px rgba(219, 219, 219, 0.5);
  left: 0;
  bottom: 0;
  position: fixed;
  z-index: 1000;
  font-size: 0.32rem;
  background: #fff;
}
.all-select {
  width: 2.5rem;
  float: left;
  text-indent: 0.92rem;
  position: relative;
  z-index: 10000;
  color: #333;
}
.agent-sure {
  width: 4.9rem;
  text-align: center;
  float: right;
  border-left: 1px solid #ccc;
  background: #ff681d;
  color: #fff;
  font-family: PingFangSC-Regular;
}
.no-btn {
  background: #dbdbdb;
}

</style>
