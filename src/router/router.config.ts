import type { RouteRecordRaw } from 'vue-router';
import userRouter from './modules/user.router';

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
	...userRouter
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
