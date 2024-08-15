<template>
  <div class="record">
    <div class="header">
      <span>{{
          formatCarNo(order.carNo)
        }}</span>
      <span>{{ order.orderStatus === 1 ? '停车中' : '已完成' }}</span>
    </div>
    <div class="divider"/>
    <div class="rows">
      <div class="row">
        <span>停车场：</span>
        <span>{{ order.merchantName }}</span>
      </div>
      <div class="row">
        <span>入场时间：</span>
        <span>{{
            dayjs(order.startTime).format('YYYY-MM-DD HH:mm')
          }}</span>
      </div>
      <div class="row">
        <span>停车时长：</span>
        <span>{{
            formatTimeFromNow(order.startTime, false)
          }}</span>
      </div>
      <div class="row" v-if="showPrice">
        <span>缴费金额：</span>
        <span class="price">{{ Number(order.actualFee / 100).toFixed(2) }}元</span>
      </div>
    </div>
    <div class="btns">
      <button class="btn" @click="goPay(order.orderNo)" v-if="order.orderStatus === 1">去缴费</button>
      <!--          <button class="ghost-btn">电子发票</button>-->
    </div>
  </div>
</template>

<script name="OrderCard" setup>
import {formatCarNo, formatTimeFromNow} from "@/utils/common";
import dayjs from "dayjs";
import {useRouter} from "vue-router";

const router = useRouter();
const {order, channelId, showPrice} = defineProps({
  order: {
    type: Object,
    default: {},
  },
  channelId: {
    type: String,
    default: null
  },
  showPrice: {
    type: Boolean,
    default: true
  }
});

const goPay = (orderNo) => {
  const query = {orderNo}
  if (channelId) {
    query.channelId = channelId
  }
  router.push({
    name: 'PayConfirm',
    query
  });
}
</script>


<style lang="scss" scoped>
.record {
  margin-top: 30px;
  width: 690px;
  background: #FFFFFF;
  border-radius: 10px;
  margin-left: 30px;
  padding: 0 30px 48px;

  .header {
    padding: 23px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      &:first-of-type {
        font-size: 36px;
        font-weight: bold;
        color: #000000;
        letter-spacing: 2px;
      }

      &:last-of-type {
        font-size: 24px;
        font-weight: 500;
        color: #F21646;
      }
    }
  }

  .divider {
    width: 630px;
    height: 1px;
    background: #E8E8E8;
  }


  .rows {
    padding-top: 40px;

    .row {
      margin-bottom: 30px;

      span {
        font-size: 28px;
        font-weight: 500;
        color: #999999;

        &:last-of-type {
          font-weight: bold;
          color: #333333;
        }
      }

      .price {
        color: #F24545 !important;
      }
    }
  }

  .btns {
    text-align: right;
  }

  .btn {
    height: 60px;
    line-height: 60px;
    padding: 0 40px;
    background: $primary-color;
    border-radius: 30px;
    font-size: 28px;
    font-weight: bold;
    color: #FFFEFE;
  }

  .ghost-btn {
    @extend .btn;
    background: #FFFFFF;
    border: 1px solid $primary-color;
    color: $primary-color;
  }
}
</style>
