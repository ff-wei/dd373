<template>
  <van-tabs v-model:active="currentIdx" :items="tabs" color="#2462EF">
    <van-tab v-for="tab in tabs" :name="tab.name" :title="tab.label"/>
  </van-tabs>
  <van-pull-refresh v-model="refreshing" @refresh="loadData(true)" class="list-wrapper">
    <van-list :loading="loading" :finished="pageInfo.finished" @load="loadData" v-if="dataSource.length"
          finished-text="没有更多了">
      <OrderCard v-for="order in dataSource" :order="order"/>
    </van-list>
    <empty :img="emptyImg" tip="暂无停车记录～" hasTab v-else/>
  </van-pull-refresh>

</template>

<script setup>
import Empty from "@/components/empty";
import emptyImg from "@/assets/imgs/no-record.png";

import {onMounted, reactive, ref, watch} from "vue";
import request from "@/utils/request";
import {useRouter} from "vue-router";
import OrderCard from "@/components/order-card";


const router = useRouter();

const currentIdx = ref(0);
const dataSource = ref([]);
const loading = ref(false);
const refreshing = ref(false);


const pageInfo = reactive({
  size: 5,
  current: 0,
  finished: false
});

const tabs = [{name: 0, label: '全部'}, {name: 1, label: '停车中'}, {name: 2, label: '已完成'}]


onMounted(() => {
  loadData();
})

watch(currentIdx, () => {
  pageInfo.current = 0;
  pageInfo.finished = false;
  dataSource.value = [];
  loadData();
});


const loadData = async (isRefresh) => {
  try {
    let orderStatus = currentIdx.value;
    if (orderStatus === 0) {
      orderStatus = null;
    }
    if (isRefresh) {
      refreshing.value = true;
    } else {
      loading.value = true
    }
    const res = await request.post('/order/my', {
      size: pageInfo.size,
      current: isRefresh ? 1 : (pageInfo.current + 1),
      orderStatus
    });
    const {records, pages, current} = res.data;
    if (isRefresh) {
      dataSource.value = records;
    } else {
      dataSource.value.push(...records)
    }
    pageInfo.finished = current >= pages
    pageInfo.current = current
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
}


</script>


<style lang="scss" scoped>
.list-wrapper {
  min-height: calc(100vh - 100px);
}
</style>
