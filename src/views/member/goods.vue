<template>
  <div class="page" v-if="goods">
    <div class="card">
      <div class="title">{{ goods.goodsName }}</div>
      <ul class="rules">
        <li>
          <span>兑换积分:</span>
          <div class="price">
            <span>{{ goods.exchangePoints }}</span>
            <span>积分</span>
          </div>
        </li>
        <li>兑换时间:{{ dayjs(goods.startDate).format('YYYY/MM/DD') }} ~
          {{ dayjs(goods.endDate).format('YYYY/MM/DD') }}
        </li>
        <li>余量:{{ goods.surStock }}套；</li>
      </ul>
    </div>
    <div class="card">
      <div class="title">兑换详情</div>
      <div class="coupons">
        <activity-coupon divider-color="#FF9E36" price-color="#FF9E36" border :name="ac.template.couponName"
                         :price="ac.template.parPrice"
                         v-for="ac in goods.parkingGoodsCouponList"
                         bg-color="#FF9E3619"
                         :key="ac.id">
          <template v-slot:left>
            <div>{{ formatExpire(ac.template) }}</div>
          </template>
          <template v-slot:right>
            <div class="useTip">{{ formatLimit(ac.template) }}</div>
          </template>
        </activity-coupon>
      </div>
    </div>
    <div class="card">
      <div class="title">活动说明</div>
      <div class="remark" v-html="goods.description"/>
    </div>
    <van-button round class="btn" :loading="loading" @click="receive">立即兑换</van-button>
  </div>
</template>

<script setup>
import {useRoute} from "vue-router";
import {computed, onMounted, ref} from "vue";
import {closeToast, showLoadingToast, showSuccessToast, Toast} from "vant";
import request from "@/utils/request";
import dayjs from "dayjs";
import ActivityCoupon from "@/views/activity/components/activity-coupon";

const route = useRoute();
const {id} = route.query;
const goods = ref();
const loading = ref(false);

const surplusAmount = computed(() => {
  if (goods.value) {
    return goods.value.amount - goods.value.receiveAmount
  }
  return 0;
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
const formatLimit = template => {
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
    const res = await request.get(`/goods/${id}`);
    goods.value = res.data;
  } finally {
    closeToast();
  }
};

const receive = async () => {
  try {
    loading.value = true
    await request.post(`/goods/exchange/${id}`)
    showSuccessToast('兑换成功');
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

  .price-wrapper {
    display: flex;
    font-size: 24px;
    align-items: end;

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

  .price {
    color: #FF9E36;
    font-weight: bold;
    display: inline-block;

    span:first-of-type {
      font-size: 38px;
      font-family: DIN-Bold;
    }
  }
}

.coupons > div {
  margin-bottom: 20px;
}

.remark {
  font-size: 24px;
  font-weight: 500;
  color: #666666;
}

.useTip {
  font-size: 22px;
  font-weight: 500;
  color: #FF9E36;
  margin-top: 15px;
}

.btn {
  width: 640px;
  margin: 100px 35px 0;
  background: #FF9E36;
  color: #FFFFFF;
}

</style>