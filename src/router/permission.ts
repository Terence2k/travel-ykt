/**
 * @name permission
 * @description 全局路由过滤、权限过滤
 */

import type { RouteLocationNormalized } from 'vue-router';
import { usePermissioStore } from '@/stores/modules/permission';
import router from './index';

const whiteList = ['/login', "/login/userLogin", "/login/businessLogin"]; // no redirect whitelist
let first = true;
// const modules = import.meta.glob("../views/**/index.vue");
router.beforeEach(async (to: RouteLocationNormalized, _, next) => {
	const hasTokne = window.localStorage.getItem('authorization');
	if (hasTokne) {
		// 已经登录
		if (to.path === '/login') {
			next({ path: '/' });
		} else {
			if (first) {
				const permissioStore = usePermissioStore();
				first = false;
				// 没有获取，请求数据
				await permissioStore.fetchAuths();
				// 过滤权限路由
				const routes = await permissioStore.buildRoutesAction();
				// 404 路由一定要放在 权限路由后面
				routes.forEach((route) => {
					router.addRoute(route);
				});
				// console.log(router.getRoutes());
				next({ ...to, replace: true });
			} else {
				next();
			}
			//是否获取过用户信息
		}
	} else {
		// 未登录
		if (whiteList.indexOf(to.path) !== -1) {
			next();
		} else {
			next('/login');
		}
	}
});
