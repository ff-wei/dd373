<template>
  <div class="title">
    <div>更换手机号，下次登录可使用新手机号登录。</div>
    <div>当前手机号{{ member.phone }}</div>
  </div>
  <van-cell-group>
    <van-field
        v-model="phone"
        name="mobile"
        label="手机号"
        placeholder="请输入手机号码"
        input-align="right"
        :rules="[{ required: true, message: '请输入手机号码' }]"
    />
    <van-field
        v-model="verifyCode"
        name="smsCode"
        label="图形验证码"
        center
        placeholder="请输入图形验证码"
        input-align="right"
        v-if="needImgCode"
        :rules="[{ required: true, message: '请输入图形验证码' }]"
    >
      <template #button>
        <img :src="imgCode" class="verify-code" @click="getImgCode"/>
      </template>
    </van-field>
    <van-field
        name="smsCode"
        v-model="smsCode"
        label="验证码"
        center
        placeholder="请输入验证码"
        input-align="right"
        :rules="[{ required: true, message: '请输入验证码' }]"
    >
      <template #button>
        <van-button round size="small" type="primary" @click="sendCode" :loading="sendLoading"
                    :disabled="sendInterval!=null"> {{ sendInterval ? `${sendCountDown}秒后重发` : '发送验证码' }}
        </van-button>
      </template>
    </van-field>
  </van-cell-group>
  <van-button round class="btn" type="primary" @click="bind">确认绑定</van-button>
</template>

<script setup>

import request from "@/utils/request";
import {ref, onUnmounted} from "vue";
import {showSuccessToast, showToast, Toast} from "vant";
import useMemberStore from "@/stores/member";
import {storeToRefs} from "pinia";
import {useRouter} from "vue-router";

const router = useRouter();

const sendLoading = ref(false);
const loading = ref(false);
const phone = ref('');
const verifyCode = ref('');
const smsCode = ref(null);
const needImgCode = ref(false);
const imgCode = ref(null);
const sendCountDown = ref(60);
const sendInterval = ref(null);

const memberStore = useMemberStore();
const {member} = storeToRefs(memberStore);


const getImgCode = async () => {
  const res = await request.get('/account/imgCode');
  imgCode.value = res.data;
}

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


const bind = async () => {
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
    await request.put('/account/rebind', {
      mobile: phone.value,
      verifyCode: smsCode.value,
    })
    showSuccessToast({
      message: '绑定成功'
    })
    memberStore.refreshMemberInfo();
    router.back();
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
.title {
  padding: 30px 20px;
  font-size: 24px;
  font-weight: 500;
  color: #333333;
  line-height: 1.3;
}

.verify-code {
  width: 250px;
  height: 80px;
}

.btn {
  width: 640px;
  height: 80px;
  margin: 330px 55px 0;
}
</style>