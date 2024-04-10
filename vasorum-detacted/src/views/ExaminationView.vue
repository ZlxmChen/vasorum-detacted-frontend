<template>
  <div>
    <div class="h-screen w-100">
      <div class="topbar">
        <div>
          <el-select
            class="ml-10"
            v-model="selectedItem"
            placeholder="Select"
            size="large"
            style="width: 240px"
            @change="gotoNewCase"
          >
            <el-option
              v-for="item in cases"
              :key="item.id"
              :label="item.date"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <div class="main d-flex flex-column align-center justify-center">
        <!-- 图片遮罩层 -->
        <v-overlay
          v-model="imgOverlay"
          location-strategy="static"
          scroll-strategy="block"
          class="imgCard"
        >
          <img
            class="bg-white"
            :src="curSrcImg"
            ref="imgSrcRef"
            @mouseenter="enableZoom"
            @mouseleave="disableZoom"
          />
        </v-overlay>
        <v-overlay
          v-model="imgOverlay1"
          location-strategy="static"
          scroll-strategy="block"
          class="imgCard"
        >
          <img
            class="bg-white"
            :src="curDstImg"
            ref="imgSrcRef"
            @mouseenter="enableZoom"
            @mouseleave="disableZoom"
          />
        </v-overlay>
        <v-slide-y-transition group>
          <div class="d-flex justify-space-around align-center">
            <!-- 原始图片 -->
            <div
              v-if="!edit"
              class="ma-4"
              style="width: 40vw"
            >
              <img
                class="bg-white w-100"
                :src="curSrcImg"
                @click="imgOverlay = !imgOverlay"
              />
            </div>
            <!-- 标记图片 -->
            <div
              class="ma-4"
              style="width: 40vw"
            >
              <img
                class="bg-white w-100"
                :src="curDstImg"
                ref="imageRef"
                @load="getImageSize"
                @click="getImageClickPosition"
              />
            </div>
            <div
              v-if="edit"
              class="ml-10"
            >
              <v-card
                class="mx-auto elevation-5 pointCard"
                rounded="xl"
                prepend-icon="mdi-tag-edit-outline"
                width="300"
              >
                <template v-slot:title>提示学习</template>
                <div class="d-flex justify-space-between mx-10">
                  <v-btn
                    :variant="isAdd ? 'outlined' : 'plain'"
                    @click="isAdd = true"
                    :class="{ 'blue-border': isAdd }"
                  >
                    增加标注
                  </v-btn>
                  <v-btn
                    :variant="!isAdd ? 'outlined' : 'plain'"
                    @click="isAdd = false"
                    :class="{ 'red-border': !isAdd }"
                  >
                    减少标注
                  </v-btn>
                </div>
                <v-list class="ml-5">
                  <v-list-item
                    v-for="(point, index) in pointList"
                    :key="index"
                    color="primary"
                    rounded="xl"
                  >
                    <!-- 列表内容，使用flex布局实现内容和按钮在同一行 -->
                    <v-list-item-content>
                      <v-list-item-title
                        class="d-flex align-center justify-space-between"
                      >
                        <span>
                          <span
                            :class="
                              point.type
                                ? 'mdi mdi-pencil-plus'
                                : 'mdi mdi-pencil-minus'
                            "
                          ></span>
                          {{
                            `x: ${Math.floor(point.x)}, y: ${Math.floor(
                              point.y
                            )}`
                          }}
                        </span>
                        <v-btn
                          icon
                          variant="plain"
                          @click="deleteItem(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item-content>

                    <!-- 删除按钮 -->
                    <v-list-item-action></v-list-item-action>
                  </v-list-item>
                </v-list>
                <v-card-text>Add the point!</v-card-text>
              </v-card>
            </div>
          </div>

          <v-btn-toggle
            rounded="xl"
            elevation="3"
            class="mt-5 mb-5"
          >
            <v-btn
              icon="mdi-chevron-left"
              @click="movePos(-1)"
            ></v-btn>
            <v-btn icon="mdi-information-outline"></v-btn>
            <v-btn
              icon="mdi-tag-edit-outline"
              @click="edit = !edit"
            ></v-btn>
            <v-btn
              icon="mdi-view-carousel-outline"
              @click="isSlider = !isSlider"
            ></v-btn>
            <v-btn
              icon="mdi-printer"
              @click="printing"
            ></v-btn>

            <v-btn
              icon="mdi-cube-scan"
              @click="gotoThreeD"
            ></v-btn>
            <v-btn
              icon="mdi-chevron-right"
              @click="movePos(1)"
            ></v-btn>
          </v-btn-toggle>
          <div
            style="width: 800px"
            class="d-flex justify-space-around align-center pt-2"
          >
            <v-slider
              v-show="isSlider"
              v-model="imgPos"
              class="align-center w-50"
              :max="max"
              :min="min"
              :step="1"
              hide-details
            >
              <template v-slot:append>
                <v-text-field
                  v-model="imgPos"
                  hide-details
                  single-line
                  density="compact"
                  type="number"
                  style="width: 80px"
                ></v-text-field>
              </template>
            </v-slider>
          </div>
        </v-slide-y-transition>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import router from '@/router'
import { post, get } from '@/http'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'

