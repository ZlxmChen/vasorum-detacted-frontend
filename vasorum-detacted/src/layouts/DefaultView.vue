<template>
  <main>
    <v-app>
      <v-col
        cols="auto"
        @click="toggleDayAndNight"
        class="switchDay"
      >
        <v-btn
          density="default"
          icon="mdi-theme-light-dark"
        ></v-btn>
      </v-col>
      <router-view></router-view>
    </v-app>
  </main>
</template>

<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme()
const toggleDayAndNight = () => {
  theme.global.name.value = theme.global.current.value.dark
    ? 'myCustomLightTheme'
    : 'dark'
}
</script>

<style>
.switchDay {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 999;
}
</style>
