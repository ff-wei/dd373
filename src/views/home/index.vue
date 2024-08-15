<template>
  <div v-if="loading" class="loading">
    <van-loading :size="50" vertical :text-size="14" color="#2462EF" text-color="#2462EF">正在进入...</van-loading>
  </div>
  <div class="page" v-else>
    <ad-card id="home-ad1" pos-id="768872358929059840" />
    <van-swipe :autoplay="0" :show-indicators="false" :stop-propagation="false">
      <van-swipe-item v-for="order in processOrders">
        <parking-card :order="order"/>
      </van-swipe-item>
      <van-swipe-item>
        <query-card/>
      </van-swipe-item>
      <van-swipe-item>
        <add-card/>
      </van-swipe-item>
    </van-swipe>
    <nav-card/>
  </div>
</template>

<script setup>
import AdCard from "@/components/ad-card";
import NavCard from "@/views/home/components/nav-card";
import QueryCard from "@/views/home/components/query-card";
import ParkingCard from "@/views/home/components/parking-card";
import AddCard from "@/views/home/components/add-card";
import {onMounted, ref} from "vue";
import request from "@/utils/request";
import {useRoute} from "vue-router";

const route = useRoute();

const loading = ref(true);
const ads = ref([]);
const processOrders = ref([]);


const {query: {lotCode}} = route;


onMounted(async () => {
  try {
    loading.value = true
    const res = await request.get('/home', {
      params: {
        lotCode
      }
    });
    processOrders.value = res.data.processOrders || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }

})


</script>

<style lang="scss" scoped>
.loading {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page {
  & > * {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

.btn {
  background-color: $primary-color;
  color: #ffffff;
  border: none;
}

</style>
