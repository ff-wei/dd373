<template>
  <div class="page" v-if="orderInfo&&!error">
    <div class="bg">
      <div class="fee" v-if="orderInfo.orderStatus===2">车辆已出场</div>
      <div v-else-if="orderInfo.waitPayFee">
        <div class="fee-tip">
          <span>待缴金额(元)</span>
        </div>
        <div class="fee">¥ {{ actualPayFee }}</div>
      </div>
      <div class="fee" v-else>当前费用已缴清，请出场</div>
    </div>
    <div class="content">
      <div class="info-card">
        <div class="row">
          <span class="label">车牌号：</span>
          <span class="value">{{ carNo }}</span>
        </div>
        <div class="row">
          <span class="label">停车场：</span>
          <span class="value">{{ orderInfo.merchantName }}</span>
        </div>
        <div class="row">
          <span class="label">入场时间：</span>
          <span class="value">{{ orderInfo.startTime }}</span>
        </div>
        <div class="row" v-if="orderInfo.orderStatus===2">
          <span class="label">出场时间：</span>
          <span class="value">{{ orderInfo.endTime }}</span>
        </div>
        <div class="row">
          <span class="label">查询时间：</span>
          <span class="value">{{ now.format('YYYY-MM-DD HH:mm:ss') }}</span>
        </div>
        <div class="row">
          <span class="label">停车时长：</span>
          <span class="value">{{
              orderInfo.orderStatus === 1 ? (orderInfo.waitPayFee ? duration : formatTimeFromNow(orderInfo.startTime)) : formatTimeFrom(orderInfo.endTime, orderInfo.startTime)
            }}</span>
        </div>
        <div class="row">
          <span class="label">订单金额：</span>
          <span class="value">¥{{ Number((orderInfo.waitPayFee || orderInfo.orderFee) / 100).toFixed(2) }}</span>
        </div>

        <div class="row">
          <span class="label">优惠金额：</span>
          <span class="value">- ¥{{
              Number((orderInfo.waitPayFee ? discountFee : orderInfo.discountFee) / 100).toFixed(2)
            }}</span>
        </div>
        <div class="row" v-if="cardFee">
          <span class="label">会员卡抵扣：</span>
          <span class="value">-¥{{ Number(cardFee / 100).toFixed(2) }}</span>
        </div>
        <div class="row" v-if="vipDiscountFee">
          <span class="label">会员折扣：</span>
          <span class="value">-¥{{ Number(vipDiscountFee / 100).toFixed(2) }}({{ level.discount * 10 }}折)</span>
        </div>
      </div>
      <div class="extra-card" @click="showCoupon=!!coupons.length"
           v-if="orderInfo.orderStatus!==2&&orderInfo.waitPayFee">
        <span class="label">使用优惠券：</span>
        <span class="tip tip-active">{{ couponTip }}</span>
      </div>
      <template v-if="account&&orderInfo.orderStatus!==2&&orderInfo.waitPayFee">
        <div class="extra-card">
          <span class="label">可用余额：</span>
          <span class="tip tip-active">{{
              balance
            }} {{ Number(balance) < Number(actualPayFee) ? '(余额不足)' : '' }} </span>
        </div>
        <div class="extra-card" style="margin-top: 0;padding-top: 0;">
          <span class="label">使用余额支付：</span>
          <van-checkbox v-model="useBalance" :disabled="Number(balance) < Number(actualPayFee)"/>
        </div>
      </template>

      <van-button class="btn" @click="pay" type="primary" round :loading="payLoading"
                  v-if="orderInfo.waitPayFee&&orderInfo.orderStatus===1">
        确认支付
      </van-button>
      <!--      <div style="width: 70vw;margin: 20px auto">-->
      <!--        <ad-card id="pay-ad" pos-id="768872450926923776" />-->
      <!--      </div>-->

    </div>
    <coupon-picker v-model:show="showCoupon" v-model:choose-coupon-ids="chooseCouponIds" :coupons="coupons"
                   @ok="chooseCoupon" :use-min="orderInfo?.waitPayFee" :merchant-code="orderInfo.merchantCode"/>
  </div>
  <empty :img="errorImg" btn-text="点击刷新" tip="查询停车记录错误" @btnClick="loadData" show-btn v-if="error"/>

