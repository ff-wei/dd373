<template>
  <div class="page">
    <div class="card">
      <div class="row">
        <span class="label">抬头类型</span>
        <van-radio-group direction="horizontal" v-model="form.headType">
          <van-radio name="1">企业单位</van-radio>
          <van-radio name="2">个人/非企业</van-radio>
        </van-radio-group>
      </div>
      <template v-if="form.headType==='1'">
        <div class="row">
          <span class="label">公司名称</span>
          <input maxlength="50" v-model="form.headName" class="value" placeholder="请输入公司名称(必填)"/>
        </div>
        <div class="row">
          <span class="label">公司税号</span>
          <input maxlength="50" v-model="form.taxNo" class="value" placeholder="请填写纳税人识别号(必填)"/>
        </div>
        <div class="row">
          <span class="label">注册地址</span>
          <input maxlength="200" v-model="form.address" class="value" placeholder="请填写公司注册地址"/>
        </div>
        <div class="row">
          <span class="label">开户银行</span>
          <input maxlength="50" v-model="form.bank" class="value" placeholder="请填写公司开户银行"/>
        </div>
        <div class="row">
          <span class="label">银行账号</span>
          <input maxlength="32" v-model="form.bankAccount" class="value" placeholder="请填写银行账号"/>
        </div>
      </template>
      <template v-else>
        <div class="row">
          <span class="label">抬头名称</span>
          <input maxlength="50" v-model="form.headName" class="value" placeholder="请输入抬头名称(必填)"/>
        </div>
      </template>
      <div class="row">
        <span class="label">联系方式</span>
        <input maxlength="20" v-model="form.phone" type="tel" class="value" placeholder="用于接收开票信息(必填)"/>
      </div>
    </div>
    <button class="save-btn" @click="save">保存</button>
  </div>
</template>

<script setup>
import {reactive, ref} from "vue";
import {showSuccessToast, showToast, Toast} from "vant";
import request from "@/utils/request";
import {useRouter} from "vue-router";

const router = useRouter();
const form = reactive({
  headType: '1',
  companyName: null,
  taxNo: null,
  address: null,
  phone: null,
  bank: null,
  bankAccount: null,
  headName: null,
});
const isEmpty = field => !field || field.trim() === '';
const save = async () => {
  if (form.type === '1') {
    if (isEmpty(form.headName)) {
      return showToast('公司名称不能为空');
    }
    if (isEmpty(form.taxNo)) {
      return showToast('公司税号不能为空');
    }
  } else {
    if (isEmpty(form.headName)) {
      return showToast('抬头名称不能为空');
    }
  }
  if (isEmpty(form.phone)) {
    return showToast('联系方式不能为空');
  }
  await request.put('/invoice/head', form);
  router.back();
  showSuccessToast({
    message: '添加成功',
  });
}
</script>

<style lang="scss" scoped>
.page {
  padding: 30px;

  .card {
    width: 690px;
    height: 660px;

    .row {
      background: #FFFFFF;
      height: 90px;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .label {
        font-size: 28px;
        font-weight: 500;
        color: #333333;
      }

      .value {
        text-align: right;
        width: 500px;
        font-weight: 500;
        font-size: 28px;

        &::placeholder {
          color: #999999;
        }
      }

      ::v-deep(.van-radio__label) {
        margin-left: 15px;
        font-weight: 500;
        font-size: 28px;
        color: #999999;
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

  .save-btn {
    width: 520px;
    margin: 110px 85px 0;
    height: 80px;
    line-height: 80px;
    text-align: center;
    background: #2462EF;
    border-radius: 40px;
    font-size: 36px;
    font-weight: bold;
    color: #FFFFFF;
  }
}
</style>