//query
const route = useRoute()
const edit = ref(false)
const isSlider = ref(false)
const min = ref(0)
const max = ref(100)
const isAdd = ref(true)

const imgPos = ref(0)
const srcList = ref([])
const dstList = ref([])

const imgOverlay = ref(false)
const imgOverlay1 = ref(false)
const curSrcImg = computed(() => {
  return srcList.value[imgPos.value]
})
const curDstImg = computed(() => {
  return dstList.value[imgPos.value]
})

const cases = ref([])
const selectedItem = ref('')
const printing = () => {
  console.log(selectedItem.value)
  console.log(imgPos.value)
  console.log(srcList.value)
  console.log(dstList.value)
}
onMounted(() => {
  get(
    '/medical/get_case',
    { patient_id: route.params.patientId },
    (msg) => {
      localStorage.setItem('cases', JSON.stringify(msg.cases))
      cases.value = msg.cases
    },
    (error, status) => {
      ElNotification({ title: error.msg, type: 'error' })
    }
  )
  get(
    '/medical/get_ct',
    {
      patient_id: route.params.patientId,
      case_id: route.params.examinationId
    },
    (msg) => {
      srcList.value = msg.src_list
      dstList.value = msg.dst_list
      max.value = srcList.value.length - 1
      console.log('get_ct_msg')
      console.log(msg)
    },
    (err) => {
      console.log('get_ct_err')
    }
  )
})

const pointList = ref([{ x: 10, y: 20, type: true }])

function deleteItem(index) {
  pointList.value.splice(index, 1)
}

const gotoNewCase = () => {
  console.log(selectedItem.value)
  get(
    '/medical/get_ct',
    {
      patient_id: route.params.patientId,
      case_id: selectedItem.value
    },
    (msg) => {
      srcList.value = msg.src_list
      dstList.value = msg.dst_list
      max.value = srcList.value.length
      console.log('get_ct_msg')
      console.log(msg)
      ElNotification({ title: '切换成功', type: 'success' })
      router.push(
        '/patient/' +
          route.params.patientId +
          '/examination/' +
          selectedItem.value
      )
      this.routerRefresh()
    },
    (err) => {
      console.log('get_ct_err')
    }
  )
}
const gotoThreeD = () => {
  router.push(
    '/patient/' + route.params.patientId + '/3d/' + route.params.examinationId
  )
}
const movePos = (i) => {
  if (
    !(
      (imgPos.value == min.value && i < 0) ||
      (imgPos.value == max.value && i > 0)
    )
  ) {
    imgPos.value = imgPos.value + i
    curSrcImg.value = srcList.value[imgPos.value]
    curDstImg.value = dstList.value[imgPos.value]
    console.log(imgPos.value)
  }
}

const imageRef = ref(null)
const getImageClickPosition = (event) => {
  if (edit.value) {
    // 获取点击事件和图片元素
    const img = event.target

    // 计算点击位置相对于图片左上角的位置
    const rect = img.getBoundingClientRect()
    const x = event.clientX - rect.left // X position within the element.
    const y = event.clientY - rect.top // Y position within the element.
    pointList.value.push({
      x: (x * 100.0) / imageRef.value.clientWidth,
      y: (y * 100.0) / imageRef.value.clientHeight,
      type: isAdd.value
    })
    console.log('Click position in the image: X:', x, 'Y:', y)

    // 可以在这里根据需要处理这些位置信息
  } else {
    imgOverlay1.value = !imgOverlay1.value
  }
}

function getImageSize() {
  if (imageRef.value) {
    console.log(
      'Image display size:',
      imageRef.value.clientWidth,
      'x',
      imageRef.value.clientHeight
    )
  }
}

const imgSrcRef = ref(null) // ref用于访问img DOM元素
// 缩放因子，决定每次滚动时图片放大或缩小的比例
const zoomFactor = 0.1

// 启用图片缩放功能
function enableZoom() {
  imgSrcRef.value.addEventListener('wheel', handleZoom)
}

// 禁用图片缩放功能
function disableZoom() {
  imgSrcRef.value.removeEventListener('wheel', handleZoom)
}

// 处理图片缩放
function handleZoom(event) {
  event.preventDefault() // 阻止默认滚动行为

  let width = imgSrcRef.value.offsetWidth
  let height = imgSrcRef.value.offsetHeight

  // 根据滚动方向计算新的尺寸
  if (event.deltaY < 0) {
    // 向上滚动，放大
    width *= 1 + zoomFactor
    height *= 1 + zoomFactor
  } else {
    // 向下滚动，缩小
    width *= 1 - zoomFactor
    height *= 1 - zoomFactor
  }

  // 应用新的尺寸
  imgSrcRef.value.style.width = `${width}px`
  imgSrcRef.value.style.height = `${height}px`
}
</script>

<style scoped>
.imgCard {
  display: flex;
  justify-content: center;
  align-items: center;
}
.topbar {
  height: 10vh;
  display: flex;
  align-items: end;
}
.selectBox {
  width: 200px;
  margin-left: 6vw;
}
.blue-border {
  border-color: blue !important; /* 使用!important来确保覆盖Vuetify的默认样式 */
}
.red-border {
  border-color: red !important; /* 使用!important来确保覆盖Vuetify的默认样式 */
}
.main {
  height: 90vh;
}
.pointCard {
  height: 50vh;
}
</style>
