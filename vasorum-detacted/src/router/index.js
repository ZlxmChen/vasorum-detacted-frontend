import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/home',
      component: () => import('@/views/MainView.vue')
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '/patientcase',
          component: () => import('@/views/PatientCasesView.vue')
        },
        {
          path: '/patient/:patientId/case/:caseId',
          component: () => import('@/views/ExaminationView.vue')
        },
        {
          path: '/patient/:patientId/3d/:caseId',
          component: () => import('@/views/SpaceView.vue')
        }
      ]
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   if (to.name === from.name && to.params.type !== from.params.type) {
//     next({ name: 'empty', query: { toPath: to.fullPath } });
//   } else {
//     next();
//   }
// });
export default router

// children: [
//   {
//     path: '/home',
//     component: () => import('@/views/MainView.vue'),
//   },
//   {
//     path: '/test',
//     component: () => import('@/views/Test.vue'),
//   },
//   {
//     name: 'patient',
//     path: '/patient/:patientId',
//     component: () => import('@/views/PatientView.vue'),
//     children: [
//       {
//         name: 'cases',
//         path: 'cases',
//         component: () => import('@/views/SelectCaseView.vue'),
//       },
//       {
//         path: 'examination/:examinationId',
//         component: () => import('@/views/ExaminationView.vue'),
//       },
//
//     ],
//   },
// ],
