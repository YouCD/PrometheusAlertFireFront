import Vue from 'vue'
import VueRouter from 'vue-router'
import vLayout from '../components/vLayout/vLayout'
import vReceiver from '../components/vReceiver'
import vSubscribe from '../components/vSubscribe'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: vLayout,
    children: [
      {
        // 当 /user/:id/profile 匹配成功，
        // UserProfile 会被渲染在 User 的 <router-view> 中
        path: 'receiver',
        component: vReceiver
      },
      {
        // 当 /user/:id/posts 匹配成功
        // UserPosts 会被渲染在 User 的 <router-view> 中
        path: 'Subscribe',
        component: vSubscribe
      }
    ]
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
