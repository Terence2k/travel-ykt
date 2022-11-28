import { defineStore } from 'pinia';
import { store } from '../index';

export const useMenuManage = defineStore('menuManage', {
	state: () => ({
		menuType: {
      0: '菜单夹',
      1: '功能模块',
      2: 'tab页',
      3: '按钮'
    },
    menuStatus: {
      0: '关闭',
      1: '开启',
    }
	}),
	getters: {
	},
	actions: {
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useMenuManage(store);
}
