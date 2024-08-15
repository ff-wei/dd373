<template>
  <van-popup :show="show" @update:show="e=>emits('update:show',e)" position="bottom" round
             safe-area-inset-bottom>
    <div class="picker">
      <div class="templates">
        <div v-for="(template,idx) in templates" :class="['template',chooseTemplate?.id===template.id?'choose':'']" :key="idx"
             @click="chooseTemplate=template">
          <img :src="template.pics"/>
          <div>{{ template.name }}</div>
        </div>
      </div>
      <button class="btn" @click="onOk">确定</button>
    </div>
  </van-popup>
</template>

<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  template: {
    type: Array,
    default: [],
  },
  templates: {
    type: Array,
    required: true
  },
});

const chooseTemplate = ref();

watch(() => props.template, v => {
  chooseTemplate.value = v?.id;
})

const emits = defineEmits(['update:show', 'ok']);

const onOk = () => {
  emits('ok', chooseTemplate.value);
}
</script>

<style lang="scss" scoped>
.picker {
  .templates {
    height: 50vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;

    .template {
      width: 45%;
      margin-top: 48px;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #333333;

      img {
        width: 100%;
        aspect-ratio: 16/9;
        margin-bottom: 24px;
        border-radius: 16px;
      }
    }

    .choose {
      img {
        border: 2px solid $primary-color;
      }

      color: $primary-color;
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
    margin: 50px 145px;
  }
}
</style>