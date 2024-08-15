<template>
  <div v-if="processOrders.length" class="orders">
    <van-notice-bar
        left-icon="info"
        color="#1989fa" background="#ecf9ff" :scrollable="false" wrapable
        text="当前停车场下查询到多条停车信息，请选择正在出场的车辆进行缴费"
    />
    <OrderCard v-for="order in processOrders" :order="order" :channel-id="channelId" :show-price="false"/>
  </div>
  <div class="page" v-else>
    <van-loading :size="50" vertical :text-size="14" color="#2462EF" text-color="#2462EF">正在查询停车记录...
    </van-loading>
  </div>
</template>

<script setup>
import {Dialog, showConfirmDialog} from "vant";

import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import request from "@/utils/request";
import OrderCard from "@/components/order-card";

const {query: {channelId, lotCode}} = useRoute();
const router = useRouter();
const processOrders = ref([]);

const loading = ref(true);

onMounted(() => {
  if (!channelId) {
    router.replace({
      name: 'Home',
    })
  } else {
    queryOrder();
  }
});


const queryOrder = async () => {
  try {
    loading.value = true;
    const res = await request.get('/order/channel', {
      params: {
        channelId,
        lotCode
      }
    });
    const orders = res.data;
    if (orders.length) {
      if (orders.length === 1) {
        goConfirm(orders[0]);
      } else {
        console.log(orders)
        processOrders.value = orders;
      }
    } else {
      showConfirmDialog({
        title: '提示',
        message: '未查询到在该停车场的车辆',
        cancelButtonText: '返回首页',
        confirmButtonColor: '#2462EF',
        confirmButtonText: '刷新',
      }).then(() => {
        queryOrder()
      }).catch(() => {
        router.replace({
          name: 'Home',
        })
      })

    }
  } catch (e) {

  } finally {
    loading.value = false;
  }
}

const goConfirm = order => {
  router.replace({
    name: 'PayConfirm',
    query: {
      orderNo: order.orderNo,
      channelId
    }
  })
}

</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orders {
  padding-bottom: 50px;
}
</style>