</template>

<script setup>
import errorImg from "@/assets/imgs/error.png";
import {computed, onBeforeUnmount, onMounted, onUnmounted, ref} from "vue";
import CouponPicker from "@/views/pay/components/coupon-picker";
import {useRoute, useRouter} from "vue-router";
import {closeToast, showLoadingToast, showToast, Toast} from "vant";
import request from "@/utils/request";
import {formatCarNo, formatTimeFrom, formatTimeFromNow} from "@/utils/common";
import Empty from "@/components/empty";
import {getAgent} from "@/utils/client";
import AdCard from "@/components/ad-card";
import dayjs from "dayjs";

const {query: {orderNo, channelId}} = useRoute();

const payLoading = ref(false);
const error = ref(false);

const now = dayjs();

const orderInfo = ref(undefined);
const coupons = ref([]);
const account = ref(null);
const level = ref(null);
const cardFee = ref(null);

const duration = ref("00时00分00秒");

const interval = ref(null);

const showCoupon = ref(false);
const chooseCouponIds = ref([]);
const useBalance = ref(false);

const refreshTimeout = ref(null);


const calcDuration = () => {
  duration.value = formatTimeFromNow(orderInfo.value.startTime);
}


const carNo = computed(() => {
  if (orderInfo.value) {
    return formatCarNo(orderInfo.value.carNo)
  }
  return null
});

const couponTip = computed(() => {
  if (coupons.value.length) {
    if (chooseCouponIds.value.length) {
      return `已选择使用${chooseCouponIds.value.length}张优惠券`
    }
    return `${coupons.value.length}张优惠券>`;
  } else {
    return '暂无可用优惠券'
  }
});
const balance = computed(() => {
  return account ? (account.value.balance / 100).toFixed(2) : 0
})

const router = useRouter();


onBeforeUnmount(() => {
  closeToast();
  if (refreshTimeout.value) {
    clearTimeout(refreshTimeout.value);
  }
});

const loadData = async () => {
  try {
    showLoadingToast({
      message: '正在查询',
      duration: 0,
    });
    const res = await request.get(`/order/info`, {
      params: {orderNo, channelId}
    })
    orderInfo.value = res.data.order;
    coupons.value = res.data.coupons;
    account.value = res.data.account;
    level.value = res.data.level;
    cardFee.value = res.data.cardFee;
    if (orderInfo.value.orderStatus === 1) {
      interval.value = setInterval(() => {
        calcDuration();
      }, 1000);
    }
    refreshTimeout.value = setTimeout(() => {
      location.reload();
    }, 1000*60*5);
    chooseDefaultCoupon();
    closeToast();
    error.value = false
  } catch (e) {
    error.value = true
  }
}


const chooseCoupon = couponIds => {
  chooseCouponIds.value = couponIds;
};

const chooseDefaultCoupon = () => {
  if (orderInfo.value?.orderStatus !== 2 && orderInfo.value?.waitPayFee && coupons.value.length) {
    const waitPayFee = orderInfo.value.waitPayFee;
    const canUseCoupons = coupons.value.filter(it => {
      return it.couponStatus === 1 && it.template.useMinPrice <= waitPayFee && it.merchantCodes.indexOf(orderInfo.value.merchantCode) >= 0
    }).sort((a, b) => a.template.parPrice - b.template.parPrice);
    if (canUseCoupons.length) {
      chooseCouponIds.value = [canUseCoupons[0].id];
    }
  }
}

