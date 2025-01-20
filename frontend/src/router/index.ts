import { createRouter, createWebHistory } from 'vue-router'
import LoginCallbackView from '../views/LoginCallbackView.vue'
import HomePageView from "@/views/HomePageView.vue";
import ListOfMyJobs from "@/views/ListOfMyJobs.vue";
import ListOfAllJobs from "@/views/ListOfAllJobs.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: HomePageView,
    },
    {
      path: '/myjobs',
      name: 'myjobs',
      component: ListOfMyJobs,
    },
    {
      path: '/alljobs',
      name: 'alljobs',
      component: ListOfAllJobs,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login-callback',
      name: 'login-callback',
      component: LoginCallbackView,
    }
  ],
})

export default router
