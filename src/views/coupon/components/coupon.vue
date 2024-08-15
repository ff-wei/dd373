<template>
  <div class="coupon">
    <div class="coupon-head">
      <div>
        <div class="price">
          <span>¥</span>
          <span>{{ price }}</span>
        </div>
        <div class="use-tip">{{ useTip }}</div>
      </div>
      <div class="info">
        <div class="line-1">{{ data.template.couponName }}</div>
        <div>
          <span>{{ overTip }}</span>
          <span v-if="data.carNo">，限{{ props.data.carNo }}使用</span>
        </div>
        <div>有效期：{{ dayjs(data.expireTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
      </div>
    </div>
    <div class="coupon-footer">
      <van-button type="primary" plain class="btn" round v-if="data.template.isGiveAway" @click="send">转赠</van-button>
      <van-button type="primary" class="btn" round @click="useCoupon" :loading="loading">立即使用</van-button>
    </div>
  </div>

</template>

<script setup>

import {computed, ref} from "vue";
import dayjs from "dayjs";
import request from "@/utils/request";
import {showToast, Toast} from "vant";
import {useRouter} from "vue-router";

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
});

const router = useRouter();

const loading = ref(false);

const price = computed(() => {
  return Number(props.data.template.parPrice / 100).toFixed(2)
})

const useTip = computed(() => {
  const useMinPrice = props.data.template.useMinPrice;
  if (useMinPrice === 0) {
    return "无使用条件"
  } else {
    return `满${Number(useMinPrice / 100).toFixed(2)}元可用`
  }
})
const overTip = computed(() => {
  if (props.data.template.overlyFlag) {
    return "可叠加使用"
  } else {
    return "不可叠加使用"
  }
});

const isDisabled = computed(() => {
  return props.data.couponStatus !== 1
});

const send = () => {
  router.push({
    name: 'SendCoupon',
    query: {
      id: props.data.id,
    }
  });
}

const useCoupon = async () => {
  if (isDisabled.value) return;
  try {
    loading.value = true
    const res = await request.get('/order/process', {
      params: {
        carNo: props.data.carNo
      }
    });
    const processOrders = res.data.filter(order => props.data.merchantCodes.indexOf(order.merchantCode) >= 0);
    if (processOrders.length) {
      if (processOrders.length === 1) {
        router.push({
          name: `PayConfirm`,
          query: {
            orderNo: processOrders[0].orderNo
          },
        })
      }
    } else {
      showToast("未找到可以使用该优惠券的停车记录")
    }
  } finally {
    loading.value = false
  }
}

</script>

<style lang="scss" scoped>
.coupon {
  box-sizing: border-box;
  width: 690px;
  height: 240px;
  margin: 20px auto 0;
  background: #F9F9F9;
  border-radius: 10px;
  background: radial-gradient(circle at 0% 160px, transparent 15px, #FFF 0) no-repeat left / 51% 100%,
  radial-gradient(circle at 100% 160px, transparent 15px, #FFF 0) no-repeat right / 51% 100%;
  padding: 0 20px;

  &-head {
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;

    .price {
      width: 190px;
      font-size: 36px;
      font-weight: bold;
      color: #FF9E36;
      text-align: center;

      span:last-of-type {
        font-size: 56px;
        margin-left: 5px;
      }
    }

    .use-tip {
      background: #FF9E36;
      color: #FFFFFF;
      font-size: 20px;
      width: fit-content;
      margin: 5px auto 0;
      font-weight: bolder;
      padding: 5px 10px;
      border-radius: 25px;
    }

    .info {
      height: 120px;
      padding-left: 30px;
      flex-grow: 1;
      border-left: 1px solid #E8E8E8;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      div {
        font-size: 20px;
        font-weight: 500;
        color: #A4A4A4;

        &:first-of-type {
          font-size: 32px;
          font-weight: bold;
          color: #000000;
        }

        &:nth-of-type(2) {
          font-size: 20px;
          font-weight: 500;
          color: #A4A4A4;
        }
      }
    }
  }

  &-footer {
    width: 100%;
    height: 80px;
    border-top: 1px solid #E8E8E8;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: end;

    .btn {
      width: 160px;
      height: 52px;
      font-size: 28px;
      font-weight: bold;
      padding: 0;
      margin-left: 20px;
    }
  }
}
</style>