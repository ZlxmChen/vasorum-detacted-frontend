<template>
  <div class="h-screen w-screen">
    <div>
      <div class="heading">aaa</div>
      <div class="main">bbb</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { vue3dLoader } from 'vue-3d-loader'
</script>

<style scoped>
.heading {
  background-color: aqua;
  height: 10vh;
  display: flex;
  align-items: center;
}

.main {
  background-color: blueviolet;
  height: 90vh;
}
</style>
