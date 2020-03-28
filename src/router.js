import Vue from "vue";
import VueRouter from "vue-router";
import AuthRequired from "./utils/AuthRequired";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "app" */ './views/app'),
    redirect: '/quanly/khachhang',
    beforeEnter: AuthRequired,
    children: [
      {
        path: 'quanly',
        component: () => import(/* webpackChunkName: "piaf" */ './views/app/piaf'),
        redirect: '/quanly/khachhang',
        children: [
          { path: 'khachhang', component: () => import(/* webpackChunkName: "piaf" */ './views/quanly/KhachHang') }
        ],
      },
      {
        path: 'app/second-menu',
        component: () => import(/* webpackChunkName: "second-menu" */ './views/app/secondMenu'),
        redirect: '/app/second-menu/second',
        children: [
          { path: 'second', component: () => import(/* webpackChunkName: "second-menu" */ './views/app/secondMenu/Second') }
        ]
      },
      {
        path: 'app/single',
        component: () => import(/* webpackChunkName: "single" */ './views/app/single')
      }
    ]
  },
  { path: '/error', component: () => import(/* webpackChunkName: "error" */ './views/Error') },
  {
    path: '/user',
    component: () => import(/* webpackChunkName: "user" */ './views/user'),
    redirect: '/user/login',
    children: [
      { path: 'login', component: () => import(/* webpackChunkName: "user" */ './views/user/Login') },
      { path: 'register', component: () => import(/* webpackChunkName: "user" */ './views/user/Register') },
      { path: 'forgot-password', component: () => import(/* webpackChunkName: "user" */ './views/user/ForgotPassword') }
    ]
  },
  {
    path: '/quanly',
    component: () => import(/* webpackChunkName: "user" */ './views/quanly'),
    redirect: '/quanly/khachhang',
    children: [
      { path: 'index', component: () => import(/* webpackChunkName: "user" */ './views/quanly/KhachHang') },
    ]
  },
  { path: '*', component: () => import(/* webpackChunkName: "error" */ './views/Error') }
];

const router = new VueRouter({
  linkActiveClass: "active",
  routes,
  mode: "history"
});

export default router;
