<template>
  <card>
    <div class="content">
      <div class="tip">请输入待缴费的车牌号</div>
      <div style="margin: auto 0">
        <car-no-keyboard v-model:value="carNo">
          <template v-slot:default="{carNo,activeIdx,onNoClick}">
            <div class="no-input-wrapper">
              <template v-for="idx in 8">
                <span :class="['code',idx-1===activeIdx&&'active',(idx===8&&!carNo[7])?'energy':'']"
                      @click="onNoClick(idx-1)">{{ carNo[idx - 1] || (idx === 8 ? '新' : '') }}</span>
                <span class="dot" v-if="idx===2"/>
              </template>
            </div>
          </template>
        </car-no-keyboard>
      </div>
      <button class="btn" @click="query">缴费出场</button>
    </div>
  </card>
</template>

<script setup>
import Card from "@/views/home/components/card";
import CarNoKeyboard from "@/components/car-no-keyboard";
import {ref} from "vue";
import {closeToast, showLoadingToast, showToast, Toast} from "vant";
import request from "@/utils/request";
import {useRouter} from "vue-router";


const router = useRouter();

const carNo = ref([]);

const query = async () => {
  for (let i = 0; i < 7; i++) {
    if (carNo.value[i] === undefined || carNo.value[i] === null) {
      showToast('请输入正确的车牌号')
      return;
    }
  }
  try {
    showLoadingToast( {
      message:'查询中',
      duration: 0
    })
    const res = await request.get('/order/getUnpaidOrder', {
      params: {
        carNo: carNo.value.join("")
      }
    });
    if (res.data) {
      router.push({
        name: 'PayConfirm',
        query: {
          orderNo: res.data.orderNo
        }
      })
      closeToast()
    } else {
      showToast('该车牌无待缴费停车记录')
    }

  } catch (e) {
    console.error(e)
  }
}


</script>

<style lang="scss" scoped>
.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;

  .tip {
    font-size: 32px;
    font-weight: bold;
    color: #333333;
    text-align: center;
  }

  .no-input-wrapper {
    width: 630px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 2px solid $primary-color;
    border-radius: 6px;
    padding: 30px;

    .code {
      width: 50px;
      height: 60px;
      line-height: 60px;
      border: 1px solid #CCCCCC;
      font-size: 28px;
      font-weight: bold;
      color: #333333;
      text-align: center;

      &.active {
        border-color: $primary-color;
      }
    }

    .dot {
      width: 10px;
      height: 10px;
      background-color: #333333;
      border-radius: 50%;
    }

    .energy {
      font-size: 14px;
      font-weight: 500;
      color: #999999;
    }
  }

  .btn {
    width: 360px;
    height: 80px;
    background: $primary-color;
    border-radius: 40px;
    color: #FFFFFF;
    font-size: 36px;
    font-weight: bold;
  }
}

</style>
