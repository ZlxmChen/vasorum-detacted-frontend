<template>
  <div class="w-screen h-screen">
    <iframe
      src="https://www.realibox.com/sl?p=25J1Uc"
      width="100%"
      height="100%"
      frameborder="no"
      allowfullscreen="true"
    ></iframe>
    <div class="backbtn">
      <v-btn
        density="default"
        icon="mdi-arrow-left"
        @click="goback"
      ></v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import router from '@/router'
import { post, get } from '@/http'
import { useRoute } from 'vue-router'
//通知
import { ElNotification } from 'element-plus'
import * as THREE from 'three'

const route = useRoute()
const goback = () => {
  router.push(
    '/patient/' +
      route.params.patientId +
      '/examination/' +
      route.params.examinationId
  )
}
</script>

<style scoped>
.backbtn {
  position: absolute;
  left: 150px;
  top: 50px;
}
</style>
