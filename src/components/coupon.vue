<template>
  <div :class="['coupon',isDisabled&&'disable']" @click="clickCoupon">
    <div class="price">
      <div>
        <span>￥</span>
        <span>{{ price }}</span>
      </div>
      <div class="tip">{{ useTip }}</div>
    </div>
    <div class="divider"/>
    <div class="info">
      <div style="display: flex;align-items: center">
        <div>
          <div class="name">{{ props.data.template.couponName }}</div>
          <div class="tip">{{ overTip }}</div>
          <div class="tip" v-if="props.data.carNo">限{{ props.data.carNo }}使用</div>
          <div class="tip">有效期：{{ dayjs(props.data.expireTime).format('YYYY-MM-DD HH:mm:ss') }}</div>
        </div>
        <template v-if="props.isChoose">
          <template v-if="props.canChoose">
            <img src="@/assets/imgs/checked.png" class="check-img" alt="unchecked" v-if="props.checked"/>
            <img src="@/assets/imgs/unchecked.png" class="check-img" alt="checked" v-else/>
          </template>
        </template>
        <Button class="use-btn" :loading="loading" loading-size="14" size="mini" round
                :disabled="isDisabled" @click="useCoupon" v-else>
          {{ btnText }}
        </Button>
      </div>

    </div>
  </div>
</template>

<script setup>

import {computed, ref} from "vue";
import dayjs from "dayjs";
import request from "@/utils/request";
import {Button, showToast, Toast} from "vant";
import {useRouter} from "vue-router";

const router = useRouter();

const props = defineProps({
  isChoose: {
    type: Boolean,
    default: false
  },
  canChoose: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: null
  },
  checked: {
    type: Boolean,
    default: false
  },
  useMin: {
    type: Number,
    default: 0
  },
  merchantCode: {
    type: String,
  }
});

const emits = defineEmits(['choose'])


const loading = ref(false);

const price = computed(() => {
  return Number(props.data.template.parPrice / 100).toFixed(2)
})


const priceSize = computed(() => {
  if (price.length < 4) {
    return '28px'
  }
  return '24px';
});


const useTip = computed(() => {
  const useMinPrice = props.data.template.useMinPrice;
  if (useMinPrice === 0) {
    return "无使用条件"
  } else {
    return `满${Number(useMinPrice / 100).toFixed(2)}元可用`
  }
})

const overTip = computed(() => {
  if (props.data.template.overlyFlag) {
    return "可叠加使用"
  } else {
    return "不可叠加使用"
  }
})

const isDisabled = computed(() => {
  if (props.isChoose) {
    return props.data.couponStatus !== 1 || props.data.template.useMinPrice > props.useMin || props.data.merchantCodes.indexOf(props.merchantCode) < 0;
  }
  return props.data.couponStatus !== 1
});

const clickCoupon = () => {
  if (isDisabled.value) {
    return false;
  }
  if (props.isChoose && !props.canChoose) {
    return
  }
  emits('choose', props.data);
}

const useCoupon = async () => {
  if (isDisabled.value) return;
  try {
    loading.value = true
    const res = await request.get('/order/process', {
      params: {
        carNo: props.data.carNo
      }
    });
    const processOrders = res.data.filter(order => props.data.merchantCodes.indexOf(order.merchantCode) >= 0);
    if (processOrders.length) {
      router.push({
        name: `PayConfirm`,
        query: {
          orderNo: processOrders[0].orderNo
        },
      })
    } else {
      showToast("未找到可以使用该优惠券的停车记录")
    }
  } catch (e) {

  } finally {
    loading.value = false
  }
}

const btnText = computed(() => {
  switch (props.data.couponStatus) {
    case 1:
      return "立即使用";
    case 2:
      return "已使用";
    case 3:
      return "已过期";
  }
})


</script>


<style lang="scss" scoped>
.coupon {
  width: 100%;
  display: flex;
  background: linear-gradient(to right, #FFCE4A, #FFAE04 30%, #FFFFFF 30%, #FFFFFF 100%);
  border-radius: 10px;

}

.disable {
  background: linear-gradient(to right, #8e8e8e, #8e8e8e 30%, #FFFFFF 30%, #FFFFFF 100%);

  .use-btn {
    background: #8e8e8e;
  }

  .price .tip {
    color: #8e8e8e;
  }
}

.price {
  width: 30%;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  font-size: v-bind(priceSize);
  font-weight: bold;
  color: #FFFFFF;

  span:first-of-type {
    font-size: 36px;
  }

  .tip {
    width: fit-content;
    margin: 10px auto;
    background: #FFFFFF;
    line-height: normal;
    font-size: 20px;
    color: #FFAE04;
    padding: 0 10px;
    border-radius: 25px;
  }
}

.divider {
  background: #f6f6f6;
  width: 3px;
  position: relative;

  @mixin circle {
    content: ' ';
    display: inline-block;
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #F5F5F5;
  }

  &:before {
    @include circle;
    left: -7.5px;
    top: -8px;
  }

  &:after {
    @include circle;
    right: -7.5px;
    bottom: -8px;
  }
}

.info {
  padding: 20px;
  flex-grow: 1;
  box-shadow: 0 1px 4px 0 #BFBFBF;
  border-radius: 10px;

  .name {
    font-size: 32px;
    line-height: 32px;
    font-weight: bold;
    color: #000000;
    word-break: break-all;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .tip {
    font-size: 20px;
    font-weight: 500;
    color: #A4A4A4;
    margin-top: 10px;
  }
}

.use-btn {
  background: linear-gradient(103deg, #FFCE4A, #FFAE04);
  border: none;
  color: #FFFFFF;
  text-align: center;
  margin-left: auto;
  min-width: 120px;
}

.check-img {
  width: 36px;
  height: 36px;
  margin-left: auto;
}
</style>
