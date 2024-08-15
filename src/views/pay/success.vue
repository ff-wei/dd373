<template>
  <div class="page">
    <div class="bg">
      <img src="@/assets/imgs/success.png" alt="success"/>
      <div class="tip">
        <div>支付成功</div>
        <div>剩余出场时间29分30秒，超出后需补缴停车费</div>
      </div>
    </div>
    <div class="content">
      <div class="mask"/>
      <div class="info">
        <div class="header">
          <img src="@/assets/imgs/order.png" alt="order"/>
          <span>订单信息</span>
        </div>
        <div class="divider"/>
        <div class="rows">
          <div class="row">
            <span>车牌号：</span>
            <span>皖A · WA789</span>
          </div>
          <div class="row">
            <span>停车场：</span>
            <span>保利香槟国际停车场</span>
          </div>
          <div class="row">
            <span>入场时间：</span>
            <span>2021-04-16 11:09:21</span>
          </div>
          <div class="row">
            <span>出场时间：</span>
            <span>2021-04-16 14:30:59</span>
          </div>
          <div class="row">
            <span>停车时长：</span>
            <span>3时</span>
          </div>
          <div class="row">
            <span>费用金额：</span>
            <span>￥98.00</span>
          </div>
          <div class="row">
            <span>优惠金额：</span>
            <span>￥5.00</span>
          </div>
          <div class="row">
            <span>实付金额：</span>
            <span>￥93.00</span>
          </div>
        </div>
        <div class="btn-wrapper">
          <button class="ghost-btn" @click="goHome">回首页</button>
          <button class="ghost-btn" @click="goInvoice">电子发票</button>
        </div>
      </div>
      <div class="circles"/>
      <div class="ad">
        <ad-card/>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdCard from "@/components/ad-card";
import {useRouter} from "vue-router";

const router = useRouter();

const goHome = () => {
  router.replace({
    name: 'Home',
  })
}
const goInvoice = () => {
  router.replace({
    name: 'Invoices',
  })
}

</script>


<style lang="scss" scoped>
.page {
  position: relative;
  background: $primary-color;
}

.bg {
  width: 750px;
  height: 372px;
  text-align: center;

  img {
    width: 117px;
    height: 112px;
    margin-top: 46px;
  }

  .tip {
    margin-top: 20px;
    font-size: 28px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 40px;
  }
}

.content {
  position: absolute;
  width: 750px;
  top: 290px;
  left: 0;

  .info {
    width: 650px;
    height: 800px;
    background: #FFFFFF;
    margin-left: 50px;

    .header {
      height: 110px;
      padding: 30px 60px;
      display: flex;
      align-items: center;

      img {
        width: 33px;
        height: 36px;
      }

      span {
        font-size: 36px;
        font-weight: bold;
        color: #333333;
        margin-left: 20px;
      }
    }

    .divider {
      width: 600px;
      height: 1px;
      margin-left: 25px;
      border: 1px dashed #E8E8E8;
      position: relative;

      @mixin circle {
        content: ' ';
        display: inline-block;
        position: absolute;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #f6f6f6;
      }

      &:before {
        @include circle;
        left: -35px;
        top: -10px;
      }

      &:after {
        @include circle;
        right: -35px;
        top: -10px;
      }
    }

    .rows {
      padding: 60px 30px 0;

      .row {
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;

        span {
          font-size: 28px;
          font-weight: 500;

          &:first-of-type {
            color: #999999;
          }

          &:last-of-type {
            color: #333333;
          }
        }
      }
    }

    .btn-wrapper {
      height: 60px;
      margin-top: 40px;
      text-align: right;

      .ghost-btn {
        padding: 0 30px;
        background: #FFFFFF;
        border: 1px solid $primary-color;
        border-radius: 30px;
        font-size: 36px;
        font-weight: bold;
        color: $primary-color;
        line-height: 60px;
        text-align: center;

        &:last-of-type {
          margin-left: 53px;
          margin-right: 30px;
        }
      }
    }
  }


  .mask {
    width: 690px;
    margin-left: 30px;
    box-shadow: 0 0 2px 0 #276ED3;
    background: #2F80F3;
    height: 20px;
    border-radius: 10px;
    filter: blur(2px);
    opacity: .5;
    top: -10px;
    position: absolute;
  }

  .circles {
    width: 650px;
    margin-left: 50px;
    height: 25px;
    background: #F6F6F6;
    background-image: radial-gradient(12px at 20px 20px, transparent, transparent, transparent, transparent, white);
    background-size: 50px 50px;
    background-repeat: repeat-x;
    background-position: 0 0;
  }
}

.ad {
  margin-top: 60px;
  margin-bottom: 44px;
}
</style>
