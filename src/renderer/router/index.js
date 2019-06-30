import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/view/Index/index.vue').default,
    },
    {
      path: '/labelconfig',
      name: 'labelconfig',
      component: require('@/view/LabelConfig/index.vue').default,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
