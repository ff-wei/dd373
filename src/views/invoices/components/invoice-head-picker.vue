<template>
  <van-popup :show="show" @update:show="e=>emits('update:show',e)" position="bottom" class="popup" round>
    <div class="container">
      <div class="header">
        <span class="title">选择发票抬头</span>
        <img src="@/assets/imgs/close.png" alt="close" @click="emits('update:show',false)"/>
      </div>
      <div class="list" v-if="dataList.length">
        <div class="head" v-for="head in dataList" :key="head.id" @click="choose(head)">
          <img src="@/assets/imgs/business.png" v-if="head.headType===1"/>
          <img src="@/assets/imgs/person.png" v-else/>
          <div :class="['head-info',value?.id===head.id?'active':''] ">
            <div>抬头：{{ head.headName }}</div>
            <div v-if="head.phone">联系方式：{{ head.phone }}</div>
          </div>
        </div>
      </div>
      <div class="empty" v-else>
        <img src="@/assets/imgs/empty-invoice.png"/>
      </div>
      <button class="btn" @click="goAdd">添加常用发票抬头</button>
    </div>
  </van-popup>
</template>

<script setup>
import {useRouter} from "vue-router";
import {onActivated, ref} from "vue";
import request from "@/utils/request";
import {closeToast, showLoadingToast, Toast} from "vant";

const router = useRouter();
const dataList = ref([]);

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  value: {
    type: Object
  }
});


const emits = defineEmits(['update:value', 'update:show']);


const goAdd = () => {
  router.push({
    name: 'AddInvoiceHead'
  });
};


const choose = (head) => {
  emits('update:value', head);
  emits('update:show', false);
}

const loadData = async () => {
  try {
    showLoadingToast();
    const res = await request.get('/invoice/head/all')
    dataList.value = res.data || [];
  } finally {
    closeToast();
  }
}

onActivated(() => {
  loadData();
});
</script>

<style lang="scss" scoped>

.container {
  padding: 50px 0 0;
  position: relative;
  height: 830px;
  background: #FFFFFF;
}

.loading-wrapper {
  height: 740px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header {
  display: flex;
  align-items: center;

  .title {
    font-size: 36px;
    font-weight: bold;
    color: #333333;
    margin: 0 auto;
  }

  img {
    width: 28px;
    height: 28px;
    margin-right: 0;
    position: absolute;
    right: 30px;
    top: 58px;
  }
}

.list {
  padding: 50px 0 0;
  height: 620px;
  overflow-y: auto;

  .head {
    padding: 30px;
    border-top: 1px solid #E8E8E8;
    display: flex;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
    }

    &-info {
      margin-left: 20px;
      font-size: 28px;
      font-weight: 500;

      div:nth-of-type(2) {
        font-size: 24px;
        margin-top: 12px;
      }
    }

    &:last-of-type {
      border-bottom: 1px solid #E8E8E8;
    }

  }

  .active {
    color: $primary-color;
  }

}

.empty {
  height: 620px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 386px;
    height: 200px;
  }
}

.btn {
  width: 460px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background: $primary-color;
  border-radius: 40px;
  font-size: 36px;
  font-weight: bold;
  color: #FFFFFF;
  margin: 0 145px;
}
</style>
