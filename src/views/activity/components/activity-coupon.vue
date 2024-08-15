<template>
  <div :class="`coupon ${border?'border':''}`" :style="{background:`linear-gradient(to right, #FFFFFF 74%, ${bgColor} 74%)`}">
    <div class="left">
      <div class="name line-1">{{ name }}</div>
      <div class="date">
        <slot name="left"/>
      </div>
    </div>
    <div class="right">
      <div class="price">
        <span>¥</span>
        <span>{{ Number(price/100).toFixed(2) }}</span>
      </div>
      <slot name="right"/>

    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    default: null,
  },
  price: {
    type: Number,
    default: 0,
  },
  border: {
    type: Boolean,
    default: false,
  },
  dividerColor: {
    type: String,
    default: '#136FFF',
  },
  priceColor: {
    type: String,
    default: '#136FFF',
  },
  dividerBgColor:{
    type:String,
    default: '#FFFFFF',
  },
  bgColor:{
    type:String,
    default:'#E9F2FF'
  }
});

</script>

<style lang="scss" scoped>
.coupon {
  width: 100%;
  height: 180px;
  border-radius: 10px;
  position: relative;
  display: flex;
  margin-bottom: 20px;
  @mixin circle {
    content: ' ';
    position: absolute;
    width: 24px;
    height: 12px;
    background: v-bind(dividerBgColor);
    box-sizing: border-box;
    border: 1px solid v-bind(dividerColor);
  }

  &:before {
    @include circle;
    left: calc(74% - 12px);
    top: -2px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top: 2px solid v-bind(dividerBgColor);
  }

  &:after {
    @include circle;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    left: calc(74% - 12px);
    bottom: -2px;
    border-bottom: 2px solid v-bind(dividerBgColor);
  }

  .left {
    width: 74%;
    height: 100%;
    display: flex;
    padding: 0 30px;
    justify-content: center;
    flex-direction: column;

    .name {
      font-size: 30px;
      font-weight: bold;
      color: #333333;
    }

    .date {
      font-size: 22px;
      font-weight: 500;
      color: #666666;
      margin-top: 30px;
    }

  }

  .right {
    width: 26%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .price {
      font-size: 24px;
      color: v-bind(priceColor);

      span:last-of-type {
        font-size: 60px;
        font-family: DIN-Bold;
      }
    }


  }
}

.border {
  border: 1px solid v-bind(dividerColor);
}
</style>