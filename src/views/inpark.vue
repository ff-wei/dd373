<template>
  <div class="page">
    <van-loading :size="50" vertical :text-size="14" color="#2462EF" text-color="#2462EF" v-if="loading">
      正在登记入场...
    </van-loading>
    <div v-else>
      <div class="error-card" v-if="error">
        <Icon name="clear" size="60" color="#ee0a24"/>
        <div class="title">入场失败</div>
        <Button type="primary" round block @click="inPark">重新入场</Button>
      </div>
      <div class="success-card" v-else>
        <Icon name="checked" size="60" color="#07c160"/>
        <div>
          <div class="title">入场成功</div>
          <div class="tip">您本次场内车牌号为</div>
          <div class="car">{{ formatCarNo(carNo) }}</div>
        </div>
        <Button round block @click="goHome">返回首页</Button>
      </div>

    </div>
  </div>
</template>

<script setup>
import {Button, Icon, Loading} from 'vant';
import {onMounted, ref} from "vue";
import request from "@/utils/request";
import {useRoute, useRouter} from "vue-router";
import {formatCarNo} from "@/utils/common";

const router = useRouter();
const route = useRoute();
const {channelId, lotCode} = route.query;
const loading = ref(true);
const error = ref(false);
const carNo = ref();
const inPark = async () => {
  try {
    loading.value = true
    error.value = false;
    const res = await request.get(`/inPark`, {
      params: {
        channelId,
        lotCode
      }
    });
    carNo.value = res.data;
  } catch (e) {
    error.value = true
  } finally {
    loading.value = false
  }
};
const goHome = () => {
  router.replace({
    name: 'Home',
  })
}
onMounted(() => {
  inPark()
})
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin card {
  width: 80vw;
  height: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  border-radius: 24px;
  box-shadow: 0 8px 12px #ebedf0;
  background-color: #FFFFFF;
  padding: 36px;

  .title {
    font-size: 48px;
    font-weight: bolder;
  }
}

.success-card {
  @include card;

  .tip {
    font-size: 26px;
    margin-top: 36px;
    color: #999999;
    font-weight: bolder;
  }

  .car {
    font-size: 56px;
    margin-top: 12px;
    letter-spacing: 16px;
    font-weight: bolder;
    color: $primary-color;
  }
}

.error-card {
  @include card;
}
</style>
