<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer expand-on-hover rail>
                <v-list>
                    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg" title="Sandra Adams"
                        subtitle="sandra_a88@gmail.com"></v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list density="compact" nav>

                    <v-list-item prepend-icon="mdi-account-multiple" title="病人信息" value="shared"></v-list-item>
                    <v-list-item prepend-icon="mdi-folder" title="病例" value="files" @click="gotoExamination"></v-list-item>
                    <v-list-item prepend-icon="mdi-star" title="收藏" value="starred"></v-list-item>
                    <v-list-item value="newID">

                        <v-text-field density="compact" placeholder="New Patient ID" clearable
                            prepend-icon="mdi-account-badge-outline" variant="outlined" v-model="newPatientID"
                            @keyup.enter="changePatient()" @click:append-inner="changePatient()" />
                    </v-list-item>
                </v-list>
                <template v-slot:append>

                </template>
            </v-navigation-drawer>

            <v-main style="height: 100vh">
                <router-view></router-view>
            </v-main>
        </v-layout>
    </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import router from "@/router"
import { post, get } from "@/http"
import { useRoute } from 'vue-router'
//通知
import { ElNotification } from 'element-plus'
//query
const route = useRoute()
let patientId = route.params.patientId;

const newPatientID = ref('');
const gotoExamination = () => {
    router.push({
        name: 'cases',
    })
}
const changePatient = () => {
    get('/medical/get_case',
        {
            patient_id: newPatientID.value
        },
        (msg) => {
            localStorage.setItem('cases', JSON.stringify(msg.cases))
            ElNotification({
                title: '获取新病人信息成功',
                type: 'success',
            })
            router.push({
                name: 'patient',
                params: { patientId: newPatientID.value }
            })
            this.routerRefresh();
        },
        (error, status) => {

            console.log(error, status);
        }
    );
}

</script>