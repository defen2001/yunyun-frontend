import { showNotify } from 'vant'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        title: string
        requiresAuth?: boolean
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/home',
        component: () => import(`@/layouts/TabBar.vue`),
        children: [
            {
                path: '/home',
                meta: { title: '芸芸偕行' },
                component: () => import(`@/pages/home/Home.vue`),
            },
            {
                path: '/team',
                meta: { title: '队伍' },
                component: () => import(`@/pages/team/Team.vue`),
            },
            {
                path: '/mine',
                meta: { title: '我的' },
                component: () => import(`@/pages/mine/Mine.vue`),
            },
        ],
    },
    {
        path: '/login',
        meta: { title: '登录' },
        component: () => import(`@/pages/Login.vue`),
    },
    {
        path: '/account',
        meta: { title: '账号信息', requiresAuth: true },
        component: () => import(`@/pages/mine/account/AccountInfo.vue`),
    },
    {
        path: '/account/username',
        meta: { title: '编辑昵称', requiresAuth: true },
        component: () => import(`@/pages/mine/account/EditUsername.vue`),
        props: (route) => ({ username: route.query.data }),
    },
    {
        path: '/account/profile',
        meta: { title: '个人简介', requiresAuth: true },
        component: () => import(`@/pages/mine/account/EditProfile.vue`),
        props: (route) => ({ profile: route.query.data }),
    },
    {
        path: '/account/phone',
        meta: { title: '换绑手机', requiresAuth: true },
        component: () => import(`@/pages/mine/account/EditPhone.vue`),
    },
    {
        path: '/account/password',
        meta: { title: '修改密码', requiresAuth: true },
        component: () => import(`@/pages/mine/account/EditPassword.vue`),
        props: (route) => ({ phone: route.query.data }),
    },
    {
        path: '/account/tags',
        meta: { title: '编辑标签', requiresAuth: true },
        component: () => import(`@/pages/mine/account/EditTags.vue`),
    },
    {
        path: '/mine/message',
        meta: { title: '消息', requiresAuth: true },
        component: () => import(`@/pages/mine/Message.vue`),
    },
    {
        path: '/search',
        meta: { title: '伙伴搜索' },
        component: () => import(`@/pages/home/Search.vue`),
    },
    {
        path: '/search/result',
        meta: { title: '伙伴搜索' },
        component: () => import(`@/pages/home/SearchResult.vue`),
        props: (route) => ({ tags: route.query.tags }),
    },
    {
        path: '/user/:userId',
        meta: { title: '用户信息' },
        component: () => import(`@/pages/User.vue`),
        props: (route) => ({
            userId: route.params.userId,
        }),
    },
    {
        path: '/team/:teamId',
        meta: { title: '队伍信息', requiresAuth: true },
        component: () => import(`@/pages/team/TeamInfo.vue`),
        props: (route) => ({
            teamId: route.params.teamId,
        }),
    },
    {
        path: '/team/create',
        meta: { title: '创建队伍', requiresAuth: true },
        component: () => import(`@/pages/team/TeamInfoEdit.vue`),
        props: () => ({
            teamId: null,
            type: 'create',
        }),
    },
    {
        path: '/team/edit/:teamId',
        meta: { title: '编辑队伍信息', requiresAuth: true },
        component: () => import(`@/pages/team/TeamInfoEdit.vue`),
        props: (route) => ({
            teamId: route.params.teamId,
            type: 'edit',
        }),
    },
    {
        path: '/team/invite/:code',
        name: 'acceptInvite',
        meta: { title: '受邀加入队伍', requiresAuth: true },
        component: () => import(`@/pages/team/TeamAcceptInvite.vue`),
        props: (route) => ({
            code: route.params.code,
        }),
    },
]

const router = createRouter({
    history: createWebHistory(), routes: routes,
})

router.beforeEach((to) => {
    if (
        to.meta.requiresAuth &&
        to.path !== '/login' &&
        !localStorage.getItem('token')
    ) {
        showNotify({ type: 'warning', message: '登录以继续' })
        return { path: '/login' }
    }
    document.title = to.meta.title as string
})

export default router
