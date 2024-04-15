<template>
  <v-app>
    <div class="container">
      <img
        :src="imageUrl"
        class="background"
      />
      <v-card class="login-card rounded-xl">
        <!-- 登录卡片内容 -->
        <div class="d-flex flex-column align-center justify-center pa-5">
          <!-- 标题 -->
          <img
            src="../assets/logo.png"
            alt=""
            class="mt-5 w-50"
            @click="toggleDayAndNight"
          />
          <!-- 登录表单 -->
          <div class="w-100">
            <!-- 账户输入 -->
            <div class="mx-5 my-3">
              <label
                for="account-email"
                class="form-label"
              >
                账户
              </label>
              <v-text-field
                id="account-email"
                density="compact"
                placeholder="Email address"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                v-model="loginDoctorID"
                class="mx-5 inputbox"
              />
            </div>
            <!-- 密码输入 -->
            <div class="mx-5 my-3">
              <label
                for="account-password"
                class="form-label"
              >
                密码
              </label>
              <v-text-field
                :type="passwordVisible ? 'text' : 'password'"
                density="compact"
                id="account-password"
                placeholder="Enter password"
                v-model="loginPassword"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="togglePasswordVisibility"
                variant="outlined"
                class="mx-5 mb-2 inputbox"
              />
            </div>
            <!-- 病人ID输入 -->
            <div class="mx-5 my-3">
              <label
                for="patient-id"
                class="form-label"
              >
                病人ID
              </label>
              <v-text-field
                id="patient-id"
                density="compact"
                placeholder="Enter PatientID"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                v-model="checkPatientID"
                class="mx-5 inputbox"
              />
            </div>
            <!-- 查看按钮 -->
            <div class="mx-5 my-3">
              <v-btn
                block
                rounded="lg"
                color="blue"
                size="large"
                variant="tonal"
                @click="checkoutPatient"
              >
                立即查看
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import router from '@/router'
import { ElNotification } from 'element-plus'
import { postN, get } from '@/http'
import { useTheme } from 'vuetify'
const theme = useTheme()
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const toggleDayAndNight = () => {
  theme.global.name.value = theme.global.current.value.dark
    ? 'myLightTheme'
    : 'dark'
  toggleDark()
}
import backgrounddark from '@/assets/welcomePageDark.jpg'
import backgroundlight from '@/assets/welcomePage.png'
const imageUrl = computed(() => {
  return theme.global.current.value.dark ? backgrounddark : backgroundlight
})
// Reactive state variables
const loginDoctorID = ref('')
const loginPassword = ref('')
const checkPatientID = ref('')
const passwordVisible = ref(false)

// Toggle visibility of password
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

// Function to check patient information and navigate
const checkoutPatient = () => {
  // router.push("/patient/" + 1);
  postN(
    '/user/login',
    {
      doctor_id: loginDoctorID.value,
      password: loginPassword.value
    },
    (msg) => {
      // Set local storage with login info
      localStorage.setItem('doctorId', msg.user_info.doctor_id)
      localStorage.setItem('Authorization', msg.user_info.token)
      ElNotification({ title: '登录成功', type: 'success' })

      // 有病人ID，查询后直接进入查看
      if (checkPatientID.value) {
        get(
          '/medical/get_case',
          { patient_id: checkPatientID.value },
          (msg) => {
            localStorage.setItem('cases', JSON.stringify(msg.cases))
            ElNotification({ title: '获取病人信息成功', type: 'success' })
            // console.log(msg.cases[msg.cases.length - 1])
            // Navigate to patient info page
            router.push(
              '/patient/' +
                checkPatientID.value +
                '/case/' +
                msg.cases[msg.cases.length - 1].id
            )
            //router.push({ name: 'patient', params: { patientId: checkPatientID.value } })
          },
          (error, status) => {
            ElNotification({ title: error.msg, type: 'error' })
          }
        )
      }
      //只有医生信息，进入医生界面
      else {
        router.push('/patientcase')
      }
    },
    (err) => {
      console.log(err)
    }
  )
}
</script>

<style scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
}

.login-card {
  width: 500px;

  position: absolute;
  top: 28vh;
  left: 10vw;
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
