<template>
  <div class="page">
    <car-no-keyboard v-model:value="carNo">
      <template v-slot:default="{activeIdx,onNoClick}">
        <div class="no-input-wrapper">
          <template v-for="idx in 8">
                <span :class="['code',idx-1===activeIdx&&'active',(idx===8&&!carNo[7])?'energy':'']"
                      @click="onNoClick(idx-1)">{{ carNo[idx - 1] || (idx === 8 ? '新' : '') }}</span>
            <span class="dot" v-if="idx===2"/>
          </template>
        </div>
      </template>
    </car-no-keyboard>
    <van-button type="primary" class="btn" @click="save" :loading="loading">确定</van-button>
  </div>
</template>

<script setup>

import CarNoKeyboard from "@/components/car-no-keyboard";
import {showToast, Toast} from "vant";
import request from "@/utils/request";
import {useRouter} from "vue-router";
import {ref} from "vue";

const carNo = ref([]);

const router = useRouter();
const loading = ref(false)
const save = async () => {
  for (let i = 0; i < 7; i++) {
    if (carNo.value[i]===undefined||carNo.value[i]===null) {
      showToast('请输入正确的车牌号')
      return;
    }
  }
  try {
    loading.value = true
    await request.put('/car', {carNo: carNo.value.join("")});
    router.back();
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

</script>

<style lang="scss" scoped>
.page {
  background: #FFFFFF;
  width: 100vw;
  height: 100vh;
}

.no-input-wrapper {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  padding: 30px;

  .code {
    width: 60px;
    height: 72px;
    line-height: 72px;
    border: 1px solid #CCCCCC;
    font-size: 36px;
    font-weight: bold;
    color: #333333;
    text-align: center;

    &.active {
      border-color: $primary-color;
    }
  }

  .dot {
    width: 12px;
    height: 12px;
    background-color: #333333;
    border-radius: 50%;
  }

  .energy {
    font-size: 17px;
    font-weight: 500;
    color: #999999;
  }
}

.btn {
  width: 690px;
  height: 80px;
  margin-left: 30px;
  border-radius: 10px;
  margin-top: 75px;
}
</style>
