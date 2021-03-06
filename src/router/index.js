import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/pages/Home'
import Auth from '../views/pages/Auth'
import User from '../views/pages/User'

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {layout: 'main', title: 'Главная',},
    component: Home
  },
  {
    path: '/user/:usr_id',
    name: 'UserID',
    title: 'Профиль',
    meta: {layout: 'main', title: 'Профиль', },
    component: User,
  },
  {
    path: '/auth/:socnet',
    name: 'Auth',
    meta:{title: 'Авторизация',},
    component: Auth,
  },
  {
    path: '/test/:id/editor',
    name: 'TestEditor',
    meta: {layout: 'main', title: 'Редактор теста',},
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/pages/TestEditor.vue')
  },
  {
    path: '/test/:id',
    name: 'TestBasic',
    meta: {layout: 'main', title:'Тестирование'},
    component: () => import(/* webpackChunkName: "about" */ '../views/pages/TestBasic.vue')
  },
  {
    path: '/gtest/:gid',
    name: 'GroupTestBasic',
    meta: {layout: 'main', title:'Тестирование'},
    component: () => import(/* webpackChunkName: "about" */ '../views/pages/TestBasic.vue')
  },
  {
    path: '/result/:id',
    name: 'TestResult',
    meta: {layout: 'main', title:'Результат теста'},
    component: () => import('../views/pages/TestResult.vue')
  },
  {
    path: '/mytests',
    name: 'MyTests',
    meta: {layout: 'main', title:'Тесты'},
    component: () => import('../views/pages/MyTests.vue')
  },
  {
    path: '/myresults',
    name: 'MyResults',
    meta: {layout: 'main', title:'Результаты'},
    component: () => import('../views/pages/MyResults.vue')
  },
  {
    path: '/groups',
    name: 'Groups',
    meta: {layout: 'main', title:'Группы'},
    component: () => import('../views/pages/Groups.vue')
  },
  {
    path: '/group/:id',
    name: 'Group',
    meta: {layout: 'main', title:'Группа'},
    component: () => import('../views/pages/Group.vue')
  },

  //Администрирование
  {
    path: '/admin',
    name: 'Admin',
    meta: {layout: 'admin', title:'Admin-панель'},
    component: () => import('../admin/pages/Home.vue')
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    meta: {layout: 'admin', title:'Пользователи'},
    component: () => import('../admin/pages/Users.vue')
  },
  {
    path: '/admin/communities',
    name: 'AdminCommunities',
    meta: {layout: 'admin', title:'Классы'},
    component: () => import('../admin/pages/Communities.vue')
  },
  {
    path: '/admin/accounts',
    name: 'AdminAccounts',
    meta: {layout: 'admin', title:'Аккаунты'},
    component: () => import('../admin/pages/Accounts.vue')
  },
  {
    path: '/admin/groups',
    name: 'AdminGroups',
    meta: {layout: 'admin', title:'Группы'},
    component: () => import('../admin/pages/Groups.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
