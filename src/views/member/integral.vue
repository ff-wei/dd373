<template>

  <div class="integral-banner">
    <div class="integral">
      <div>积分</div>
      <div>{{ member.integral }}</div>
    </div>
    <van-button class="btn" size="small" round :to="{name:'IntegralRecord'}">积分账单</van-button>
  </div>
  <van-pull-refresh v-model="refreshing" @refresh="loadData(true)" class="list-wrapper">
    <van-list :loading="loading" :finished="pageInfo.finished" @load="loadData" v-if="dataSource.length"
              finished-text="没有更多了">
      <exchange-coupon v-for="data in dataSource"
                       :key="data.id"
                       :name="data.goodsName"
                       :price="data.marketPrice"
      >
        <template v-slot:right>
          <van-button class="btn" size="small"  round @click="goDetail(data)">兑换</van-button>
        </template>
      </exchange-coupon>
    </van-list>
    <empty :img="emptyImg" :margin-top="160" tip="暂无可领取的优惠券～" v-else/>
  </van-pull-refresh>
</template>

<script setup>

import useMemberStore from "@/stores/member";
import {storeToRefs} from "pinia";
import {onMounted, reactive, ref} from "vue";
import request from "@/utils/request";
import {useRouter} from "vue-router";
import emptyImg from "@/assets/imgs/no-coupon.png";
import ExchangeCoupon from "@/views/member/components/exchange-coupon";


const memberStore = useMemberStore();
const {member} = storeToRefs(memberStore);

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
    const res = await request.post('/goods/page', {
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
    name: 'GoodsDetail',
    query: {
      id: data.id
    }
  })
};

onMounted(() => {
  memberStore.refreshMemberInfo();
  loadData(true);
});

</script>

<style lang="scss" scoped>
.integral-banner {
  margin: 20px;
  width: 710px;
  height: 120px;
  background-image: url("@/assets/imgs/integral-banner.png");
  background-size: 100%;
  padding: 0 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .integral {
    font-size: 28px;
    font-weight: 500;
    color: #333333;

    div:last-of-type {
      font-size: 44px;
      font-family: DIN-Bold;
    }
  }

  .btn {
    width: 120px;
    height: 44px;
    padding: 0;
  }
}



.list-wrapper {
  padding: 20px;
  min-height: calc(100vh - 160px);
  .btn {
    width: 100px;
    height: 40px;
    flex-shrink: 0;
    margin-left: 10px;
    background: #FF9E36;
    color: #FFFFFF;
  }
}
</style>