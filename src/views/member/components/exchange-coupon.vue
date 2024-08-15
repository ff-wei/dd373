<template>
  <div class="coupon">
    <div class="left">
      <div class="price">
        <span>¥</span>
        <span>{{ Number(price/100).toFixed(2) }}</span>
      </div>
    </div>
    <div class="right">
      <div class="info">
        <div class="line-1">{{ name }}</div>
        <div>99积分</div>
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
});

</script>

<style lang="scss" scoped>
.coupon {
  width: 700px;
  height: 160px;
  padding: 20px 0;
  background: #FFFFFF;
  border-radius: 10px;
  margin-bottom: 20px;
  position: relative;
  display: flex;
  @mixin circle {
    content: ' ';
    position: absolute;
    width: 24px;
    height: 24px;
    background: #F6F6F6;
    box-sizing: border-box;
    border-radius: 50%;
  }

  &:before {
    @include circle;
    left: -12px;
    top: calc(50% - 12px);

  }

  &:after {
    @include circle;
    top: calc(50% - 12px);
    right: -12px;
  }
}

.left {
  width: 210px;
  height: 100%;
  line-height: 120px;
  text-align: center;
  border-right: 1px solid #E8E8E8;

  .price {
    color: #FF9E36;
    font-size: 36px;
    font-weight: bold;

    span:last-of-type {
      font-size: 56px;
      font-family: DIN-Bold;
    }
  }
}

.right {
  width: 490px;
  height: 100%;
  padding: 0 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .info{
    height: 100%;
    font-size: 32px;
    font-weight: bold;
    color: #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    div:last-of-type{
      color: #FF9E36;
      font-weight: bold;
      font-size: 28px;
    }
  }

}
</style>