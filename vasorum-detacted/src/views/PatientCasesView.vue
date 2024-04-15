<template>
  <v-container
    class="h-100 w-screen pr-5"
    fluid
  >
    <v-row class="h-100">
      <v-col
        cols="4"
        class="ma-2 overflow-auto"
        style="max-height: 85vh"
      >
        <div class="patient-bar mb-3">
          <v-switch
            v-model="isAllPatient"
            color="info"
            :label="isAllPatient ? '全院病人' : '我的病人'"
            value="info"
            hide-details
          ></v-switch>
          <v-text-field
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Search patient"
            variant="outlined"
            hide-details
            rounded="xl"
            single-line
            v-model="searchText"
            @click:append-inner="searchPatient"
          ></v-text-field>
        </div>
        <div class="">
          <v-scroll-y-transition group>
            <v-card
              append-icon="mdi-chevron-right-circle-outline"
              class="mx-auto mb-3"
              rounded="xl"
              elevation="1"
              v-for="patient in isAllPatient ? patientList : myPatientList"
              :key="patient.patient_id"
              :prepend-avatar="patient.avatar_url"
              :subtitle="
                patient.latest_ct ? '最新CT: ' + patient.latest_ct : null
              "
              :title="patient.name"
              link
              @click="getPatient(patient)"
            ></v-card>
          </v-scroll-y-transition>
        </div>
      </v-col>
      <v-col
        class="ma-2"
        style="max-height: 85vh"
      >
        <v-card
          rounded="xl"
          style="height: 85vh"
          class=""
          elevation="1"
          :prepend-avatar="selectPatient.avatar_url"
          :subtitle="
            selectPatient.latest_ct
              ? '最新CT: ' + selectPatient.latest_ct
              : null
          "
          :title="selectPatient.name"
        >
          <div
            class="overflow-auto"
            style="height: 75vh"
          >
            <div class="case-container ma-5 pb-20">
              <v-card
                rounded="xl"
                class="ma-2"
                width="300"
                v-for="item in cases"
                @click="gotoCase(item)"
              >
                <v-img
                  :src="item.cover_url"
                  class="align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="300px"
                  cover
                  @mouseover="item.show = true"
                  @mouseleave="item.show = false"
                >
                  <v-scroll-y-transition group>
                    <v-card-title
                      class="text-white"
                      v-text="item.date"
                    ></v-card-title>
                    <v-card-text
                      v-show="item.show"
                      class="text-white"
                    >
                      诊断：{{ item.diagnosis }}
                    </v-card-text>
                  </v-scroll-y-transition>
                </v-img>
              </v-card>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
import { ElNotification } from 'element-plus'
import { postN, get } from '@/http'
import { onMounted } from 'vue'
const isAllPatient = ref(false)
const patientList = ref([
  {
    name: 'aa',
    patient_id: 1
  }
])
const myPatientList = ref([
  {
    name: 'aa',
    patient_id: 1
  }
])
const selectPatient = ref({
  name: 'aa',
  patient_id: 1
})
const searchText = ref('')
const cases = ref()
const getPatient = (pa) => {
  selectPatient.value = pa
  //getCT
  get(
    '/medical/get_case',
    { patient_id: pa.patient_id },
    (msg) => {
      cases.value = msg.cases.map((item) => ({
        ...item, // 展开原有属性
        show: false // 添加新属性show，并设置初始值为false
      }))
    },
    (error, status) => {
      ElNotification({ title: error.msg, type: 'error' })
    }
  )
}
onMounted(() => {
  get(
    '/medical/get_all_patient',
    {},
    (msg) => {
      patientList.value = msg.patient_list
      myPatientList.value = msg.my_patient_list
      getPatient(patientList.value[0])
    },
    (error, status) => {
      ElNotification({ title: error.msg, type: 'error' })
    }
  )
})

const searchPatient = () => {
  if (isAllPatient.value) {
    patientList.value.forEach((element) => {
      if (
        element.patient_id == searchText.value ||
        element.name == searchText.value
      ) {
        getPatient(element)
        return
      }
    })
  } else {
    myPatientList.value.forEach((element) => {
      if (
        element.patient_id == searchText.value ||
        element.name == searchText.value
      ) {
        getPatient(element)
        return
      }
    })
  }
}

const gotoCase = (item) => {
  router.push('/patient/' + selectPatient.value.patient_id + '/case/' + item.id)
  ElNotification({
    title: '获取图像成功',
    type: 'success',
    position: 'bottom-right'
  })
}
</script>

<style scoped>
.overflow-auto {
  overflow-y: auto; /* 添加垂直滚动 */
}
.patient-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
}

.case-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
