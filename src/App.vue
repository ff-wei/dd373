<template>
  <router-view v-slot="{Component}">
    <keep-alive v-if="$route.meta.keepAlive">
      <component :is="Component"/>
    </keep-alive>
    <component :is="Component" v-else/>
  </router-view>
</template>

<script setup>
import {RouterView} from "vue-router";
</script>

<style lang="scss">
html, body {
  background-color: #F6F6F6;
  margin: 0;
  -webkit-font-smoothing: antialiased;
}

* {
  box-sizing: border-box;
  border: none;

}

@font-face {
  font-family: "DIN-Bold";
  src: url("@/assets/fonts/DIN-Bold.otf");
}

button:active {
  opacity: .8;
}
</style>
