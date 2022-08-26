import { accessRoutes, basicRouter, getAsyncRouter } from '@/router/router.config';
import { defineStore } from 'pinia';

import type { RouteRecordRaw } from 'vue-router';
import { store } from '../index';

export interface MenuList {
	title: string;
	path: string;
	icon?: string;
	keys?: string;
	children?: MenuList[];
}

interface PermissioState {
	auths: string[]; // 当前用户权限
	menuList: MenuList[];
	role: string;
	isGetUser: boolean;
	ceshiRef: any;
}

type IAuth = { auth?: string[]; role?: string };

const filterAsyncRoutes = (routes: RouteRecordRaw[], role: string): RouteRecordRaw[] => {
	const res: RouteRecordRaw[] = [];
	routes.forEach((route) => {
		const { auth } = (route.meta as IAuth) || {};
		if (!auth) {
			if (route.children) {
				route.children = filterAsyncRoutes(route.children, role);
			}
			res.push(route);
		} else {
			if (auth.includes(role)) {
				if (route.children) {
					route.children = filterAsyncRoutes(route.children, role);
				}
				res.push(route);
			}
		}
	});
	return res;
};

const filterMenuRoute = (list: RouteRecordRaw[], path = '') => {
	const menus: MenuList[] = [];
	list.forEach((it) => {
		const keys = `${path}${it.path.startsWith('/') ? '' : '/'}${it.path}`;
		const temp: MenuList = {
			title: it.meta?.title as string,
			path: keys,
			keys,
		};
		if (it.children && it.children.length > 0) {
			temp.children = filterMenuRoute(it.children, temp.path);
		}
		if (!it.meta?.isDetail) {
			menus.push(temp);
		}
	});
	return menus;
};

export const usePermissioStore = defineStore({
	id: 'app-permission',
	state: (): PermissioState => {
		return {
			ceshiRef: null,
			isGetUser: false,
			auths: [],
			role: 'home',
			menuList: [],
		};
	},
	getters: {
		getAuths(): string[] {
			return this.auths;
		},

		getMenuList(): MenuList[] {
			return this.menuList;
		},
	},
	actions: {
		setAuths(roles: string[]) {
			this.auths = roles;
		},
		setRole(role: string) {
			this.role = role;
		},
		setMenuList(menus: MenuList[]) {
			this.menuList = menus.filter((it) => it.children && it.children.length > 0);
		},
		resetStata() {
			this.isGetUser = false;
			this.auths = [];
			this.role = '';
			this.menuList = [];
		},

		/**
		 * @name fetchAuths
		 * @description 获取当前用户权限
		 */
		async fetchAuths() {
			// 获取用户信息，包括当前的角色列表
			const res = await getAsyncRouter();
			if (res) {
				this.setAuths(['admin']); // 角色列表
				this.setRole('admin');
			}
			return res;
		},

		/**
		 * @name buildRoutesAction
		 * @description: 获取路由
		 */
		async buildRoutesAction(): Promise<RouteRecordRaw[]> {
			// 404 路由一定要放在 权限路由后面
			const filterMenu = filterAsyncRoutes(accessRoutes, this.role);
			const routes: RouteRecordRaw[] = [...filterMenu, ...basicRouter];
			this.setMenuList(filterMenuRoute(filterMenu));
			return routes;
		},
	},
});

// Need to be used outside the setup
export function usePermissioStoreWithOut() {
	return usePermissioStore(store);
}
