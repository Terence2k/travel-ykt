import type { RouteRecordRaw } from 'vue-router';
// import userRouter from './modules/user.router';
import baseInfoRoute from './modules/baseInfo.route';
import travelGroupRoute from './modules/travelGroup.route';

export const basicRouter = [
	{
		path: '/',
		redirect: '/travel/index',
	},
	{
		path: '/404',
		component: () => import('../components/layout/index.vue'),
		children: [
			{
				path: '404',
				component: () => import('../views/404.vue'),
			},
		],
	},
];

export const accessRoutes: RouteRecordRaw[] = [...travelGroupRoute, ...baseInfoRoute];

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
