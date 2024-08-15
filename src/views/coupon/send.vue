<template>
  <van-cell-group>
    <van-cell title="赠送模版" :value="template?template.name:'选择赠送模版'" @click="showPicker=true"/>
    <van-field
        v-model="phone"
        name="mobile"
        label="手机号"
        type="tel"
        placeholder="请输入手机号码"
        input-align="right"
        :rules="[{ required: true, message: '请输入手机号码' }]"
    />
  </van-cell-group>
  <van-button type="primary" round style="width: 80%;margin: 120px 10% 0;" @click="send" :loading="sendLoading">
    生成转赠链接
  </van-button>
  <template-picker :templates="templates" v-model:show="showPicker" @ok="chooseTemplate"/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import request from "@/utils/request";
import {closeToast, Dialog, showConfirmDialog, showLoadingToast, showSuccessToast, showToast, Toast} from "vant";
import {useRoute} from "vue-router";
import TemplatePicker from "@/views/coupon/components/template-picker";
import copy from 'copy-to-clipboard';
const {query: {id}} = useRoute();

const templates = ref([]);

const phone = ref('');

const sendLoading = ref(false);

const showPicker = ref(false);

const template = ref();

const loadTemplates = async () => {
  showLoadingToast({message: '加载中'});
  const res = await request.get('/coupon/giveTemplates');
  templates.value = res.data;
  closeToast();
};

const chooseTemplate = t => {
  template.value = t;
  showPicker.value = false;
}

const send = async () => {
  if (!template.value) {
    showToast({
      message: '请选择赠送模版',
    });
    return;
  }
  if (!phone.value || phone.value.trim().length !== 11) {
    showToast({
      message: '请输入正确的手机号',
    });
    return
  }
  try {
    sendLoading.value = true
    const res = await request.post('/coupon/send', {
      couponId: id,
      templateId: template.value.id,
      phone:phone.value
    });
    const giftUrl = `${location.protocol}//${location.host}/gift?code=${res.data}`;
    await showConfirmDialog({
      title: '提示',
      message: `
      邀请链接生成成功，有效期为1天\n复制链接发送给好友领取\n\n${giftUrl}`,
      confirmButtonText: '复制',
    });
    copy(giftUrl);
    showSuccessToast('复制成功');
  } finally {
    sendLoading.value = false;
  }
};

onMounted(() => {
  loadTemplates();
})
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: 1000px;
}

.header {
  display: flex;
  align-items: center;
  padding: 30px 30px;

  .title {
    font-size: 36px;
    font-weight: bold;
    color: #333333;
    margin: 0 auto;
  }
}


</style>