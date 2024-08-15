<template>
    <div class="page">
        <div class="title">发票详情</div>
        <div class="card">
            <div class="row">
                <span class="label">发票类型</span>
                <span class="value">电子发票</span>
            </div>
            <div class="row">
                <span class="label">发票内容</span>
                <span class="value">停车费</span>
            </div>
            <div class="row">
                <span class="label">发票金额</span>
                <span class="value">￥{{ Number(fee / 100).toFixed(2) }}</span>
            </div>

        </div>
        <div class="card">
            <div class="row" @click="showPicker=true">
                <span class="label">发票抬头</span>
                <span class="value">{{ chooseHead?.headName || '点击选择发票抬头' }}</span>
                <img src="@/assets/imgs/copy.png"/>
            </div>
            <template v-if="chooseHead">
                <div class="row">
                    <span class="label">抬头种类</span>
                    <span class="value">{{ chooseHead.headType === 2 ? '个人' : '公司' }}</span>
                </div>
                <div class="row" v-if="chooseHead.taxNo">
                    <span class="label">税号</span>
                    <span class="value">{{ chooseHead.taxNo }}</span>
                </div>
                <div class="row">
                    <span class="label">联系方式</span>
                    <span class="value">{{ chooseHead.phone }}</span>
                </div>
            </template>
        </div>
        <van-button class="submit" @click="submit" :loading="loading">提交电子发票</van-button>
    </div>
    <invoice-head-picker v-model:show="showPicker" v-model:value="chooseHead"
    />
</template>

<script setup>
import InvoiceHeadPicker from "@/views/invoices/components/invoice-head-picker";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {showSuccessToast, showToast} from "vant";
import request from "@/utils/request";
import router from "@/route";

const {query: {orderId, fee}} = useRoute();
const showPicker = ref(false);
const type = ref([]);
const chooseHead = ref(null);
const loading = ref(false);

const submit = async () => {
    if (!chooseHead.value) {
        return showToast('请选择发票抬头')
    }
    try {
        loading.value = true
        await request.post(`/order/${orderId}/invoice`, null, {
            params: {
                headId: chooseHead.value.id
            }
        })
        showSuccessToast('申请开票成功');
        router.back();
    } catch (e) {
        showToast(e.msg)
    } finally {
        loading.value = false;
    }
}

</script>

<style lang="scss" scoped>
.page {
  padding: 30px;

  .title {
    font-size: 32px;
    font-weight: bold;
    color: #333333;
  }

  .card {
    width: 690px;
    margin-top: 30px;


    .row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 90px;
      font-size: 28px;
      padding: 0 30px;
      background: #FFFFFF;

      .label {
        font-weight: 500;
        color: #333333;
      }

      ::v-deep(.van-radio__label) {
        margin-left: 15px;
        font-weight: 500;
        font-size: 28px;
        color: #999999;
      }

      .value {
        margin-left: auto;
        font-weight: 500;
        color: #999999;
      }

      img {
        width: 28px;
        height: 28px;
        margin-left: 12px;
      }

      &:first-of-type {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }

      &:last-of-type {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }

      &:not(:first-of-type) {
        border-top: 1px solid #E8E8E8;
      }
    }
  }

  .submit {
    width: 520px;
    height: 80px;
    margin: 160px 85px 0;
    line-height: 80px;
    background: #2462EF;
    border-radius: 40px;
    color: #FFFFFF;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
  }

}
</style>