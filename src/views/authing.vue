<template>
  <div class="page">
    <van-loading :size="50" vertical :text-size="14" color="#2462EF" text-color="#2462EF">正在进入...</van-loading>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import request from "@/utils/request";
import {onMounted} from "vue";
import {getAgent} from "@/utils/client";

const router = useRouter();
const route = useRoute();
const {before = '/', code, auth_code, mc} = route.query;
const agent = getAgent();
onMounted(async () => {
  try {
    let path = agent === 'wx' ? 'wx' : 'ali';
    let mcCode = null;
    if (mc) {
      if (typeof mc === "string") {
        mcCode = mc
      } else if (Array.isArray(mc)) {
        mcCode = mc[0];
      }
    }
    const res = await request.post(`/account/${path}Login`, {code: code || auth_code, mc: mcCode});
    localStorage.setItem("token", res.data)
    window.location.replace(before)
  } catch (e) {
    if (e.code === 201) {
      window.location.replace(before)
    }
  }
})
</script>
<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
