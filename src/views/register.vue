<template>
  <div class="page">
    <div class="bg">
      <div class="title">注册</div>
    </div>
    <div class="card">
      <div class="input-wrapper">
        <img src="@/assets/imgs/mobile.png"/>
        <input v-model="phone" type="tel" placeholder="请输入手机号"/>
      </div>
      <div class="input-wrapper" v-if="needImgCode">
        <img src="@/assets/imgs/verify-code.png"/>
        <input v-model="verifyCode" placeholder="请输入图形验证码"/>
        <img class="verify-code" :src="imgCode" @click="getImgCode"/>
      </div>
      <div class="input-wrapper">
        <img src="@/assets/imgs/verify-code.png"/>
        <input v-model="smsCode" type="number" placeholder="请输入短信验证码"/>
        <van-button class="code-btn" size="mini" round type="primary" @click="sendCode" :loading="sendLoading"
                    :disabled="sendInterval!=null">
          {{ sendInterval ? `${sendCountDown}秒后重发` : '发送验证码' }}
        </van-button>
      </div>
      <van-button :loading="loading" class="register-btn" round type="primary" @click="register">立即注册</van-button>
    </div>
    <img class="park-img" src="@/assets/imgs/register.png"/>
  </div>
</template>

<script setup>

import {onUnmounted, ref} from "vue";
import request from "@/utils/request";
import {showSuccessToast, showToast, Toast} from "vant";
import {useRoute, useRouter} from "vue-router";
import useMemberStore from "@/stores/member";

const route = useRoute();
const router = useRouter();
const {before = '/', code, auth_code} = route.query;

const sendLoading = ref(false);
const loading = ref(false);
const phone = ref('');
const verifyCode = ref('');
const smsCode = ref(null);
const needImgCode = ref(false);
const imgCode = ref(null);
const sendCountDown = ref(60);
const sendInterval = ref(null);

const sendCode = async () => {
  try {
    if (needImgCode.value) {
      if (!verifyCode.value.trim().length) {
        showToast('请输入图形验证码');
        return;
      }
    }
    sendLoading.value = true;
    await request.post('/account/sendSmsCode', {
      mobile: phone.value,
      verifyCode: verifyCode.value,
    });
    showToast('验证码已发送，请注意查收');
    sendInterval.value = setInterval(() => {
      if (sendCountDown.value > 0) {
        sendCountDown.value--;
      } else {
        clearInterval(sendInterval.value);
        sendInterval.value = null;
        sendCountDown.value = 60;
      }
    }, 1000);
  } catch (e) {
    if (e.code === 201) {
      needImgCode.value = true
      getImgCode();
    }
  } finally {
    sendLoading.value = false;
  }
};
const getImgCode = async () => {
  const res = await request.get('/account/imgCode');
  imgCode.value = res.data;
}
const register = async () => {
  if (!phone.value.trim().length) {
    showToast('请输入手机号');
    return;
  }
  if (!smsCode.value) {
    showToast('请输入短信验证码')
    return;
  }
  try {
    loading.value = true
    await request.put('/account/register', {
      mobile: phone.value,
      verifyCode: smsCode.value,
      authCode: code || auth_code
    })
    showSuccessToast({
      message: '注册成功'
    })
    router.replace(before);
  } finally {
    loading.value = false
  }
}
onUnmounted(() => {
  if (sendInterval.value) {
    clearInterval(sendInterval.value);
  }
})

</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #FFFFFF;
}

.bg {
  width: 750px;
  height: 665px;
  background: linear-gradient(0deg, #1B4DF9 0%, #2B7DFC 100%);
  padding-left: 40px;
  padding-top: 210px;

  .title {
    font-size: 44px;
    font-weight: bold;
    color: #FEFEFF;
    position: relative;

    &:after {
      content: ' ';
      width: 1em;
      height: 6px;
      background: #FFFFFF;
      position: absolute;
      left: 0;
      bottom: -15px;
    }
  }
}

.card {
  width: 680px;
  height: 640px;
  background: #FFFFFF;
  box-shadow: 0 0 62px 6px rgba(113, 163, 253, 0.7500);
  border-radius: 10px;
  position: fixed;
  top: 400px;
  left: 35px;
  padding: 50px;

  .input-wrapper {
    display: flex;
    align-items: center;
    height: 120px;
    border-bottom: 3px dashed #A8A7A7;

    img {
      width: 28px;
      height: 28px;
    }

    input {
      font-size: 24px;
      font-weight: 500;

      &::placeholder {
        color: #BAB8B8;
      }

      flex-grow: 1;
      margin-left: 17px;
    }

    .verify-code {
      width: 250px;
      height: 80px;
      margin-right: 0;
    }

    .code-btn {
      width: 185px;
      height: 54px;
      background: #136FFF;
      font-size: 28px;
      margin-left: auto;
    }
  }

  .register-btn {
    margin-top: 110px;
    width: 564px;
    height: 80px;
    box-shadow: 0 8px 28px 1px rgba(110, 160, 246, 0.7500);
    font-size: 36px;
    font-weight: bold;
    color: #FFFFFF;
  }
}

.park-img {
  width: 681px;
  height: 500px;
  position: fixed;
  right: -140px;
  z-index: 1;
  top: 0;
}
</style>