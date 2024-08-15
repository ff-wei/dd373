<template>
  <div class="header">
    <span>{{ member.integral }}</span>
    <span>积分</span>
  </div>
  <div class="card">
    <van-tabs v-model:active="currentIdx" :items="tabs" color="#2462EF">
      <van-tab v-for="tab in tabs" :name="tab.name" :title="tab.label"/>
    </van-tabs>
    <div class="divider"/>
    <div class="body">
      <div class="month-picker" @click="showPicker=true">
        <span>{{ dayjs(currentMonth.join('-')).format('YYYY年MM月') }}</span>
        <img src="@/assets/imgs/arrow-down.png"/>
      </div>
      <div class="tip" v-if="currentIdx===1">获取<span>{{ sum.add }}</span>积分 消耗{{ sum.sub }}积分</div>
      <div class="list">
        <div class="row" v-for="data in dataList" :key="data.id">
          <div class="row-left">
            <div>{{ currentIdx === 1 ? data.remark : `兑换${data.goodsName}` }}</div>
            <div>{{ dayjs(currentIdx === 1 ? data.createTime : data.exchangeTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
          </div>
          <div :class="['row-right',data.direction===1?'plus':'']">
            <span v-if="currentIdx===1">{{
                data.direction === 1 ? '+' : '-'
              }}{{ data.integral }}
          </span>
            <span v-else>
              -{{ data.exchangePoint }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-date-picker
        v-model="currentMonth"
        @cancel="showPicker = false"
        @confirm="showPicker=false"
        :max-date="now"
        :columns-type="['year','month']"
        title="选择月份"
        @change="loadData"
    />
  </van-popup>
</template>

<script setup>
import useMemberStore from "@/stores/member";
import {storeToRefs} from "pinia";
import {computed, onMounted, ref, watch} from "vue";
import dayjs from "dayjs";
import {closeToast} from "vant";
import request from "@/utils/request";

const memberStore = useMemberStore();
const {member} = storeToRefs(memberStore);

const now = new Date();
const tabs = [{name: 1, label: '积分收支明细'}, {name: 2, label: '兑换记录'}];
const currentIdx = ref(1);
const currentMonth = ref([now.getFullYear().toString(), now.getMonth().toString()]);
const showPicker = ref(false);
const dataList = ref([]);

const loadData = async () => {
  try {
    dataList.value = [];
    const url = currentIdx.value === 1 ? '/integral/list' : '/goods/exchangeRecord';
    const res = await request.get(url, {
      params: {
        month: dayjs(currentMonth.value.join('-')).format('YYYY-MM')
      }
    })
    dataList.value = res.data || [];
  } finally {
    closeToast();
  }
};

const sum = computed(() => {
  const sum = {
    add: 0,
    sub: 0,
  }
  dataList.value.forEach(it => {
    if (it.direction === 1) {
      sum.add += it.integral;
    } else {
      sum.sub += it.integral
    }
  });
  return sum
})


watch(currentIdx, loadData)


onMounted(() => {
  memberStore.refreshMemberInfo();
  loadData()
})
</script>

<style lang="scss" scoped>
.header {
  background-image: url("@/assets/imgs/integral-record-bg.png");
  width: 750px;
  height: 260px;
  background-size: 100%;
  padding-top: 68px;
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  color: $primary-color;

  span:last-of-type {
    font-size: 24px;
  }
}

.card {
  position: fixed;
  top: 210px;
  left: 30px;
  width: 690px;
  height: calc(100vh - 210px);
  background: #FFFFFF;
  border-radius: 10px;
  overflow-y: auto;

  .divider {
    width: 100%;
    height: 1px;
    background: #E8E8E8;
    margin: 20px 0;
  }

  .body {
    padding: 0 30px;

    .month-picker {
      width: 220px;
      height: 60px;
      border: 2px solid #E8E8E8;
      border-radius: 6px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: 24px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 30px;

      img {
        width: 20px;
        height: 12px;
      }
    }

    .tip {
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      margin-bottom: 30px;

      span {
        color: $primary-color;
      }
    }
  }

  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30px 0;
    border-top: 1px solid #E8E8E8;

    &-left {
      font-size: 28px;
      font-weight: 500;
      color: #333333;

      div:last-of-type {
        font-size: 20px;
        font-weight: 500;
        color: #999999;
        margin-top: 9px;
      }
    }

    &-right {
      font-size: 28px;
      font-weight: 500;
      color: #333333;
    }

    .plus {
      color: $primary-color;
    }

  }


}
</style>