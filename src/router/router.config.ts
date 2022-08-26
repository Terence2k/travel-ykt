import type { RouteRecordRaw } from 'vue-router';

export const basicRouter = [
	{
		path: '/:pathMatch(.*)',
		redirect: '/404',
	},
	{
		path: '/',
		component: () => import('../components/layout/index.vue'),
		children: [
			{
				path: '404',
				component: () => import('../views/404.vue'),
			},
		],
	},
];

export const accessRoutes: RouteRecordRaw[] = [
	{
		path: '/user',
		name: '',
		redirect: '/user/person_list',
		meta: {
			title: '用户管理',
		},
		component: () => import('../components/layout/index.vue'),
		children: [
			{
				path: 'person_list',
				component: () => import('../views/user/list/index.vue'),
				name: '',
				meta: {
					title: '用户列表',
					icon: 'liulanqi',
					// auth: ["admin"],
				},
			},
			{
				path: 'person_list/:id',
				component: () => import('../views/user/detail/index.vue'),
				name: '',
				meta: {
					title: '用户详情',
					icon: 'liulanqi',
					// auth: ["admin"],
					isDetail: true, // 在左侧的导航栏不会展示
				},
			},
		],
	},
	{
		path: '/operation',
		name: '',
		redirect: '/operation/list',
		meta: {
			title: '运营管理',
		},
		component: () => import('../components/layout/index.vue'),
		children: [
			{
				path: 'list',
				component: () => import('../views/operation/list/index.vue'),
				name: '',
				meta: {
					title: '运营人员列表',
					icon: 'liulanqi',
					// isDetail: true, // 在左侧的导航栏不会展示
					// auth: ["admin"],
				},
			},
		],
	},
];

export const constantRoutes: RouteRecordRaw[] = [
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/login/index.vue'),
	},
];

export const getAsyncRouter = async (): Promise<RouteRecordRaw[]> => {
	return accessRoutes;
};
