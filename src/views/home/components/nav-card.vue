<template>
  <div class="grid-card">
    <div v-for="nav in navs" @click="goPage(nav)">
      <img :src="nav.img"/>
      <span>{{ nav.label }}</span>
    </div>
  </div>
</template>
<script setup>
import CarIcon from "@/assets/imgs/my-car.png";
import CouponIcon from "@/assets/imgs/my-coupon.png";
import RecordIcon from "@/assets/imgs/my-record.png";
import InvoiceIcon from "@/assets/imgs/my-invoice.png";
import MemberIcon from "@/assets/imgs/my-member.png";
import CouponCenterIcon from "@/assets/imgs/my-coupon-center.png";
import {useRouter} from "vue-router";

const router = useRouter();

const navs = [
  {
    label: '我的车牌',
    img: CarIcon,
    name: 'Cars',
  },
  {
    label: '我的卡券',
    img: CouponIcon,
    name: 'CouponList',
  },
  {
    label: '停车记录',
    img: RecordIcon,
    name: 'Records',
  },
  {
    label: '电子发票',
    img: InvoiceIcon,
    name: 'Invoices',
  },
  {
    label: '会员中心',
    img: MemberIcon,
    name: 'Member',
  },
  {
    label: '领券中心',
    img: CouponCenterIcon,
    name: 'Activities',
  }
];

const goPage = nav => {
  router.push({name: nav.name})
}

</script>

<style lang="scss" scoped>
.grid-card {
  padding: 40px 0;
  display: grid;
  width: 690px;
  border-radius: 10px;
  background-color: #ffffff;
  margin: 0 auto;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 38px 0;

  div {
    text-align: center;
  }

  img {
    width: 86px;
    height: 86px;
    display: block;
    margin: 0 auto;
    margin-bottom: 20px;
  }

  span {
    font-size: 28px;
    font-weight: 500;
    color: #333333;
  }
}
</style>