const discountFee = computed(() => {
  const waitPayFee = orderInfo.value.waitPayFee || 0;
  const reduce = coupons.value.filter(coupon => chooseCouponIds.value.indexOf(coupon.id) >= 0).map(coupon => coupon.template.parPrice).reduce((a, b) => a + b, 0);
  let value = 0;
  if (reduce > 0) {
    value = reduce > waitPayFee ? waitPayFee : reduce;
  }
  return value;
});

const vipDiscountFee = computed(() => {
  if (level.value && level.value.discount < 1) {
    const payFee = (orderInfo.value.waitPayFee || 0) - discountFee.value - cardFee.value;
    return payFee * (1 - level.value.discount);
  }
  return 0;
});

const actualPayFee = computed(() => {
  let value = ((orderInfo.value.waitPayFee || 0) - discountFee.value - vipDiscountFee.value - cardFee.value) / 100;
  if (value < 0) {
    value = 0;
  }
  return Number(value).toFixed(2);
});


const pay = async () => {
  try {
    payLoading.value = true;
    // router.replace({
    //   path: '/pay/success',
    // })

    const res = await request.post("/order/initPay", {
      orderNo,
      channelId,
      couponIds: chooseCouponIds.value,
      useBalance: useBalance.value
    });
    if (res.data === true) {
      loadData();
    } else if (typeof res.data === 'string') {
      if (res.data.startsWith("http")) {
        window.location.href = res.data
      }
    } else if (res.data.url) {
      const form = document.createElement("form");
      form.action = res.data.url;
      form.method = 'post';
      Object.keys(res.data.params).forEach(k => {
        const input = document.createElement("input")
        input.type = 'hidden'
        input.name = k
        input.value = res.data.params[k]
        form.appendChild(input)
      })
      document.body.append(form)
      form.submit()
    } else {
      const agent = getAgent();
      if (agent === 'wx') {
        WeixinJSBridge.invoke('getBrandWCPayRequest', res.data);
      }
      if (agent === 'alipay') {
        AlipayJSBridge.call("tradePay", {
          tradeNO: res.data, // 必传，此使用方式下该字段必传
        }, function ({resultCode}) {
          if (resultCode === '9000') {
            fetch('https://bojuliang.yuntingiot.com/api/getAc/djUrl/768872543235166208').then(res => res.json()).then(res => {
              if (res.code === 200) {
                AlipayJSBridge.call('pushWindow', {
                  url: res.data,
                  param: {
                    backBehavior: 'pop',
                    closeCurrentWindow: true
                  }
                });
              } else {
                loadData()
              }
            }).catch(loadData);
          } else {
            showToast('未完成支付');
          }
        });
      }
    }
  } finally {
    payLoading.value = false;
  }
};


onMounted(() => {
  loadData();
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});
</script>

<style lang="scss" scoped>
.page {
  position: relative;
}

.bg {
  width: 750px;
  height: 300px;
  background: #2462EF;
  text-align: center;
  padding-top: 60px;

  .fee-tip {
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
  }

  .fee {
    margin-top: 30px;
    font-size: 50px;
    font-weight: bold;
    color: #FFFFFF;
  }
}

.content {
  position: absolute;
  top: 220px;
  left: 20px;
  right: 20px;
}

.card {
  width: 710px;
  background: #FFFFFF;
  border-radius: 10px;
}

.info-card {
  @extend .card;
  padding: 37px 40px;

  .row {
    &:not(:first-of-type) {
      margin-top: 25px;
    }

    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 28px;
      font-weight: 500;
      color: #999999;
    }

    .value {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      flex-grow: 1;
      text-align: right;
    }
  }
}

.extra-card {
  @extend .card;
  margin: 30px 0 0;
  padding: 37px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;


  .label {
    font-size: 28px;
    font-weight: bold;
    color: #333333;
  }

  .tip {
    font-size: 20px;
    font-weight: 500;
    color: #999999;

    &-active {
      color: $primary-color;
    }
  }
}

.btn {
  width: 520px;
  height: 80px;
  margin: 80px 95px 0;
}
</style>
