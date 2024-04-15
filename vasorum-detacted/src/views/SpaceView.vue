<template>
  <div class="w-screen h-screen space">
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
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'
//通知
import { ElNotification } from 'element-plus'
import * as THREE from 'three'
const theme = useTheme()
const isLight = ref(false)
onMounted(() => {
  console.log(theme.global.name.value)
  if (theme.global.name.value == 'myLightTheme') {
    isLight.value = true
    theme.global.name.value = 'dark'
  }
})
const route = useRoute()
const goback = () => {
  theme.global.name.value = 'myLightTheme'
  router.push(
    '/patient/' + route.params.patientId + '/case/' + route.params.caseId
  )
}
</script>

<style scoped>
.backbtn {
  position: absolute;
  left: 20px;
  top: 20px;
}
.space {
  position: absolute;
  bottom: -80px;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}
</style>
