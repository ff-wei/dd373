<template>
  <div class="card">
    <div class="card-body">
      <div class="price-wrapper">
        <div class="price">
          <span>¥</span>
          <span>{{ price }}</span>
        </div>
        <div>面额</div>
      </div>
      <div>
        <van-button type="primary" plain class="btn" round v-if="data.template.isGiveAway">转赠</van-button>
        <van-button type="primary" class="btn" round @click="useCard" :loading="loading">立即使用</van-button>
      </div>
    </div>
    <div class="card-footer">{{ data.template.couponName }}</div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import useMemberStore from "@/stores/member";
import {goAuthUrl} from "@/utils/auth";
import {useRoute} from "vue-router";
import {showConfirmDialog, showSuccessToast, Toast} from "vant";
import request from "@/utils/request";

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
});

const emits = defineEmits(['success'])

const route = useRoute();

const memberStore = useMemberStore();

const loading = ref(false);

const price = computed(() => {
  return Number(props.data.template.parPrice / 100).toFixed(2)
});

const useCard = async () => {
  try {
    loading.value = true;
    const member = await memberStore.getMemberInfo()
    if (member) {
      await showConfirmDialog({
        title: '使用提示',
        message: '请确认是否将该电子卡充值到账户余额',
      });
      await request.post(`/coupon/useCard/${props.data.id}`);
      showSuccessToast('使用成功');
      emits('success')
    } else {
      await goAuthUrl(route.query.lotCode, route.fullPath, true);
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 690px;
  height: 220px;
  margin: 20px auto 0;
  box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.1);
  border-radius: 12px;

  &-body {
    width: 690px;
    height: 160px;
    background-image: url("@/assets/imgs/card-bg.jpg");
    background-size: 100% 100%;
    border-radius: 10px 10px 0 0;
    padding: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .price-wrapper {
      color: #FF5757;
      font-size: 24px;
      text-align: center;
      font-weight: 500;

      .price {
        font-size: 20px;

        span:last-of-type {
          font-size: 50px;
        }

        font-family: "DIN-Bold";
      }
    }

    .btn {
      width: 160px;
      height: 52px;
      font-size: 28px;
      font-weight: bold;
      padding: 0;
      margin-left: 20px;
    }
  }

  &-footer {
    width: 690px;
    line-height: 60px;
    padding: 0 27px;
    font-size: 28px;
    font-weight: bold;
    color: #FFFFFF;
    background: #72A9FF;
    border-radius: 0 0 10px 10px;
  }
}
</style>