<template>
  <van-popup :show="props.show" @update:show="e=>emits('update:show',e)" position="bottom" class="popup" round>
    <div class="container">
      <div class="header">
        <span class="title">使用优惠券</span>
        <img src="@/assets/imgs/close.png" alt="close" @click="emits('update:show',false)"/>
      </div>
      <div class="coupons">
        <coupon v-for="coupon in props.coupons" :data="coupon" is-choose :can-choose="checkCanChoose(coupon)" :merchant-code="props.merchantCode"
                :use-min="props.useMin"
                @choose="choose"
                :checked="props.chooseCouponIds.indexOf(coupon.id)>=0"/>
      </div>
      <button class="btn" @click="onOk">
        <span>确定</span>
        <span v-if="props.chooseCouponIds.length">(已选择{{ chooseCouponIds.length }}张)</span>
      </button>
    </div>
  </van-popup>
</template>

<script setup>
import Coupon from "@/components/coupon";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  chooseCouponIds: {
    type: Array,
    default: [],
  },
  coupons: {
    type: Array,
    required: true
  },
  useMin: {
    type: Number,
    default: 0
  },
  merchantCode: {
    type: String,
  }
});


const emits = defineEmits(['update:show']);



const onOk = () => {
  emits('update:show', false);
}

const checkCanChoose = coupon => {
  if (props.chooseCouponIds.length) {
    if (props.chooseCouponIds.indexOf(coupon.id) >= 0) {
      return true
    }
    const checkCoupons = props.coupons.filter(it => props.chooseCouponIds.indexOf(it.id) >= 0);
    const hasOverly = checkCoupons.filter(it => it.template.overlyFlag).length > 0;
    if (hasOverly) {
      return coupon.template.overlyFlag
    }
    return false;
  }
  return true;
}

const choose = (coupon) => {
  const idx = props.chooseCouponIds.findIndex(it => coupon.id === it);
  if (idx >= 0) {
    props.chooseCouponIds.splice(idx, 1);
  } else {
    props.chooseCouponIds.push(coupon.id);
  }
}

</script>

<style lang="scss" scoped>

.container {
  padding: 50px 0 0;
  position: relative;
  height: 830px;
  background: #f6f6f6;
}

.loading-wrapper {
  height: 740px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header {
  display: flex;
  align-items: center;
  padding: 0 30px;

  .title {
    font-size: 36px;
    font-weight: bold;
    color: #333333;
    margin: 0 auto;
  }

  img {
    width: 28px;
    height: 28px;
    margin-right: 0;
  }
}

.coupons {
  padding: 50px 30px 0;
  height: 620px;
  overflow-y: auto;

  & > * {
    margin-bottom: 30px;
  }
}

.btn {
  width: 460px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: $primary-color;
  border-radius: 40px;
  font-size: 36px;
  font-weight: bold;
  color: #FFFFFF;
  margin: 0 145px;
}
</style>
