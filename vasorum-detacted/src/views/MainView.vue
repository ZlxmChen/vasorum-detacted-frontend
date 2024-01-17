<template>
    <v-app>
        <div class="container">
            <div class="d-flex align-center justify-center h-screen w-screen">
                <v-card class="login-card rounded-xl">
                    <div class="d-flex flex-column align-center justify-center pa-5">
                        <img src="@/assets/cool-background.png" alt="logo" class="pt-5" style="height: 100px;">

                        <div class="w-100">
                            <div class="mx-5 text-subtitle-1 text-medium-emphasis text-left">
                                Account</div>
                            <v-text-field density="compact" placeholder="Email address"
                                prepend-inner-icon="mdi-email-outline" variant="outlined" v-model="loginDoctorID"
                                class="mx-5" />
                            <div
                                class="mx-5 text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                                Password
                                <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer"
                                    target="_blank">
                                    忘记密码？</a>
                            </div>
                            <v-text-field :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                :type="passwordVisible ? 'text' : 'password'" density="compact" placeholder="Enter password"
                                v-model="loginPassword" prepend-inner-icon="mdi-lock-outline" variant="outlined"
                                @click:append-inner="passwordVisible = !passwordVisible" class="mx-5 mb-2" />
                            <div class="mx-5 text-subtitle-1 text-medium-emphasis text-left">
                                PatientID</div>
                            <v-text-field density="compact" placeholder="Enter PatientID"
                                prepend-inner-icon="mdi-email-outline" variant="outlined" v-model="checkPatientID"
                                class="mx-5" />
                            <div>
                                <div class="mx-5">
                                    <v-btn block rounded="lg" class="mb-1" color="blue" size="large" variant="tonal"
                                        @click="checkoutPatient">
                                        checkout
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card>
            </div>
        </div>
    </v-app>
</template>

<script setup>
import { ref } from 'vue';
import router from "@/router"
import { post, get, postN } from "@/http"
//login-card
const login = ref('true');
const loginDoctorID = ref('');
const loginPassword = ref('');
const checkPatientID = ref('');
const passwordVisible = ref(false)
const rules = {
    required: value => !!value || 'Required.',
    email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
    },
    password: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        return pattern.test(value) || 'Invalid password'
    },
    password2: value => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        return signupPassword.value === value || 'Different password'
    }
}
//通知
import { ElNotification } from 'element-plus'
/**
 ElNotification({
    title: 'Success',
    message: 'This is a success message',
    type: 'success',
  })
 */
const checkoutPatient = () => {
    // router.push("/patient/" + 1);
    postN('/user/login', {
        doctor_id: loginDoctorID.value,
        password: loginPassword.value,
    }, (msg) => {
        localStorage.setItem('doctorId', msg.user_info.doctor_id)
        localStorage.setItem('Authorization', msg.user_info.token)
        ElNotification({
            title: '登录成功',
            type: 'success',
        })
        //checkPatient

        get('/medical/get_case',
            {
                patient_id: checkPatientID.value
            },
            (msg) => {
                localStorage.setItem('cases', JSON.stringify(msg.cases))
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
    }, (err) => {
        console.log(err);
    })
    // router.push("/patient/" + checkPatientID.value);

}
</script>

<style scoped>
.container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url('../assets/cool-background.png');
    background-size: cover;
}

.login-card {
    width: 500px;
    height: 500px;
}
</style>