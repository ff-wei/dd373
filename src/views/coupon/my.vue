<template>
  <van-tabs v-model:active="currentIdx" :items="tabs" color="#2462EF">
    <van-tab v-for="tab in tabs" :name="tab.name" :title="tab.label"/>
  </van-tabs>
  <div class="exchange-input">
    <input maxlength="20" v-model="exchangePassword"/>
    <button class="exchange-btn" @click="exchange">兑换</button>
  </div>
  <div class="coupons" v-if="dataList.length">
    <coupon v-for="(coupon,idx) in dataList" :data="coupon" v-if="currentIdx===1" @send="startSend(coupon)"/>
    <card v-for="(card,idx) in dataList" :data="card" @success="useSuccess(idx)" @send="startSend(card)" v-else/>
  </div>
  <empty :img="emptyImg"
         tip="暂无卡券～"
         :margin-top="210"
         show-btn
         btn-text="去领券"
         @btn-click="goCenter"
         v-else/>

</template>

<script setup>
import Coupon from "./components/coupon";
import Empty from "@/components/empty";
import emptyImg from "@/assets/imgs/no-coupon.png";
import {onMounted, ref, watch} from "vue";
import {closeToast, showLoadingToast, showSuccessToast, showToast, Toast} from "vant";
import request from "@/utils/request";
import Card from "./components/card";
import {useRouter} from "vue-router";

const router = useRouter();
const currentIdx = ref(1);
const tabs = [
  {name: 1, label: '电子券'},
  {name: 3, label: '电子卡'},
];

const dataList = ref([]);
const showSend = ref(false);


const exchangePassword = ref('');

const goCenter = () => {
  router.push({
    name: 'Activity'
  })
}

const loadData = async () => {
  dataList.value = [];
  showLoadingToast({
    duration: 0,
    message: '加载中',
  })
  const res = await request.post('/coupon/my', {
    businessType: currentIdx.value
  })
  dataList.value = res.data;
  closeToast();
}


const exchange = async () => {
  if (exchangePassword.value.trim() === '') {
    showToast('请输入兑换码');
    return
  }
  showLoadingToast({
    message: '正在兑换',
    mask: true,
    duration: 0,
  });
  await request.put('/coupon/exchange', {
    code: exchangePassword.value
  })
  showSuccessToast('兑换成功');
  exchangePassword.value = '';
  loadData();
}
const useSuccess = idx => {
  dataList.value.splice(idx, 1);
}

const startSend = item=>{
  sendItem.value=item
  showSend.value=true
}
const confirmSend =async ()=>{
  if (sendPhone.value.length !== 11) {
    showToast('请输入正确的手机号')
    return;
  }
}

onMounted(() => {
  loadData()
})

watch(currentIdx, () => loadData())
</script>


<style lang="scss" scoped>

.exchange-input {
  margin: 30px 30px 0;
  height: 80px;

  input {
    width: 510px;
    height: 80px;
    border-radius: 10px 0 0 10px;
    padding: 0 20px;
    text-align: right;
    font-weight: bold;
    font-size: 36px;
    color: $primary-color;
  }

  .exchange-btn {
    width: 180px;
    height: 80px;
    background: $primary-color;
    color: #FFFFFF;
    font-size: 36px;
    font-weight: bold;

    border-radius: 0 10px 10px 0;
  }
}

.coupons {
  padding: 30px;

  & > * {
    margin-bottom: 30px;
  }
}
</style>
