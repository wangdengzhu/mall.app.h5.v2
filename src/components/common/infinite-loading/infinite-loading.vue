<template>
  <div class="infinite-loading-wrap">
    <div class="scroll-container">
      <slot></slot>
      <div class="loading-container" v-if="isShowLoading">
        <template v-if="!isLoadOver">
          <span class="loading-icon"></span>
          <span class="loading-txt">加载中...</span>
        </template>
        <template v-else>
          <span class="loading-txt">没有更多了</span>
        </template>
      </div>
    </div>
    
  </div>
</template>

<script>
import {
  throttle
} from '@/utils/common';
export default {
  name: 'inifinite-loading',
  data() {
    return {
      scrollElem: null,
    }
  },
  methods: {
    scrollHandler() {
      let elem = this.scrollElem;
      if (this.isLoadOver) {
        this.detach();
        return;
      }
      if (elem.scrollTop + elem.clientHeight + 1 >= elem.scrollHeight) {
        (!this.isEnableScroll) && (!this.isLoadOver) && this.$emit('infinite-scroll');
      }
    },
    detach() {
      this.scrollElem.removeEventListener('scroll', this.scrollHandler, !1);
    },
    init() {
      if(this.isLoadOver){
        return;
      }
      this.scrollElem = this.$el.querySelector('.scroll-container');
      this.scrollHandler = throttle(this.scrollHandler, 100, 200).bind(this);
      this.scrollElem.addEventListener('scroll', this.scrollHandler, !1);
    }
  },
  props: {
    isEnableScroll: {
      type: Boolean
    },
    isLoadOver: {
      type: Boolean
    },
    isShowLoading: {
      type: Boolean
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.infinite-loading-wrap{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.scroll-container{
  flex:1;
  overflow-y:auto;
  -webkit-overflow-scrolling:touch; 
}
.loading-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  color:#999;
}
.loading-icon{
    width:20px;
    height:20px;
    border:2px solid red;
    border-bottom-color:transparent;
    box-sizing: border-box;
    border-radius:50%;
    animation:spin 1s linear infinite;
  }
@keyframes spin{
  0%{
    transform:rotate(0);
  }
  50%{
      transform:rotate(180deg);
  }
  100%{
    transform:rotate(360deg);
  }
}
</style>
