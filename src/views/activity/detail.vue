<template>
  <div class="page" v-if="activity">
    <div class="card">
      <div class="title">{{ activity.activityName }}</div>
      <ul class="rules">
        <li>活动时间:{{ dayjs(activity.startDate).format('YYYY/MM/DD') }} ~
          {{ dayjs(activity.endDate).format('YYYY/MM/DD') }}
        </li>
        <li>余量:{{ surplusAmount }}套；</li>
        <li>活动要求:每人每{{ timeUnit }}限领 {{ activity.receiveMore }} 次，每人总限领 {{ activity.receiveLimit }} 次；
        </li>
      </ul>
    </div>
    <div class="card">
      <div class="title">活动礼品</div>
      <div class="coupons">
        <activity-coupon border :name="ac.template.couponName" :price="ac.template.parPrice"
                         v-for="ac in activity.activityCouponList" :key="ac.id">
          <template v-slot:left>
            <div>{{ formatExpire(ac.template) }}</div>
          </template>
          <template v-slot:right>
            <div class="useTip">{{formatLimit(ac.template)}}</div>
          </template>
        </activity-coupon>
      </div>
    </div>
    <div class="card">
      <div class="title">活动说明</div>
      <div class="remark" v-html="activity.remark"/>
    </div>
    <van-button type="primary" round class="btn" :loading="loading" @click="receive">立即领取</van-button>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {closeToast, showLoadingToast, showSuccessToast, Toast} from "vant";
import request from "@/utils/request";
import dayjs from "dayjs";
import ActivityCoupon from "./components/activity-coupon";

const route = useRoute();
const {id} = route.query;
const activity = ref();
const loading = ref(false);

const surplusAmount = computed(() => {
  if (activity.value) {
    return activity.value.amount - activity.value.receiveAmount
  }
  return 0;
});
const timeUnit = computed(() => {
  if (activity.value) {
    switch (activity.value.receiveTime) {
      case 1:
        return '日';
      case 2:
        return '周';
      case 3:
        return '月';
    }
  }
  return '';
});
const formatExpire = (template) => {
  const {expireType, startTime, endTime, hours} = template.expireConfig
  switch (expireType) {
    case 1:
      return `${dayjs(startTime).format('YYYY-MM-DD')}至${dayjs(endTime).format('YYYY-MM-DD')}`
    case 2:
      return `领取后${hours}小时内有效`;
    case 3:
      return `领取后当天有效`;
  }
}
const formatLimit = template=>{
  const useMinPrice = template.useMinPrice;
  if (useMinPrice === 0) {
    return "无门槛"
  } else {
    return `满${Number(useMinPrice / 100).toFixed(0)}元可用`
  }
}

const loadData = async () => {
  try {
    showLoadingToast({
      message: '加载中',
      duration: 0,
    });
    const res = await request.get(`/coupon/activity/${id}`);
    activity.value = res.data;
  } finally {
    closeToast();
  }
};

const receive = async () => {
  try {
    loading.value = true
    await request.post(`/coupon/activity/receive/${id}`)
    showSuccessToast('领取成功');
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData();
})
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
}

.card {
  width: 710px;
  padding: 30px;
  background: #FFFFFF;
  border-radius: 10px;
  margin-bottom: 20px;

  .title {
    font-size: 30px;
    font-weight: bold;
    color: #333333;
    margin-bottom: 10px;
  }
}

.rules {
  font-size: 22px;
  font-weight: 500;
  color: #999999;
  line-height: 40px;

  li:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #CCCCCC;
    border-radius: 50%;
    margin-right: 15px;

  }
}


.remark {
  font-size: 24px;
  font-weight: 500;
  color: #666666;
}
.useTip{
  font-size: 22px;
  font-weight: 500;
  color: $primary-color;
  margin-top: 15px;
}

.btn {
  width: 640px;
  margin: 100px 35px 0;
}

</style>