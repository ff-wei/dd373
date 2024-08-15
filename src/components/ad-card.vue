<template>
  <div :id="id" class="ad">
    <span class="float">广告</span>
  </div>
</template>
<script setup>

import {onMounted} from "vue";

const props = defineProps({
  id: {
    type: String,
  },
  posId: {
    type: String
  }
});

onMounted(() => {
  new Regionspace({
    containerId: props.id,
    positionId: props.posId,
  })
})
</script>

<style lang="scss" scoped>
.ad{
  position: relative;
}
.float {
  width: 70px;
  height: 36px;
  background: rgba(100, 100, 100, 0.7);
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 36px;
}
</style>

