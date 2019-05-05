<template>
  <div class="wrapper">
    <header class="header">发展代理规则</header>
    <section>
      <p>1、在我的代理页面，点击“发展代理”（如无正在销售的自有商品，需先上架自有商品），进入选择商品页面；</p>
      <p>2、在选择商品页面，您可选择可供好友代理的商品，设置代理服务费后，即可给好友发送邀请代理链接；</p>
      <p>3、好友打开您的代理邀请链接后，选择所想代理的商品，点击“立即代理”，则您发展代理成功；</p>
      <p>4、好友成功销售代理商品后，商品发货及售后将由您处理；</p>
      <p>5、好友成功销售代理商品后，将获得该商品代理销售收益（即代理服务费），您将获得自有商品收益（自有商品收益=销售价格-代理服务费-平台服务费）；</p>
      <p>6、当自有商品收益完成结算后即成为可用收益，您可提现或在满金店消费。</p>
    </section>
    <header class="header mg-90">成为代理规则</header>
    <section>
      <p>1、在与好友的聊天页面中，点击邀请代理链接内容，打开邀请代理页面；</p>
      <p>2、在邀请代理页面，选择想代理的商品，点击“立即代理”后，则您代理成功；</p>
      <p>3、您成功销售代理商品后，商品无需您发货、售后</p>
      <p>4、您成功销售代理商品后，您将获得该商品的代理销售收益（即代理服务费）；</p>
      <p>5、当代理销售收益完成结算后即成为可用收益，您可提现或在满金店消费。</p>
    </section>
  </div>
</template>

<style scoped>
.wrapper {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 0.35rem;
  font-size: 0.26rem;
  line-height: 0.37rem;
  color: #333;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #fff;
  .header {
    font-size: 0.34rem;
    font-weight: 400;
    color: #333;
    position: relative;
    width: 3rem;
    margin: 0.07rem auto 0;
    text-align: center;
    &:before {
      content: "";
      width: 0.64rem;
      height: 0;
      display: inline-block;
      border-bottom: 1px solid #999;
      position: absolute;
      top: 0.2rem;
      left: -0.4rem;
    }
    &:after {
      content: "";
      width: 0.64rem;
      height: 0;
      display: inline-block;
      border-bottom: 1px solid #999;
      position: absolute;
      top: 0.2rem;
      right: -0.4rem;
    }
  }
  .mg-90 {
    margin-top: 0.9rem;
  }
  section {
    p {
      margin-bottom: 0.3rem;
      font-size: 0.28rem;
      color: #333;
      line-height: 0.4rem;
      text-align: justify;
    }
  }
}
</style>