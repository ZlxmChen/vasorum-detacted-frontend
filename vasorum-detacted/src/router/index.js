import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/layouts/DefaultView.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/MainView.vue'),
        },
        {
          path: '/test',
          component: () => import('@/views/Test.vue'),
        },
        {
          name: 'patient',
          path: '/patient/:patientId',
          component: () => import('@/views/PatientView.vue'),
          children: [
            {
              name: 'cases',
              path: 'cases',
              component: () => import('@/views/SelectCaseView.vue'),
            },
            {
              path: 'examination/:examinationId',
              component: () => import('@/views/ExaminationView.vue'),
            },
            {
              path: '3d/:examinationId',
              component: () => import('@/views/SpaceView.vue'),
            },
          ],
        },
      ],
    },
  ],
});
// router.beforeEach((to, from, next) => {
//   if (to.name === from.name && to.params.type !== from.params.type) {
//     next({ name: 'empty', query: { toPath: to.fullPath } });
//   } else {
//     next();
//   }
// });
export default router;
