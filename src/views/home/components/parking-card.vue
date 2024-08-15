<template>
  <card :icon="Icon" :title="order.merchantName">
    <div class="content">
      <div class="car-no">{{ carNo }}</div>
      <div class="infos">
        <div>
          <span>{{ duration }}</span>
          <span class="tip">停车时长</span>
        </div>
      </div>
      <button class="pay-btn" @click="goPay">缴费出场</button>
    </div>
  </card>
</template>

<script name="orderCard" setup>
import Card from "@/views/home/components/card";
import Icon from '@/assets/imgs/park.png';
import {useRouter} from "vue-router";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {formatCarNo, formatTimeFromNow} from "@/utils/common";

const {order} = defineProps({
  order: {
    type: Object,
    default: null
  }
});

const duration = ref("00:00:00");
const interval = ref(null)

const calcDuration = () => {
  duration.value = formatTimeFromNow(order.startTime);
}
onMounted(() => {
  interval.value = setInterval(() => {
    calcDuration()
  }, 1000);
});

onUnmounted(() => {
  if (interval.value) {
    clearInterval(interval.value);
  }
});

// const fee = computed(() => Number(order.orderFee / 100).toFixed(2))
const carNo = computed(() => formatCarNo(order.carNo));

const router = useRouter();

const goPay = () => {
  router.push({
    name: `PayConfirm`,
    query: {
      orderNo: order.orderNo
    }
  })
}
</script>

<style lang="scss" scoped>
.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.car-no {
  font-size: 36px;
  font-weight: bold;
  color: #2462EF;
  margin-top: 40px;
  letter-spacing: 2px;
}

.infos {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  color: #333333;

  & > div {
    display: flex;
    flex-direction: column;
    margin: 0 60px;
    text-align: center;
  }

  .tip {
    font-size: 20px;
    font-weight: 500;
    color: #999999;
    margin-top: 15px;
  }
}

.pay-btn {
  background-color: $primary-color;
  border: none;
  color: #FFFFFF;
  width: 360px;
  height: 80px;
  border-radius: 40px;
  margin-top: auto;
  font-size: 36px;
  font-weight: bold;
}

</style>
