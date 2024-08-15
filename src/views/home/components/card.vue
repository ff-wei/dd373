<template>
  <div class="card">
    <div class="header">
      <img :src="icon" class="icon" alt="icon" v-if="icon"/>
      <span class="title" v-if="title">{{ title }}</span>
      <span class="sub-title" v-if="subTitle">{{ subTitle }}</span>
    </div>
    <slot/>
  </div>
</template>
<script setup>
const {icon, title, subTitle} = defineProps({
  icon: String,
  title: String,
  subTitle: String
});
</script>

<style lang="scss" scoped>
.card {
  width: 690px !important;
  height: 470px;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 40px 30px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;

    .icon {
      width: 28px;
      height: 28px;
    }

    .title {
      font-size: 32px;
      font-weight: bold;
      color: #333333;
      margin-left: 11px;
    }

    .sub-title {
      font-size: 20px;
      font-weight: 500;
      color: #999999;
      margin-left: 11px;
    }
  }
}
</style>
