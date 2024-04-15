<template>
  <v-app>
    <img
      :src="imageUrl"
      class="background"
    />
    <header>
      <img
        src="../assets/logo.png"
        alt=""
        class="h-75 mx-5"
        @click="router.push('/home')"
      />
      <v-slide-x-transition group>
        <v-card
          elevation="0"
          class="top-bar rounded-pill mr-10 mx-5"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-btn
              @click="gotoPage(0)"
              :elevation="isHovering ? 2 : 0"
              class="rounded-pill mx-2"
            >
              病灶检测
            </v-btn>
            <v-btn
              @click="gotoPage(1)"
              :elevation="isHovering ? 2 : 0"
              class="rounded-pill mx-2"
            >
              病人数据
            </v-btn>
            <v-btn
              @click="gotoPage(2)"
              :elevation="isHovering ? 2 : 0"
              class="rounded-pill mx-2"
            >
              个人主页
            </v-btn>
            <v-btn
              density="default"
              icon="mdi-theme-light-dark"
              elevation="0"
              class="rounded-pill ml-2"
              @click="toggleDayAndNight"
            ></v-btn>
          </v-hover>
        </v-card>
      </v-slide-x-transition>
    </header>
    <router-view></router-view>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterView } from 'vue-router'
import { useTheme } from 'vuetify'
import router from '@/router'
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const theme = useTheme()
const toggleDayAndNight = () => {
  theme.global.name.value = theme.global.current.value.dark
    ? 'myLightTheme'
    : 'dark'
  toggleDark()
}
const gotoPage = (des) => {
  console.log('gotoPage')
  switch (des) {
    case 0:
      break
    case 1:
      router.push('/patientcase')
      break
    default:
      break
  }
}
import backgrounddark from '@/assets/backgrounddark.jpg'
import backgroundlight from '@/assets/backgroundlight.png'
const imageUrl = computed(() => {
  return theme.global.current.value.dark ? backgrounddark : backgroundlight
})
</script>

<style>
header {
  width: 100vw;
  height: 60px;
  display: flex;
  margin-top: 20px;
  z-index: 100;
  justify-content: space-between;
}
.top-bar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.background {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
</style>
