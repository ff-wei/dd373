<template>
  <div ref="wrapper">
    <slot :car-no="carNo" :active-idx="activeIdx" :on-no-click="onNoClick"/>
  </div>
  <teleport to="body">
    <transition name="fade">
      <div class="wrapper" v-show="show" ref="wrapperRef">
        <div v-for="row in provinces" class="row" v-if="activeIdx===0">
          <div v-for="province in row" class="key" @click="clickNo(activeIdx,province)">{{ province }}</div>
        </div>
        <div v-for="row in words" class="row" v-else>
          <div v-for="word in row" :class="['key',word.enable?'':'disable']" @click="clickNo(activeIdx,word)">
            {{ word.key }}
          </div>
        </div>
        <div class="delete" @click="deleteNo">删除</div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import {onMounted, reactive, ref, watchEffect} from "vue";
import {useOnOutsidePress, useVModel} from "vue-composable";

const props = defineProps({
  value: {
    type: Array,
    default: [],
  },
  actived: {
    type: Boolean,
    default: false,
  }
})
const carNo = useVModel(props, "value");


const wrapperRef = ref(null);

useOnOutsidePress(wrapperRef, () => {
  if (show.value) {
    show.value = false
  }
})

const provinces = [
  ['皖', '京', '津', '沪', '渝', '苏', '浙', '豫', '粤', '川'],
  ['陕', '冀', '辽', '吉', '闽', '鄂', '湘', '鲁', '晋'],
  ['黑', '赣', '贵', '甘', '桂', '琼', '云', '青'],
  ['蒙', '藏', '宁', '新', '无','U'],
];
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const chars = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'], ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'], ['Z', 'X', 'C', 'V', 'B', 'N', 'M'], ['港', '澳', '学']];
const words = reactive([
  numbers.map(it => ({key: it, enable: true})),
  ...chars.map(row => row.map(it => ({key: it, enable: true})))
]);


const activeIdx = ref(-1);

const show = ref(false);

onMounted(() => {
  if (props.actived) {
    onNoClick(0)
  }
})


const deleteNo = () => {
  if (carNo.value.length > 0) {
    let deleteIdx = carNo.value[activeIdx.value] ? activeIdx.value : activeIdx.value - 1;
    carNo.value[deleteIdx] = null;
    if (deleteIdx !== activeIdx.value) {
      activeIdx.value--;
    }
  }
}

const clickNo = (idx, v) => {

  if (typeof v === 'string') {
    carNo.value[idx] = v;
  } else {
    if (v.enable) {
      carNo.value[idx] = v.key;
    } else {
      return;
    }
  }
  if (activeIdx.value < 6) {
    activeIdx.value++;
  }

}

const onNoClick = (idx) => {
  if (idx === activeIdx.value) {
    activeIdx.value = show.value ? -1 : idx;
    show.value = !show.value;
  } else {
    activeIdx.value = idx;
    show.value = true;
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 750px;
  overflow-x: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #c7c8cf;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 10px calc(env(safe-area-inset-bottom) + 10px);
}

.row {
  display: flex;
  justify-content: center;

  &:not(:first-of-type) {
    margin-top: 16px;
  }

  & > .key:not(:first-of-type) {
    margin-left: calc(130px / 9);
  }
}

.key {
  background: #FFFFFF;
  width: 60px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border-radius: 5px;

  &.disable {
    background: #d5d7db !important;
    color: #FFFFFF !important;
  }

  &:active {
    color: #FFFFFF;
    background: $primary-color;
  }
}

.delete {
  @extend .key;
  position: absolute;
  right: 10px;
  bottom: calc(env(safe-area-inset-bottom) + 10px);
  width: 100px;
}
</style>
