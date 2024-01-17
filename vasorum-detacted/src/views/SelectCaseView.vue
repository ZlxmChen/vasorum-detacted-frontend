<template>
    <div class="ma-5">
        <div class="d-flex justify-start align-center">
            <v-btn-toggle v-model="toggle" color="primary" mandatory class="ml-5">
                <v-btn icon="mdi-clock-time-eight-outline" value="时间正序"></v-btn>
                <v-btn icon="mdi-clock-time-eight" value="时间倒序"></v-btn>
                <v-btn icon="mdi-archive" value="收藏"></v-btn>
                <v-btn icon="mdi-archive-off" value="未收藏"></v-btn>
            </v-btn-toggle>
            <span class="pl-3">{{ toggle }}</span>
        </div>
        <div class="d-flex justify-start flex-wrap">
            <v-card v-for="(card, i) in cases" :key="i" :value="card" class="ma-5" width="200" height="200">
                <v-img :src="cards[i].src" class="align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px" cover @click="gotoExamination(card.id)">
                    <v-card-title class="text-white" v-text="card.date"></v-card-title>
                </v-img>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-heart"></v-btn>

                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-bookmark"></v-btn>

                    <v-btn size="small" color="surface-variant" variant="text" icon="mdi-share-variant"></v-btn>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import router from "@/router"
import { post, get } from '@/http'
import { useRoute } from 'vue-router'

//query
const route = useRoute()
const cases = ref([]);
onMounted(() => {
    get('/medical/get_case',
        {
            patient_id: route.params.patientId
        },
        (msg) => {
            localStorage.setItem('cases', JSON.stringify(msg.cases))
            cases.value = msg.cases;
            ElNotification({
                title: '获取病人信息成功',
                type: 'success',
            })
            router.push({
                name: 'patient',
                params: { patientId: checkPatientID.value }
            })
        },
        (error, status) => {
            ElNotification({
                title: error.msg,
                type: 'error',
            })
            console.log(error, status);
        }
    );
}
)
const cards = [
    { title: '2023-01-11', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg' },
    { title: '2023-01-12', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg' },
    { title: '2023-01-13', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg' },
    { title: '2023-01-11', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg' },
    { title: '2023-01-12', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg' },
    { title: '2023-01-13', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg' },
    { title: '2023-01-11', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg' },
    { title: '2023-01-12', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg' },
    { title: '2023-01-13', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg' },
]
const gotoExamination = (i) => {
    router.push('/patient/' + route.params.patientId + '/examination/' + i);
}
const toggle = ref()
</script>