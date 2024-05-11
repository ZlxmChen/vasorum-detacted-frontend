<template>
  <div>
    <div class="w-100">
      <div class="main d-flex flex-column align-center justify-center">
        <!-- <div class="topbar">
        
      </div> -->
        <!-- 图片遮罩层 -->
        <div
          class="backtrigger"
          @click=";(isSlider = false), (inList = false)"
        ></div>
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
        <v-scroll-y-transition group>
          <div class="d-flex justify-space-around align-center">
            <!-- 原始图片 -->
            <div
              v-if="!edit"
              class="ma-4"
              style="width: 45vw; max-height: 45vw"
            >
              <v-card
                elevation="16"
                rounded="xl"
              >
                <img
                  class="bg-white w-100"
                  :src="curSrcImg"
                  @click="imgOverlay = !imgOverlay"
                />
              </v-card>
            </div>
            <!-- 标记图片 -->
            <div
              class="ma-4"
              style="width: 45vw; max-height: 45vw"
            >
              <v-card
                elevation="16"
                rounded="xl"
              >
                <img
                  class="bg-white w-100"
                  :src="curDstImg"
                  ref="imageRef"
                  @load="getImageSize"
                  @click="getImageClickPosition"
                />
                <!-- 使用绝对定位来动态显示点 -->
                <v-icon
                  v-if="edit"
                  v-for="(point, index) in pointList[imgPos].value"
                  :key="index"
                  class="point"
                  :style="{
                    position: 'absolute',
                    left: (point.x * imageRef.clientWidth) / 100 + 'px',
                    top: (point.y * imageRef.clientHeight) / 100 + 'px'
                  }"
                  :color="getPointColor(point.type)"
                  @contextmenu.prevent="deletePoint(index)"
                >
                  mdi-circle-slice-8
                </v-icon>
              </v-card>
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
                <template v-slot:title>
                  <v-btn
                    elevation="0"
                    size="large"
                    rounded="xl"
                    @click="editType = (editType + 1) % 3"
                    class="ma-2 w-50"
                  >
                    {{ editTypeName }}
                    <v-tooltip
                      open-delay="500"
                      activator="parent"
                      location="top"
                    >
                      提示标注: LUMEN为血管内壁, NONCAL为非钙化区域,
                      CAL为钙化区域。
                    </v-tooltip>
                  </v-btn>
                </template>
                <v-list class="ml-5">
                  <v-list-item
                    v-for="(point, index) in pointList[imgPos].value"
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
              </v-card>
            </div>
          </div>
          <v-btn-toggle
            rounded="xl"
            elevation="1"
            class="mt-7 mb-5"
          >
            <v-scroll-x-transition group>
              <v-btn
                icon
                @click="movePos(-1)"
              >
                <v-icon>mdi-chevron-left</v-icon>
                <v-tooltip
                  open-delay="500"
                  activator="parent"
                  location="top"
                >
                  上一张
                </v-tooltip>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-information-outline</v-icon>
                <v-tooltip
                  open-delay="500"
                  activator="parent"
                  location="top"
                  dialog="true"
                >
                  病例信息
                </v-tooltip>
                <v-dialog
                  activator="parent"
                  max-width="500"
                >
                  <template v-slot:default="{ isActive }">
                    <v-card rounded="xl">
                      <v-card-title
                        class="d-flex justify-space-between align-center"
                      >
                        <div class="text-h5 text-medium-emphasis ps-2">
                          病例信息
                        </div>

                        <v-btn
                          :icon="
                            !infoEdit
                              ? 'mdi-account-edit-outline'
                              : 'mdi-account-edit'
                          "
                          variant="text"
                          @click="infoEdit = !infoEdit"
                        ></v-btn>
                      </v-card-title>

                      <v-divider class="mb-4"></v-divider>

                      <v-card-text>
                        <div class="mb-4">
                          日期：
                          <span class="text-medium-emphasis">XXXXXX</span>
                        </div>
                        <div class="mb-2">
                          备注：
                          <span class="text-medium-emphasis"></span>
                        </div>
                        <v-textarea
                          :counter="300"
                          rows="1"
                          variant="solo"
                          :flat="!infoEdit"
                          :disabled="!infoEdit"
                          counter
                        ></v-textarea>
                        <div class="mb-2">诊断结果</div>

                        <v-textarea
                          :counter="300"
                          rows="4"
                          variant="solo"
                          :flat="!infoEdit"
                          :disabled="!infoEdit"
                          counter
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions class="my-2 d-flex justify-end">
                        <v-btn
                          v-if="infoEdit"
                          class="text-none"
                          rounded="xl"
                          text="取消"
                          @click=";(isActive.value = false), (infoEdit = false)"
                        ></v-btn>

                        <v-btn
                          v-if="infoEdit"
                          class="text-none"
                          color="primary"
                          rounded="xl"
                          text="保存"
                          variant="flat"
                          @click=";(isActive.value = false), (infoEdit = false)"
                        ></v-btn>
                        <v-btn
                          v-if="!infoEdit"
                          class="text-none"
                          rounded="xl"
                          text="关闭"
                          @click=";(isActive.value = false), (infoEdit = false)"
                        ></v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </v-btn>
              <v-btn
                icon
                @click=";(inList = !inList), (edit = false)"
              >
                <v-icon>mdi-format-list-bulleted-square</v-icon>
                <v-tooltip
                  open-delay="500"
                  activator="parent"
                  location="top"
                >
                  查看病例列表
                </v-tooltip>
              </v-btn>
              <el-select
                v-if="inList"
                v-model="selectedItem"
                placeholder="Select"
                size="large"
                :style="{
                  width: '240px',
                  height: '100%',
                  backgroundColor: theme.global.current.value.dark
                    ? '#212121'
                    : '#FFFFFF'
                }"
                class="pt-1 px-2"
                @change="gotoNewCase"
              >
                <el-option
                  v-for="item in cases"
                  :key="item.id"
                  :label="item.date"
                  :value="item.id"
                  @click="inList = false"
                />
              </el-select>
              <v-btn
                icon="mdi-view-carousel-outline"
                @click="isSlider = !isSlider"
              >
                <v-icon>mdi-view-carousel-outline</v-icon>
                <v-tooltip
                  open-delay="500"
                  activator="parent"
                  location="top"
                >
                  快速切换
                </v-tooltip>
              </v-btn>
              <div
                v-if="isSlider"
                :style="{
                  width: '300px',
                  zIndex: '100',
                  backgroundColor: theme.global.current.value.dark
                    ? '#212121'
                    : '#FFFFFF'
                }"
                class="d-flex justify-space-around justify-center px-3"
              >
                <v-slider
                  v-show="isSlider"
                  v-model="imgPos"
                  class=""
                  style=""
                  :max="max"
                  :min="min"
                  :step="1"
                  hide-details
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="imgPos"
                      density="compact"
                      :style="{
                        width: '80px',
                        backgroundColor: theme.global.current.value.dark
                          ? '#212121'
                          : '#FFFFFF'
                      }"
                      type="number"
                      variant="outlined"
                      hide-details
                    ></v-text-field>
                  </template>
                </v-slider>
              </div>

              <v-btn
                icon="mdi-tag-edit-outline"
                @click="
                  ;(edit = !edit),
                    (inList = false),
                    edit ? (isSeg = true) : (isSeg = isSeg)
                "
              >
                <!-- TODO 点击清除 -->
                <v-icon>mdi-tag-edit-outline</v-icon>
                <v-tooltip
                  open-delay="500"
                  activator="parent"
                  location="top"
                >
                  提示标注
                </v-tooltip>
              </v-btn>
              <v-btn
                icon
                @click="gotoThreeD"
              >
                <v-icon>mdi-cube-scan</v-icon>
                <v-tooltip
                  open-delay="500"
                  activator="parent"
                  location="top"
                >
                  查看3D
                </v-tooltip>
              </v-btn>
              <v-btn
                icon
                @click="movePos(1)"
              >
                <v-icon>mdi-chevron-right</v-icon>
                <v-tooltip
                  open-delay="500"
                  activator="parent"
                  location="top"
                >
                  下一张
                </v-tooltip>
              </v-btn>
            </v-scroll-x-transition>
          </v-btn-toggle>
        </v-scroll-y-transition>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import router from '@/router'
