<template>
  <div class="content" v-if="cars.length">
    <div class="car" v-for="(car,idx) in cars">
      <img src="@/assets/imgs/car.png" alt="car" class="car-img">
      <span class="car-no">{{ car.carNo }}</span>
      <div class="delete-icon" @click="unbind(car.id,idx)">
        <van-icon name="delete-o"/>
      </div>
    </div>
    <button class="add-btn" @click="goAdd">
      <img src="@/assets/imgs/add.png" alt="add">
      <span>添加车牌</span>
    </button>
  </div>
  <empty :img="emptyImg" btn-text="添加车牌" tip="暂无车牌～" @btnClick="goAdd" show-btn v-else/>
</template>

<script setup>
import Empty from "@/components/empty";
import emptyImg from "@/assets/imgs/no-cars.png";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import request from "@/utils/request";
import {closeToast, showConfirmDialog, showLoadingToast, showSuccessToast, Toast} from "vant";

const router = useRouter();




const cars = ref([]);


onMounted(() => {
  loadCars();
})


const loadCars = async () => {
  showLoadingToast({
    message: '加载中',
    duration: 0
  })
  const res = await request('/car/my');
  closeToast();
  cars.value = res.data.map(it => {
    const carNo = it.carNo.split("");
    carNo.splice(1, 0, " · ")
    return {
      ...it,
      carNo: carNo.join(""),
    }
  });
}

const unbind = (carId,idx) => {
  showConfirmDialog({
    title: '解绑提示',
    message: '请确认是否解绑该车牌',
  }).then(async () => {
    await request.delete(`/car/${carId}`);
    showSuccessToast('解绑成功')
    cars.value.splice(idx,1)
  });
};




const goAdd = () => {
  router.push({name:'AddCar'});
};
</script>

<style lang="scss" scoped>
.content {
  height: calc(100vh - 130px);
  overflow-y: auto;
}


.car {
  width: 690px;
  height: 120px;
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 10px;
  margin: 30px auto 0;
  padding: 20px 30px;

  .car-img {
    width: 80px;
    height: 80px;
  }

  .car-no {
    font-size: 36px;
    font-weight: bold;
    color: #000000;
    margin-left: 22px;
    letter-spacing: 2px;
  }

  .delete-icon {
    background: #F21646;
    color: #FFFFFF;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    margin-left: auto;
  }
}

.add-btn {
  position: fixed;
  bottom: 30px;
  left: 30px;
  width: 690px;
  height: 80px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: $primary-color;
  border-radius: 10px;
  font-size: 36px;
  font-weight: bold;
  color: #FFFFFF;

  img {
    width: 36px;
    height: 36px;
    margin-right: 20px;
  }
}
</style>
