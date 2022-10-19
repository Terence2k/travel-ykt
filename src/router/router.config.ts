import type { RouteRecordRaw } from 'vue-router';
// import userRouter from './modules/user.router';
import baseInfoRoute from './modules/baseInfo.route';
import hotelManagementRoute from './modules/hotelManagement.route';
import travelGroupRoute from './modules/travelGroup.route';
import gouvyRoute from './modules/gouvy.route';
import settlementRoute from './modules/settlement.route';
import cateringManageRoute from './modules/catering.route';
import scenicSpot from './modules/scenicSpot.route';
import reportManagement from './modules/reportManagement.route';
export const basicRouter = [
	// {
	// 	path: '/',
	// 	// redirect: '/baseInfo/user_manage',
	// },
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
	//vue3新写法 vue2原来写法不兼容
	{
		path: '/:pathMatch(.*)',
		component: () => import('@/views/404.vue'),
		children: [
			{
				path: '404',
				component: () => import('../views/404.vue'),
			},
		],
	},
];

export const accessRoutes: RouteRecordRaw[] = [
	...travelGroupRoute,
	...hotelManagementRoute,
	...baseInfoRoute,
	...scenicSpot,
	...cateringManageRoute,
	...gouvyRoute,
	...settlementRoute,
	...reportManagement,
];

export const constantRoutes: RouteRecordRaw[] = [
	{
		path: '/login',
		name: 'login',
		redirect: '/login/userLogin',
		component: () => import('../views/login/index.vue'),
		children: [
			{
				path: 'userLogin',
				name: 'userLogin',
				component: () => import('@/views/login/Form.vue'),
			},
			{
				path: 'businessLogin',
				name: 'businessLogin',
				component: () => import('@/views/login/businessLogin.vue'),
			},
		],
	},
];

export const getAsyncRouter = async (): Promise<RouteRecordRaw[]> => {
	return accessRoutes;
};