import { post, get } from '@/http'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//query
const route = useRoute()
const edit = ref(false)
const inList = ref(false)
const isSlider = ref(false)
const min = ref(0)
const max = ref(100)
const isAdd = ref(true)

const imgPos = ref(0)
const segPos = ref(0)
const isSeg = ref(false)
const srcList = ref([])
const dstList = ref([{ path: '', seg: [] }])
const dialog = ref(false)

const imgOverlay = ref(false)
const imgOverlay1 = ref(false)

const editType = ref(0)
const editTypeName = computed(() => {
  switch (editType.value) {
    case 0:
      return 'lumen'
      break
    case 1:
      return 'noncal'
      break
    case 2:
      return 'cal'
      break
    default:
      break
  }
})

const curSrcImg = computed(() => {
  if (isSeg.value) {
    return dstList.value[imgPos.value].seg_src[segPos.value]
  } else {
    return srcList.value[imgPos.value]
  }
})
const curDstImg = computed(() => {
  if (isSeg.value) {
    return dstList.value[imgPos.value].seg_dst[segPos.value]
  } else {
    return dstList.value[imgPos.value].path
  }
})
function handleWheelEvent(event) {
  if (isSlider.value)
    if (event.deltaY < 0) movePos(-1)
    else movePos(1)
}
import { useTheme } from 'vuetify'
const theme = useTheme()
onMounted(() => {
  window.addEventListener('wheel', handleWheelEvent)
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheelEvent)
})
const cases = ref([])
const selectedItem = ref('')
const printing = () => {
  console.log(dstList.value[imgPos.value].path)
  console.log(imgPos.value)
  console.log(srcList.value)
  console.log(dstList.value)
}

