<template>
  <van-pull-refresh v-model="refreshing" @refresh="loadData(true)" class="list-wrapper">
    <van-list :loading="loading" :finished="pageInfo.finished" @load="loadData" v-if="dataSource.length"
              finished-text="没有更多了">
      <activity-coupon divider-color="#F8F6F7" divider-bg-color="#F8F6F7" :name="data.activityName"
                       :price="data.marketPrice" v-for="data in dataSource" :key="data.id">
        <template v-slot:left>
          活动时间：{{ `${dayjs(data.startDate).format('YYYY/MM/DD')} ~ ${dayjs(data.endDate).format('YYYY/MM/DD')}` }}
        </template>
        <template v-slot:right>
          <van-button size="mini" class="btn" type="primary" round @click="goDetail(data)">免费领取</van-button>
        </template>
      </activity-coupon>
    </van-list>
    <empty :img="emptyImg" tip="暂无可领取的优惠券～" v-else/>
  </van-pull-refresh>
</template>

<script setup>
import ActivityCoupon from "./components/activity-coupon";
import emptyImg from "@/assets/imgs/no-coupon.png";
import {onMounted, reactive, ref} from "vue";
import request from "@/utils/request";
import Empty from "@/components/empty";
import dayjs from "dayjs";
import {useRouter} from "vue-router";

const dataSource = ref([]);
const loading = ref(false);
const refreshing = ref(false);

const router = useRouter();

const pageInfo = reactive({
  size: 5,
  current: 0,
  finished: false
});

const loadData = async (isRefresh) => {
  try {
    if (isRefresh) {
      refreshing.value = true;
    } else {
      loading.value = true
    }
    const res = await request.post('/coupon/activities', {
      size: pageInfo.size,
      current: isRefresh ? 1 : (pageInfo.current + 1)
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
};

const goDetail = (data) => {
  router.push({
    name: 'ActivityDetail',
    query: {
      id: data.id
    }
  })
};

onMounted(() => {
  loadData();
});

</script>

<style lang="scss" scoped>
.list-wrapper {
  padding: 20px;
  min-height: 100vh;
}
.btn {
  width: 133px;
  font-size: 24px;
  margin-top: 14px;
}
</style>