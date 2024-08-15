<template>
  <div v-if="template">
    <div class="title">您的好友送给您一张电子卡券</div>
    <div class="card">
      <img :src="template.pics"/>
    </div>
    <div class="title">{{ template.title }}</div>
    <van-button type="primary" class="btn" round :loading="loading" @click="receive">立即领取</van-button>
  </div>
</template>

<script setup>

import {useRoute, useRouter} from "vue-router";
import request from "@/utils/request";
import {onMounted, ref} from "vue";
import {closeToast, Dialog, showConfirmDialog, showLoadingToast, Toast} from "vant";

const {query: {code}} = useRoute();
const router = useRouter();

const template = ref();
const coupon = ref();
const loading = ref(false);

const loadData = async () => {
  showLoadingToast({message: '加载中'});
  const res = await request.get(`/coupon/gift/${code}`);
  template.value = res.data.template
  coupon.value = res.data.coupon
  closeToast();
};

const receive = async () => {
  try {
    loading.value = true
    await request.post(`/coupon/gift/${code}`);
    showConfirmDialog({
      title: '',
      message: '领取优惠券成功',
      cancelButtonText: '查看优惠券',
      confirmButtonText: '返回首页',
    }).then(() => {
      router.replace({
        name: 'Home'
      });
    }).catch(() => {
      router.replace({
        name: 'CouponList'
      })
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData();
})
</script>

<style lang="scss" scoped>

.title {
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin-top: 50px;
}

.card {
  width: 650px;
  aspect-ratio: 16/9;
  background-color: #FFFFFF;
  margin: 50px;

  img {
    width: 100%;
    border-radius: 25px;
  }
}

.btn {
  width: 550px;
  margin: 120px 100px;
}
</style>