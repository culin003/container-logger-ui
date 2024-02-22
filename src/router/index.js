import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import UserManagement from '../components/UserManagement'
import UserGroupManagement from '../components/UserGroupManagement'
import ContainerManagement from '../components/ContainerManagement'
import ContainerLogger from '../views/ContainerLogger'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/login',
    children: [
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: UserManagement,
        meta: { title: '用户管理' }
      },
      {
        path: 'userGroupManagement',
        name: 'UserGroupManagement',
        component: UserGroupManagement,
        meta: { title: '用户组管理' }
      },
      {
        path: 'containerManagement',
        name: 'ContainerManagement',
        component: ContainerManagement,
        meta: { title: '容器管理' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/containerLogger',
    name: 'ContainerLogger',
    component: ContainerLogger
  }
]

const router = createRouter({
  routes,
  history: createWebHashHistory(),
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
