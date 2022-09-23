import { defineStore } from 'pinia';
import { store } from '../index';

export const useRoleManage = defineStore('roleManage', {
	state: () => ({
		businessType: [
      {
        value: 0,
        title: '所有'
      },
      {
        value: 1,
        title: '酒店'
      },
      {
        value: 2,
        title: '旅行社'
      },
      {
        value: 3,
        title: '门票'
      },
      {
        value: 4,
        title: '餐饮'
      },
      {
        value: 5,
        title: '一卡通'
      },
      {
        value: 6,
        title: '监理'
      },
      {
        value: 7,
        title: '协会'
      },
      {
        value: 8,
        title: '集团'
      },
      {
        value: 9,
        title: '文旅居'
      },
    ]
	}),
	getters: {
	},
	actions: {
	},
});

// Need to be used outside the setup
export function useCounterWithOut() {
	return useRoleManage(store);
}
