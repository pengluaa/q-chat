import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/Login'
import Register from '@/views/Register'
const Index = () => import('@/views/Index');
const SingleRoute = () => import('@/views/Single');
const RoomRoute = () => import('@/views/Room');
const NotFound = () =>import('@/views/NotFound');
const SearchRoute = () =>import('@/views/search')
const SettingRoute = () =>import('@/views/setting')

import Guard from './guard'
Vue.use(Router)

const router = new Router({
  mode:"history",
  routes: [
    {
      path: '',
      redirect:'/login'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      beforeEnter: Guard,
      children:[
        {
          path:'single',
          name:'single',
          component: SingleRoute
        },
        {
          path:'room',
          name:'room',
          component: RoomRoute
        },
        {
          path:'search',
          name:'search',
          component: SearchRoute
        },
        {
          path:'setting',
          name:'setting',
          component: SettingRoute
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound
    }
  ]
});

export default router