const infoEdit = ref(false)

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
      case_id: route.params.caseId
    },
    (msg) => {
      srcList.value = msg.src_list
      dstList.value = msg.dst_list
      //缓存8001
      max.value = srcList.value.length - 1

      //todo pointlist二维

      for (let i = 0; i < max.value; i++) {
        pointList.value[i] = new ref([])
      }
      console.log(pointList.value)
      console.log('get_ct_msg')
      console.log(msg)
      loadAll()
        .then(() => {
          ElNotification({
            title: '所有CT图片加载完成',
            type: 'success',
            position: 'bottom-right'
          })
        })
        .catch((error) => {
          console.error('An error occurred while loading images', error)
        })
    },
    (err) => {
      console.log('get_ct_err')
    }
  )
})
const getPointColor = (type) => {
  switch (type) {
    case 0:
      return 'blue'
    case 1:
      return 'yellow'
    case 2:
      return 'purple'
    default:
      return 'primary' // 默认颜色
  }
}
const pointList = ref([[]])
// 处理右键点击事件，从 convertedPointList 中删除对应记录
const deletePoint = (index) => {
  pointList.value[imgPos.value].value.splice(index, 1)
}
function deleteItem(index) {
  pointList.value[imgPos.value].value.splice(index, 1)
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
      max.value = srcList.value.length - 1
      console.log('get_ct_msg')
      console.log(msg)
      ElNotification({
        title: '切换成功',
        type: 'success',
        position: 'bottom-right'
      })
      router.push(
        '/patient/' + route.params.patientId + '/case/' + selectedItem.value
      )
      imgPos.value = 0
      segPos.value = 0
      isSeg.value = false
      this.routerRefresh()
    },
    (err) => {
      console.log('get_ct_err')
    }
  )
}
const gotoThreeD = () => {
  theme.global.name.value = 'dark'
  router.push(
    '/patient/' + route.params.patientId + '/3d/' + route.params.caseId
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
    curDstImg.value = dstList.value[imgPos.value].path
    console.log(imgPos.value)
    // var temp = new Image()
    // // 预先把加载的图片加入内存中(隐形加载),相当于给浏览器缓存了一张图片
    // temp.src = srcList.value[imgPos.value + 1]
    // temp.src = dstList.value[imgPos.value + 1]
  }
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    var temp = new Image()
    temp.onload = () => resolve(temp) // 加载成功
    temp.onerror = reject // 加载失败
    temp.src = src
  })
}
async function loadAll() {
  for (const element of srcList.value) {
    await loadImage(element).catch((error) =>
      console.error('Image failed to load', error)
    )
  }
  for (const element of dstList.value) {
    await loadImage(element.path).catch((error) =>
      console.error('Image failed to load', error)
    )
  }
}
const imageRef = ref({
  clientWidth: 100,
  clientHeight: 100
})
const convertedPointList = computed(() => {
  return pointList.value[imgPos.value].map((point) => ({
    x: (point.x * imageRef.value.clientWidth) / 100, // 假设 x 坐标以百分比形式提供
    y: (point.y * imageRef.value.clientHeight) / 100, // 假设 y 坐标以百分比形式提供
    type: point.type // 可选，如果需要将原始数据也包含在转换后的点中
  }))
})
const tmp = ref(1)
const getImageClickPosition = (event) => {
  if (edit.value) {
    // 获取点击事件和图片元素
    const img = event.target

    // 计算点击位置相对于图片左上角的位置
    const rect = img.getBoundingClientRect()
    const x = event.clientX - rect.left // X position within the element.
    const y = event.clientY - rect.top // Y position within the element.
    pointList.value[imgPos.value].value.push({
      x: (x * 100.0) / imageRef.value.clientWidth,
      y: (y * 100.0) / imageRef.value.clientHeight,
      type: editType.value
    })
    console.log('Click position in the image: X:', x, 'Y:', y)
    console.log(pointList.value)
    setTimeout(
      () =>
        post(
          '/medical/annotate',
          {
            url: curSrcImg.value,
            idx: tmp.value
          },
          (msg) => {
            dstList.value[imgPos.value].seg_dst[segPos.value] = msg.url
            console.log()
            tmp.value = (tmp.value % 4) + 1
          },
          (err, status) => {}
        ),
      1000
    )

    // 可以在这里根据需要处理这些位置信息
  } else {
    // imgOverlay1.value = !imgOverlay1.value
    if (isSeg.value == false) {
      //进入小图模式
      isSeg.value = true
      segPos.value = 0
    } else {
      segPos.value++
      if (segPos.value == dstList.value[imgPos.value].seg_dst.length) {
        //返回大图模式
        isSeg.value = false
        segPos.value = 0
      }
    }
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
.backtrigger {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}
</style>
