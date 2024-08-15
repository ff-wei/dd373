<template>
  <div class="empty">
    <img :src="img" class="empty-img" alt="empty"/>
    <div class="tip" v-if="tip">{{ tip }}</div>
    <button class="btn" v-if="showBtn" @click="emits('btnClick')">{{ btnText }}</button>
  </div>
</template>

<script setup>
const {img, tip, showBtn, btnText, hasTab, marginTop} = defineProps({
  img: {
    type: String,
    required: true
  },
  tip: {
    type: String,
    required: false
  },
  showBtn: {
    type: Boolean,
    default: false
  },
  btnText: {
    type: String,
    required: false
  },
  hasTab: {
    type: Boolean,
    default: false,
  },
  marginTop: {
    type: Number,
    default: false,
  }
});
const emits = defineEmits(['btnClick'])
const realHeight = (marginTop ? marginTop : hasTab ? 100 : 0) + 'px'
</script>

<style lang="scss" scoped>
.empty {
  width: 100vw;
  height: calc(100vh - v-bind(realHeight));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .empty-img {
    max-width: 400px;
  }

  .tip {
    font-size: 20px;
    font-weight: 500;
    color: #999999;
    margin-top: 30px;
  }

  .btn {
    width: 300px;
    height: 80px;
    margin-top: 80px;
    background: $primary-color;
    border-radius: 40px;
    font-size: 36px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 80px;
  }
}
</style>
