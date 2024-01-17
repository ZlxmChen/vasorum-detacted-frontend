<template>
    <div>
        <div class=" h-screen d-flex flex-column align-center justify-center">
            <v-slide-y-transition group>
                <div class="d-flex justify-space-around align-center">
                    <div class="ma-4" style="width: 40vw;">
                        <img class="bg-white w-100" :src="curSrcImg" />
                        <div class="d-flex justify-center pt-2">
                            <v-icon icon="mdi-arrow-expand" class="mr-2"></v-icon>
                            <v-icon icon="mdi-reload" class="mr-2"></v-icon>
                            <v-icon icon="mdi-plus" class="mr-2"></v-icon>
                            <v-icon icon="mdi-minus" class=""></v-icon>
                        </div>
                    </div>

                    <div class="ma-4" style="width: 40vw;">
                        <img class="bg-white w-100" :src="curDstImg" />
                        <div class="d-flex justify-center pt-2">
                            <v-icon icon="mdi-arrow-expand" class="mr-2"></v-icon>
                            <v-icon icon="mdi-reload" class="mr-2"></v-icon>
                            <v-icon icon="mdi-plus" class="mr-2"></v-icon>
                            <v-icon icon="mdi-minus" class=""></v-icon>
                        </div>
                    </div>
                </div>

                <v-btn-toggle rounded="xl" elevation="3">
                    <v-btn icon="mdi-chevron-left" @click="movePos(-1)"></v-btn>
                    <v-btn icon="mdi-information-outline"></v-btn>
                    <v-btn icon="mdi-star"></v-btn>
                    <v-btn icon="mdi-view-carousel-outline" @click="isSlider = !isSlider"></v-btn>
                    <v-btn icon="mdi-printer" @click="printing"></v-btn>

                    <v-btn icon="mdi-cube-scan"></v-btn>
                    <v-btn icon="mdi-chevron-right" @click="movePos(1)"></v-btn>
                </v-btn-toggle>
                <div style="width: 800px;" class="d-flex justify-space-around align-center pt-2">
                    <v-slider v-show="isSlider" v-model="imgPos" class="align-center w-50" :max="max" :min="min" :step="1"
                        hide-details>
                        <template v-slot:append>
                            <v-text-field v-model="imgPos" hide-details single-line density="compact" type="number"
                                style="width: 80px"></v-text-field>
                        </template>
                    </v-slider>
                </div>
            </v-slide-y-transition>


        </div>

    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import router from "@/router"
import { post, get } from "@/http"
import { useRoute } from 'vue-router'

//query
const route = useRoute()

const isSlider = ref(false)
const min = ref(0)
const max = ref(100)

const imgPos = ref(0)
const srcList = ref([])
const dstList = ref([])
const curSrcImg = computed(() => {
    return srcList.value[imgPos.value];
})
const curDstImg = computed(() => {
    return dstList.value[imgPos.value];
})

const printing = () => {
    console.log(imgPos.value);
    console.log(srcList.value);
    console.log(dstList.value);
}
onMounted(() => {
    get('/medical/get_ct', {
        patient_id: route.params.patientId,
        case_id: route.params.examinationId
    }, (msg) => {
        srcList.value = msg.src_list
        dstList.value = msg.dst_list
        max.value = srcList.value.length
        console.log("get_ct_msg");
        console.log(msg);
    }, (err) => {
        console.log("get_ct_err");
    })
})
const movePos = (i) => {
    if (!((imgPos.value == min.value && i < 0) || (imgPos.value == max.value && i > 0))) {
        imgPos.value = imgPos.value + i
        curSrcImg.value = srcList.value[imgPos.value]
        curDstImg.value = dstList.value[imgPos.value]
        console.log(imgPos.value);
    }
}
</script>