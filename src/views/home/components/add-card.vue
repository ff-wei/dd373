<template>
  <card :icon="Icon" title="添加车牌">
    <div class="content">
      <div>
        <button class="btn" @click="goAdd">
          <img src="@/assets/imgs/add.png" alt="add"/>
          <span>添加车牌</span>
        </button>
        <span class="tip">添加您的常用车辆便捷出行</span>
      </div>
      <img src="@/assets/imgs/parking.png" class="parking-img" alt="parking"/>
    </div>
  </card>
</template>

<script setup>
import Card from "@/views/home/components/card";
import Icon from '@/assets/imgs/car-no.png';
import {useRouter} from "vue-router";

const router = useRouter();

const goAdd = () => {
  router.push({
    name:'AddCar',
  })
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220px;
  height: 60px;
  background: $primary-color;
  border-radius: 30px;
  color: #FFFFFF;
  font-size: 28px;
  font-weight: 500;

  img {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }
}

.tip {
  display: block;
  margin-top: 20px;
  font-size: 20px;
  font-weight: 500;
  color: #999999;
}

.parking-img {
  width: 226px;
  height: 189px;
}
</style>
