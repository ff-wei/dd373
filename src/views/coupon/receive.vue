<template>
  <div class="page">
    <div class="title">输入您的车牌号进行领取</div>
    <car-no-keyboard v-model:value="carNo">
      <template v-slot:default="{activeIdx,onNoClick}">
        <div class="no-input-wrapper">
          <template v-for="idx in 8">
                <span :class="['code',idx-1===activeIdx&&'active',(idx===8&&!carNo[7])?'energy':'']"
                      @click="onNoClick(idx-1)">{{ carNo[idx - 1] || (idx === 8 ? '新' : '') }}</span>
            <span class="dot" v-if="idx===2"/>
          </template>
        </div>
      </template>
    </car-no-keyboard>
    <div style="display: flex;justify-content: space-evenly">
      <van-button type="primary" :loading="loading" loading-text="正在领取" round class="btn" @click="receiveCoupon(carNo.join(''))">确认领取</van-button>
      <van-button type="success"  round class="btn" @click="showCarNos=true">选择车牌</van-button>
    </div>
    <div style="margin-top: 30px;text-align: center">
      <van-button round class="btn"   @click="router.push({name:'Home'})">返回首页</van-button>
    </div>
  </div>
  <van-popup v-model:show="showCarNos" position="bottom" class="popup" round>
    <div class="container">
      <div class="header">
        <span class="title">选择车牌领取</span>
        <img src="@/assets/imgs/close.png" alt="close" @click="emits('update:show',false)"/>
      </div>
      <div class="cars">
        <div class="car" v-for="(car,idx) in cars">
          <img src="@/assets/imgs/car.png" alt="car" class="car-img">
          <span class="car-no">{{formatCarNo(car.carNo) }}</span>
          <van-button style="margin-left: auto" type="primary" round size="small" @click="receiveCoupon(car.carNo)">领 取</van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import {closeToast, Dialog, showConfirmDialog, showLoadingToast, showToast, Toast} from 'vant';
import {formatCarNo} from "@/utils/common";
import {useRoute, useRouter} from "vue-router";
import request from "@/utils/request";
import {onMounted, ref} from "vue";
import CarNoKeyboard from "@/components/car-no-keyboard";


const router = useRouter();
const route = useRoute();
const {code} = route.query;
const carNo = ref([]);
const loading = ref(false);
const showCarNos = ref(false);
const cars = ref([]);

const receiveCoupon = async (carNumber) => {
  if(carNumber.length<7){
    showToast('请输入正确的车牌号');
    return;
  }
  try {
    loading.value = true
    const res = await request.put('/coupon/receive', {
      code,
      carNo: carNumber,
    })
    showConfirmDialog({
      title: '',
      message: '领取优惠券成功',
      cancelButtonText: '查看优惠券',
      confirmButtonText: '立即使用',
    }).then(() => {
      const processOrders = res.data;
      if (processOrders?.length) {
        router.replace({
          name: `PayConfirm`,
          query: {
            orderNo: processOrders[0].orderNo
          }
        });
      } else {
        router.replace({
          name: 'Home'
        });
      }

    }).catch(() => {
      router.replace({
        name: 'CouponList'
      })
    })
  } catch (e) {

  } finally {
    loading.value = false
  }

};

const loadCars = async () => {
  showLoadingToast({
    message: '加载中',
    duration: 0
  })
  const res = await request('/car/my');
  closeToast();
  cars.value = res.data;
  if (cars.value.length) {
    showCarNos.value = true
  }
};
onMounted(() => {
  loadCars();
})
</script>
<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  padding-top: 100px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}

.btn {
  width: 300px;
}

.no-input-wrapper {
  margin: 100px 0;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  padding: 30px;

  .code {
    width: 60px;
    height: 72px;
    line-height: 72px;
    border: 1px solid #CCCCCC;
    font-size: 36px;
    font-weight: bold;
    color: #333333;
    text-align: center;

    &.active {
      border-color: $primary-color;
    }
  }

  .dot {
    width: 12px;
    height: 12px;
    background-color: #333333;
    border-radius: 50%;
  }

  .energy {
    font-size: 17px;
    font-weight: 500;
    color: #999999;
  }
}

.header {
  display: flex;
  align-items: center;
  padding: 0 30px;

  .title {
    font-size: 34px;
    font-weight: bold;
    color: #333333;
    margin: 0 auto;
  }

  img {
    width: 32px;
    height: 32px;
    margin-right: 0;
  }
}

.container {
  padding: 50px 0 0;
  position: relative;
  height: 830px;
  background: #f6f6f6;
}
.cars {
  margin: 50px 30px 0;
  height: 680px;
  overflow-y: auto;

  .car {
    width: 690px;
    height: 120px;
    display: flex;
    align-items: center;
    background: #FFFFFF;
    border-radius: 10px;
    margin: 0 auto 30px;
    padding: 20px 30px;
    .car-img {
      width: 80px;
      height: 80px;
    }

    .car-no {
      font-size: 36px;
      font-weight: bold;
      color: #000000;
      margin-left: 22px;
      letter-spacing: 2px;
    }

  }
}
</style>
